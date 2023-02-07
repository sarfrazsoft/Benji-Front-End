import { getBoard } from '../get-board/get-board';

export function insertBoard(newBoard, boardArray) {
  try {
    if (!newBoard || !boardArray) {
      throw new Error('Both `id` and `boardArray` are required arguments.');
    }

    let previousBoard = null;
    let nextBoard = null;
    // insert the board at the end of the array
    const insertIndex = boardArray.length - 1;

    // find next and previous board
    if (newBoard.next_board) {
      nextBoard = getBoard(newBoard.next_board, boardArray);
    }

    if (newBoard.previous_board) {
      previousBoard = getBoard(newBoard.previous_board, boardArray);
    }

    boardArray.push(newBoard);

    // update the previous board to point to the new board
    if (previousBoard) {
      previousBoard.next_board = newBoard.id;
    }

    // update the next board to point to the new board
    if (nextBoard) {
      nextBoard.previous_board = newBoard.id;
    }
  } catch (error) {
    console.error(error);
  }
}
