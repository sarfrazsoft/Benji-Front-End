import { Board } from 'src/app/services/backend/schema';
import { getBoard } from './get-board';

describe('getBoard', () => {
  it('should return the board with the specified id', () => {
    const boards = [
      { id: 1, name: 'Board 1' },
      { id: 2, name: 'Board 2' },
      { id: 3, name: 'Board 3' },
    ];
    const boardId = 2;
    const expectedBoard = { id: 2, name: 'Board 2' };
    const result = getBoard(boardId, boards);
    expect(result).toEqual(expectedBoard);
  });

  it('should return null if the board with the specified id is not found', () => {
    const boards = [
      { id: 1, name: 'Board 1' },
      { id: 2, name: 'Board 2' },
      { id: 3, name: 'Board 3' },
    ];
    const boardId = 4;
    const result = getBoard(boardId, boards);
    expect(result).toBeNull();
  });
});
