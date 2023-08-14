import { moveColumn, moveTask } from "@/service";
import { DropResult, DraggableLocation } from "react-beautiful-dnd";

// import { TasksActionType, TaskActions } from "@/context/TaskContext/TaskAction";

const handleMoveColumn = async (
  boardId: string,
  tasksDispatch: React.Dispatch<any>,
  sourceIndex: number,
  destinationIndex: number
) => {
  if (sourceIndex !== destinationIndex) {
    // tasksDispatch({
    //   type: TasksActionType.MOVE_COLUMN,
    //   payload: { sourceIndex, destinationIndex },
    // });
    moveColumn({
      boardId,
      payload: {
        sourceIndex,
        destinationIndex,
      },
    });
  }
};

const handleMoveTask = async (
  boardId: string,
  tasksDispatch: React.Dispatch<any>,
  // tasksDispatch: React.Dispatch<TaskActions>,
  tasks: any[],
  source: DraggableLocation,
  destination: DraggableLocation
) => {
  const indexOfSourceColumn = tasks.findIndex(({ _id }) => _id === source.droppableId);
  const indexOfDestinationColumn = tasks.findIndex(({ _id }) => _id === destination.droppableId);

  // tasksDispatch({
  //   type: TasksActionType.MOVE_TASK,
  //   payload: {
  //     column: {
  //       sourceIndex: indexOfSourceColumn,
  //       destinationIndex: indexOfDestinationColumn,
  //     },
  //     task: {
  //       sourceIndex: source.index,
  //       destinationIndex: destination.index,
  //     },
  //   },
  // });

  const sourceIndexes = { columnIndex: indexOfSourceColumn, taskIndex: source.index };
  const destinationIndexes = {
    columnIndex: indexOfDestinationColumn,
    taskIndex: destination.index,
  };
  if (
    sourceIndexes.columnIndex !== destinationIndexes.columnIndex ||
    sourceIndexes.taskIndex !== destinationIndexes.taskIndex
  ) {
    moveTask({
      boardId,
      payload: {
        source: sourceIndexes,
        destination: destinationIndexes,
      },
    });
  }
};

export const onDragEnd = (
  boardId: string,
  result: DropResult,
  tasks: any[],
  tasksDispatch: any
) => {
  if (!result.destination) return;

  const { source, destination, type } = result;
  if (type === "droppableTaskToColumn") {
    // handleMoveTask(boardId, tasksDispatch, tasks, source, destination);
  } else if (type === "droppableColumn") {
    // handleMoveColumn(boardId, tasksDispatch, source.index, destination.index);
  }
};
