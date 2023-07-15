import { UserRepository } from "../repositories/index.js";
import { Service, Inject } from "typedi";
import { IUser } from "../types/database/index.js";
import { Pagination } from "../types/utils.type.js";
import { UserDTO, BoardDTO } from "../types/dto/index.js";
import { BoardMapper, UserMapper } from "../mappers/index.js";

@Service()
export class UserService {
  userRepository: UserRepository;

  constructor(@Inject() userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async getUser(userId: string): Promise<UserDTO> {
    const user = await this.userRepository.getById(userId);
    return UserMapper(user);
  }

  async getAllUsers(options: Pagination): Promise<{ totalCount: number; users: UserDTO[] }> {
    const result = await this.userRepository.getAllUser(options);
    return {
      ...result,
      users: result.data.map(UserMapper),
    };
  }

  async getUsersByMatchUsername(
    username: string,
    options: Pagination,
  ): Promise<{ totalCount: number; users: UserDTO[] }> {
    const result = await this.userRepository.getUsersByMatchUsername(username, options);
    return {
      ...result,
      users: result.data.map(UserMapper),
    };
  }

  async updateUserInfo(userId: string, userData: IUser): Promise<UserDTO> {
    const user = await this.userRepository.updateUser(userId, userData);
    return UserMapper(user);
  }

  async getUserPinnedBoards(userId: string): Promise<BoardDTO[]> {
    const boards = await this.userRepository.getUserPinnedCollection(userId);
    return boards.map(BoardMapper);
  }

  async togglePinBoard(userId: string, boardId: string): Promise<boolean> {
    const boards = await this.userRepository.getUserPinnedCollection(userId);
    if (boards.find(({ _id }) => _id.equals(boardId))) {
      await this.userRepository.removeBoardFromPinnedCollection(userId, boardId);
      return false;
    } else {
      await this.userRepository.addBoardToPinnedCollection(userId, boardId);
      return true;
    }
  }
}