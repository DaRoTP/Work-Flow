const Board = require("../../models/board");
const User = require("../../models/user");
const paginateContent = require("../../helper/pagination");
const { ResponseError } = require("../../error/");

const boardMemberService = {};

boardMemberService.getBoardMembers = async (req, res) => {
  const { boardId } = req.params;
  const { page, limit } = req.query;
  const searchUsername = req.query.username || "";

  try {
    let { members } = await Board.findOne({ _id: boardId }, "members").populate({
      path: "members",
      populate: {
        path: "user",
        select: "_id username avatarImageURL",
      },
    });

    if (members.length > 0 && !!searchUsername) {
      members = members.filter(({ user }) =>
        user.username.toLowerCase().includes(searchUsername.toLowerCase())
      );
    }

    if (!!page && !!limit) {
      const { items, next, prev, totalPageCount } = paginateContent(members, page, limit);
      return res.status(200).json({ members: items, next, prev, totalPageCount });
    }

    return res.status(200).json({ members });
  } catch (error) {
    next(error);
  }
};
boardMemberService.getBoardMember = async (req, res) => {
  const { boardId, userId } = req.params;
  try {
    let { members } = await Board.findOne({ _id: boardId }, "members").populate({
      path: "members",
      populate: {
        path: "user",
        select: "_id username avatarImageURL email name surname",
      },
    });
    const member = members.find(
      ({ user }) => user._id.toLocaleString() === userId.toLocaleString()
    );
    if (!member) {
      throw new ResponseError({ member: "member with given id is not a part of this board" }, 404);
    }
    return res.status(200).json({ member });
  } catch (error) {
    next(error);
  }
};
boardMemberService.removeUserFromBoard = async (req, res) => {
  const { boardId, userId } = req.params;
  try {
    let foundBoard = await Board.findOne({ _id: boardId }, "_id members");
    foundBoard.members = foundBoard.members.filter(
      ({ user }) => user.toLocaleString() !== userId.toLocaleString()
    );
    foundBoard.save();
    return res.status(200).json({ message: "user removed from board" });
  } catch (error) {
    next(error);
  }
};
boardMemberService.addNewUser = async (req, res) => {
  const { boardId } = req.params;
  const { userId } = req.query;
  try {
    await Board.findOneAndUpdate(
      { _id: boardId },
      { $push: { members: { user: userId } } },
      { useFindAndModify: false }
    );
    const foundBoard = await Board.findOne({ _id: boardId }, "name");
    const notification = {
      title: foundBoard.name,
      info: "you have been added to the board",
      url: `/board/${boardId}`,
    };
    await User.findOneAndUpdate({ _id: userId }, { $push: { notifications: notification } });
    return res.status(200).json({ message: "user added to the board" });
  } catch (error) {
    next(error);
  }
};
boardMemberService.changeUserRole = async (req, res) => {
  const { userId, boardId } = req.params;
  const { newRole } = req.query;

  if (!newRole) {
    return res.status(400).json({ message: "role was not given" });
  }

  try {
    const foundBoard = await Board.findOne({ _id: boardId }, "_id members name");
    const foundUSer = await User.findOne({ _id: userId }, "_id notifications");
    foundBoard.members.forEach(({ user }, index) => {
      if (user._id.toLocaleString() === userId.toLocaleString()) {
        foundBoard.members[index].role = newRole;
      }
    });
    await foundBoard.save();
    foundUSer.notifications.push({
      title: foundBoard.name,
      info: `assigned new role - ${newRole}`,
    });
    await foundUSer.save();
    return res.status(200).json({ message: "role changed", role: newRole });
  } catch (error) {
    next(error);
  }
};

module.exports = boardMemberService;
