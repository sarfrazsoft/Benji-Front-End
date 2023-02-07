export function getFirstBoard(boardsArray) {
  let firstBoard;
  for (let i = 0; i < boardsArray.length; i++) {
    const board = boardsArray[i];
    if (board.previous_board === null) {
      firstBoard = board;
      break;
    }
  }
  if (!firstBoard) {
    // No board found with previous_board as null, cannot determine first board
    // find the board that has `previous_board` set to id of a board that does not exist in the list.
    for (let i = 0; i < boardsArray.length; i++) {
      const board = boardsArray[i];
      if (!boardsArray.find((b) => b.id === board.previous_board)) {
        const orphanBoard = board;
        // call a separate function with that board
        // this.handleOrphanBoard(orphanBoard);
        break;
      }
    }

    throw new Error('No board found with previous_board as null, cannot determine first board');
  }

  return firstBoard;
}
