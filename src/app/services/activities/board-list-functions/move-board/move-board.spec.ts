import { moveBoard } from './move-board';

describe('moveBoard', () => {
  let boardArray: any[];

  beforeEach(() => {
    boardArray = [
      { id: 1, next_board: 2, previous_board: null },
      { id: 2, next_board: 3, previous_board: 1 },
      { id: 3, next_board: 4, previous_board: 2 },
      { id: 4, next_board: null, previous_board: 3 },
    ];
  });

  it('should move the board 1', () => {
    const changedBoard = { id: 4, next_board: 3, previous_board: 2 };
    moveBoard(changedBoard, boardArray);
    expect(boardArray).toEqual([
      { id: 1, next_board: 2, previous_board: null },
      { id: 2, next_board: 4, previous_board: 1 },
      { id: 3, next_board: null, previous_board: 4 },
      { id: 4, next_board: 3, previous_board: 2 },
    ]);
  });

  it('should move the board to the beginning of the list', () => {
    const changedBoard = { id: 4, next_board: 1, previous_board: null };
    moveBoard(changedBoard, boardArray);
    expect(boardArray).toEqual([
      { id: 1, next_board: 2, previous_board: 4 },
      { id: 2, next_board: 3, previous_board: 1 },
      { id: 3, next_board: null, previous_board: 2 },
      { id: 4, next_board: 1, previous_board: null },
    ]);
  });

  it('should move the board to the end of the list', () => {
    boardArray = [
      { id: 1, next_board: 2, previous_board: null },
      { id: 2, next_board: 3, previous_board: 1 },
      { id: 3, next_board: null, previous_board: 2 },
    ];
    const changedBoard = { id: 1, next_board: null, previous_board: 3 };
    moveBoard(changedBoard, boardArray);
    expect(boardArray).toEqual([
      { id: 2, next_board: 3, previous_board: null },
      { id: 3, next_board: 1, previous_board: 2 },
      { id: 1, next_board: null, previous_board: 3 },
    ]);
  });

  it('should move the board to a position in the middle of the list 2', () => {
    const changedBoard = { id: 4, next_board: 2, previous_board: 1 };
    moveBoard(changedBoard, boardArray);
    expect(boardArray).toEqual([
      { id: 1, next_board: 4, previous_board: null },
      { id: 2, next_board: 3, previous_board: 4 },
      { id: 3, next_board: null, previous_board: 2 },
      { id: 4, next_board: 2, previous_board: 1 },
    ]);
  });

  it('should move the board to a position in the middle of the list 3', () => {
    boardArray = [
      { id: 1, next_board: 2, previous_board: null },
      { id: 3, next_board: null, previous_board: 2 },
      { id: 2, next_board: 3, previous_board: 1 },
    ];
    const changedBoard = { id: 3, next_board: 2, previous_board: 1 };
    moveBoard(changedBoard, boardArray);
    expect(boardArray).toEqual([
      { id: 1, next_board: 3, previous_board: null },
      { id: 2, next_board: null, previous_board: 3 },
      { id: 3, next_board: 2, previous_board: 1 },
    ]);
  });

  it('should move the board to a position in the middle of the list 4', () => {
    boardArray = [
      { id: 3556, previous_board: null, next_board: 3558 },
      { id: 3558, previous_board: 3556, next_board: 3557 },
      { id: 3557, previous_board: 3558, next_board: null },
    ];
    const changedBoard = { id: 3557, previous_board: 3556, next_board: 3558 };

    moveBoard(changedBoard, boardArray);

    expect(boardArray).toEqual([
      { id: 3556, previous_board: null, next_board: 3557 },
      { id: 3558, previous_board: 3557, next_board: null },
      { id: 3557, previous_board: 3556, next_board: 3558 },
    ]);
  });
});
