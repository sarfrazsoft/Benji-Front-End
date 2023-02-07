import { insertBoard } from '../insert-board/insert-board';
import { removeBoard } from '../remove-board/remove-board';

export function moveBoard(newBoard, boardArray) {
  removeBoard(newBoard.id, boardArray);
  insertBoard(newBoard, boardArray);
}
