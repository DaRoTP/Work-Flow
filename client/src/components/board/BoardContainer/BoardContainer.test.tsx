import { screen } from "@testing-library/react";
import BoardContainer from "./BoardContainer";
import { renderWithProviders } from "@/test/utils";

describe("Test Component - BoardContainer", () => {
  const testBoardList: (Board & { isPinned: boolean })[] = [
    {
      _id: "1",
      name: "board one",
      timeCreated: new Date(),
      description: "test description",
      isPinned: false,
    },
    {
      _id: "2",
      name: "board two",
      timeCreated: new Date(),
      description: "test description",
      isPinned: false,
    },
    {
      _id: "3",
      name: "board three",
      timeCreated: new Date(),
      description: "test description",
      isPinned: false,
    },
  ];

  const togglePinMock = vi.fn();

  it("should render message when there are no boards to render", () => {
    const emptyContainerMessage = "empty container";
    renderWithProviders(
      <BoardContainer
        boards={[]}
        noBoardsMessage={emptyContainerMessage}
        togglePinBoard={togglePinMock}
        numberOfLoadingItems={4}
      />,
    );

    expect(screen.queryByText(emptyContainerMessage)).toBeInTheDocument();
  });

  it("should not render message when there are boards provided", () => {
    const emptyContainerMessage = "empty container";
    renderWithProviders(
      <BoardContainer
        boards={testBoardList}
        noBoardsMessage={emptyContainerMessage}
        togglePinBoard={togglePinMock}
        numberOfLoadingItems={4}
      />,
    );

    expect(screen.queryByText(emptyContainerMessage)).not.toBeInTheDocument();
  });

  it("should not render message when there are no boards provided and isLoading is set tot true", () => {
    const emptyContainerMessage = "empty container";
    renderWithProviders(
      <BoardContainer
        boards={[]}
        noBoardsMessage={emptyContainerMessage}
        togglePinBoard={togglePinMock}
        isLoading={true}
        numberOfLoadingItems={4}
      />,
    );

    expect(screen.queryByText(emptyContainerMessage)).not.toBeInTheDocument();
  });

  it("should render boards when isLoading is false", () => {
    const loadingBoardsCount = 5;

    renderWithProviders(
      <BoardContainer
        boards={testBoardList}
        togglePinBoard={togglePinMock}
        isLoading={false}
        numberOfLoadingItems={loadingBoardsCount}
      />,
    );

    expect(screen.queryAllByTestId("skeleton-board-card")).toHaveLength(0);
    expect(screen.queryAllByTestId("board-card")).toHaveLength(testBoardList.length);
  });

  it("should render boards skeleton when isLoading is true", () => {
    const loadingBoardsCount = 5;

    renderWithProviders(
      <BoardContainer
        boards={testBoardList}
        togglePinBoard={togglePinMock}
        isLoading={true}
        numberOfLoadingItems={loadingBoardsCount}
      />,
    );

    expect(screen.queryAllByTestId("skeleton-board-card")).toHaveLength(loadingBoardsCount);
    expect(screen.queryAllByTestId("board-card")).toHaveLength(0);
  });
});