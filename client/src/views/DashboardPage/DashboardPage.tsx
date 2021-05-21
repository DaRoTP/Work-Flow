import React, { useState, useContext, useEffect } from "react";
import { ReactComponent as Pin } from "assets/images/pin-full.svg";
import "./DashboardPage.scss";
import AddBoxIcon from "@material-ui/icons/AddBox";
import DashboardIcon from "@material-ui/icons/Dashboard";
import Button from "components/general/Button";
import BoardEditor from "components/modalForms/BoardEditor/BoardEditor";
import ContainerBox from "components/layout/ContainerBox/ContainerBox";
import { ModalContext } from "context/ModalContext";
import { getPinnedBoards, getMyBoards, togglePinBoard } from "service";

import MyBoardContainer from "./MyBoardContainer";


const DashboardPage: React.FC = () => {
	const [page, setPage] = useState<{ currentPage: number; amountOfPages: number}>({
    currentPage: 1,
    amountOfPages: 1,
  });
	const [pinnedBoards, setPinnedBoards] = useState<{ items: any; isLoading: boolean }>({
    items: [],
    isLoading: false,
  });
	const [boards, setBoards] = useState<{ items: any; isLoading: boolean }>({
    items: [],
    isLoading: false,
  });
	const [, modalDispatch] = useContext(ModalContext);

	const boardLoadingHandler = (setState: any, loadingState: any) => {
		setState((prevState: any) => ({...prevState, isLoading: loadingState}))
	}

	const handelPinnedBoard = (loadingState: boolean) => boardLoadingHandler(setPinnedBoards, loadingState)
	const handelBoard = (loadingState: boolean) => boardLoadingHandler(setBoards, loadingState);

	useEffect(() => {
		const getPinnedBoardss = async () => {
			const { data } = await getPinnedBoards({ setLoading: handelPinnedBoard });
			if (!!data) setPinnedBoards(prevState => ({...prevState, items: data}));
		};
		getPinnedBoardss();
		return () => {};
	}, []);

	useEffect(() => {
		const getMyBoardss = async () => {
			const { data } = await getMyBoards({ page: page.currentPage, limit: 8, setLoading: handelBoard });
			if (!!data) {
				setPage((prevState) => ({ ...prevState, amountOfPages: data.totalPageCount }));
				setBoards(prevState => ({...prevState, items: data.items}));
			}
		};
		getMyBoardss();
		return () => {};
	}, [page.currentPage]);

	const openCreateNewBoardModal = () => {
		modalDispatch({
			type: "OPEN",
			payload: {
				render: <BoardEditor submitType="Create" />,
				title: "New Board",
			},
		});
	};

	const removeBoard = (boardId: number) => {
		const indexOfBoardInBoardList = boards.items.findIndex(({ _id }: any) => _id === boardId);
		const indexOfBoardInPinnedBoardList = pinnedBoards.items.findIndex(({ _id }: any) => _id === boardId);

		if (indexOfBoardInBoardList > -1) {
			setBoards((boards) => {
				const newBoards = [...boards.items];
				newBoards.splice(indexOfBoardInBoardList, 1);
				return ({...boards, items: newBoards});
			});
		}

		if (indexOfBoardInPinnedBoardList > -1) {
			setPinnedBoards((boards) => {
				const newBoards = [...boards.items];
				newBoards.splice(indexOfBoardInPinnedBoardList, 1);
				return ({...boards, items: newBoards });
			});
		}
	};

	const togglePinBoardHandler = async (boardIndex: number, pinnedBoardIndex: number) => {
		const foundPinnedBoardIndex =
			pinnedBoardIndex > -1
				? pinnedBoardIndex
				: pinnedBoards.items.findIndex((board: any) => board._id === boards.items[boardIndex]._id);
		const foundBoardIndex =
			boardIndex > -1
				? boardIndex
				: boards.items.findIndex((board: any) => board._id === pinnedBoards.items[pinnedBoardIndex]._id);
		const { data } = await togglePinBoard({ boardId: boards.items[foundBoardIndex]._id });
		if (!!data) {
			setPinnedBoards((pinnedBoards) => {
				const tempPinnedBoards = [...pinnedBoards.items];

				if (boards.items[foundBoardIndex].pinned) {
					tempPinnedBoards.splice(foundPinnedBoardIndex, 1);
				} else {
					tempPinnedBoards.push({ ...boards.items[foundBoardIndex], pinned: true });
				}
				return ({...pinnedBoards, items: tempPinnedBoards});
			});

			setBoards((boards) => {
				const modifiedBoards = [...boards.items];
				modifiedBoards[foundBoardIndex].pinned = !modifiedBoards[foundBoardIndex].pinned;
				return ({...boards, items: modifiedBoards});
			});
		}
	};

	const changePage = (pageNumber: number) => {
		setPage((pageState) => ({ ...pageState, currentPage: pageNumber }));
	};

	return (
    <ContainerBox className="dashboard-container">
      <MyBoardContainer
        classes={["pinned-boards"]}
        title={"Pinned"}
        renderIcon={<Pin className="pin-icon" />}
        boardList={pinnedBoards.items}
        isLoading={pinnedBoards.isLoading}
        removeBoard={removeBoard}
        togglePinBoard={(index) => togglePinBoardHandler(-1, index)}
        emptyMessage={"you have no pinned boards"}
      />
      <Button onClick={openCreateNewBoardModal} className="new-board-btn">
        <AddBoxIcon />
        New Board
      </Button>
      <MyBoardContainer
        classes={["main-boards"]}
        title={"Boards"}
        renderIcon={<DashboardIcon className="board-icon" />}
        boardList={boards.items}
        isLoading={boards.isLoading}
        removeBoard={removeBoard}
        changePage={changePage}
        page={page}
        togglePinBoard={(index) => togglePinBoardHandler(index, -1)}
        emptyMessage={"you are not a part of any board"}
      />
    </ContainerBox>
  );
}

export default DashboardPage;
