export function getLastBoard(boardsArray) {
  let lastBoard;
  for (let i = 0; i < boardsArray.length; i++) {
    const board = boardsArray[i];
    if (board.next_board === null) {
      lastBoard = board;
      break;
    }
  }
  if (!lastBoard) {
    // No board found with next_board as null, cannot determine last board
    // find the board that has `next_board` set to id of a board that does not exist in the list.
    for (let i = 0; i < boardsArray.length; i++) {
      const board = boardsArray[i];
      if (!boardsArray.find((b) => b.id === board.next_board)) {
        const orphanBoard = board;
        // call a separate function with that board
        // this.handleOrphanBoard(orphanBoard);
        break;
      }
    }

    throw new Error('No board found with next_board as null, cannot determine last board');
  }

  return lastBoard;
}
