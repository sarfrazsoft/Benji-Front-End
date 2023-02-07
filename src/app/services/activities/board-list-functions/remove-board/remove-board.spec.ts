import { removeBoard } from './remove-board';

describe('removeBoard', () => {
  let boardArray: any[];

  beforeEach(() => {
    boardArray = [
      { id: 1, next_board: 2, previous_board: null },
      { id: 2, next_board: 3, previous_board: 1 },
      { id: 3, next_board: 4, previous_board: 2 },
      { id: 4, next_board: null, previous_board: 3 },
    ];
  });

  it('should remove a board from the list and update next and previous board references', () => {
    removeBoard(2, boardArray);
    expect(boardArray).toEqual([
      { id: 1, next_board: 3, previous_board: null },
      { id: 3, next_board: 4, previous_board: 1 },
      { id: 4, next_board: null, previous_board: 3 },
    ]);
  });

  it('should remove the first board from the list', () => {
    removeBoard(1, boardArray);
    expect(boardArray).toEqual([
      { id: 2, next_board: 3, previous_board: null },
      { id: 3, next_board: 4, previous_board: 2 },
      { id: 4, next_board: null, previous_board: 3 },
    ]);
  });

  it('should remove the last board from the list', () => {
    removeBoard(4, boardArray);
    expect(boardArray).toEqual([
      { id: 1, next_board: 2, previous_board: null },
      { id: 2, next_board: 3, previous_board: 1 },
      { id: 3, next_board: null, previous_board: 2 },
    ]);
  });

  it('should handle removing a board when there are only two boards in the list', () => {
    boardArray = [
      { id: 1, next_board: 2, previous_board: null },
      { id: 2, next_board: null, previous_board: 1 },
    ];
    removeBoard(1, boardArray);
    expect(boardArray).toEqual([{ id: 2, next_board: null, previous_board: null }]);
  });
  it('should handle removing a board when there are only two boards in the list', () => {
    boardArray = [
      { id: 1, next_board: 2, previous_board: null },
      { id: 2, next_board: null, previous_board: 1 },
    ];
    removeBoard(2, boardArray);
    expect(boardArray).toEqual([{ id: 1, next_board: null, previous_board: null }]);
  });
});
