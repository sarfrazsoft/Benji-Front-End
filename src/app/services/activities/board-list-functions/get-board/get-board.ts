import { Board } from 'src/app/services/backend/schema';

export function getBoard(boardId: number, boards: Array<any>): any {
  let board;
  try {
    boards.forEach((b) => {
      if (b.id === boardId) {
        board = b;
      }
    });
    if (!board) {
      throw new Error(`Board with id "${boardId}" not found`);
    }
    return board;
  } catch (error) {
    console.error(error);
    return null;
  }
}
