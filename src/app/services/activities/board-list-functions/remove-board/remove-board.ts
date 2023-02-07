import { getBoard } from '../get-board/get-board';

export function removeBoard(id, boardArray) {
  try {
    if (!id || !boardArray) {
      throw new Error('Both `id` and `boardArray` are required arguments.');
    }

    let currentBoard = null;
    let previousBoardId = null;
    let nextBoardId = null;

    currentBoard = getBoard(id, boardArray);
    previousBoardId = currentBoard.previous_board;
    nextBoardId = currentBoard.next_board;

    if (!currentBoard) {
      throw new Error(`No board was found with the id "${id}".`);
    }

    // remove the board from the array
    boardArray.splice(boardArray.indexOf(currentBoard), 1);

    // update the previous board to point to the next board
    if (previousBoardId) {
      for (let i = 0; i < boardArray.length; i++) {
        if (boardArray[i].id === previousBoardId) {
          boardArray[i].next_board = nextBoardId;
          break;
        }
      }
    }

    // update the next board to point to the previous board
    if (nextBoardId) {
      for (let i = 0; i < boardArray.length; i++) {
        if (boardArray[i].id === nextBoardId) {
          boardArray[i].previous_board = previousBoardId;
          break;
        }
      }
    }
  } catch (error) {
    console.error(`An error occurred while trying to remove the board with id "${id}": ${error}`);
  }
}
