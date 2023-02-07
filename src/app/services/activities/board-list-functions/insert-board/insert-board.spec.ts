import { insertBoard } from './insert-board';

describe('insertBoard', () => {
  let boardArray: any[];

  beforeEach(() => {
    boardArray = [
      { id: 1, next_board: 2, previous_board: null },
      { id: 2, next_board: 3, previous_board: 1 },
      { id: 3, next_board: 4, previous_board: 2 },
      { id: 4, next_board: null, previous_board: 3 },
    ];
  });

  it('should insert a new board in the list', () => {
    const newBoard = { id: 5, next_board: 3, previous_board: 2 };
    insertBoard(newBoard, boardArray);
    expect(boardArray).toEqual([
      { id: 1, next_board: 2, previous_board: null },
      { id: 2, next_board: 5, previous_board: 1 },
      { id: 3, next_board: 4, previous_board: 5 },
      { id: 4, next_board: null, previous_board: 3 },
      { id: 5, next_board: 3, previous_board: 2 },
    ]);
  });

  it('should insert a new board', () => {
    boardArray = [
      { id: 1, next_board: 2, previous_board: null },
      { id: 2, next_board: 3, previous_board: 1 },
      { id: 3, next_board: null, previous_board: 2 },
    ];
    const newBoard = { id: 5, next_board: 3, previous_board: 2 };
    insertBoard(newBoard, boardArray);
    expect(boardArray).toEqual([
      { id: 1, next_board: 2, previous_board: null },
      { id: 2, next_board: 5, previous_board: 1 },
      { id: 3, next_board: null, previous_board: 5 },
      { id: 5, next_board: 3, previous_board: 2 },
    ]);
  });

  it('should insert a new board. the list is not in order', () => {
    boardArray = [
      { id: 2, next_board: 3, previous_board: 1 },
      { id: 1, next_board: 2, previous_board: null },
      { id: 3, next_board: null, previous_board: 2 },
    ];
    const newBoard = { id: 5, next_board: 3, previous_board: 2 };
    insertBoard(newBoard, boardArray);
    expect(boardArray).toEqual([
      { id: 2, next_board: 5, previous_board: 1 },
      { id: 1, next_board: 2, previous_board: null },
      { id: 3, next_board: null, previous_board: 5 },
      { id: 5, next_board: 3, previous_board: 2 },
    ]);
  });

  it('should insert a new board at the beginning of the list', () => {
    const newBoard = { id: 5, next_board: 1, previous_board: null };
    insertBoard(newBoard, boardArray);
    expect(boardArray).toEqual([
      { id: 1, next_board: 2, previous_board: 5 },
      { id: 2, next_board: 3, previous_board: 1 },
      { id: 3, next_board: 4, previous_board: 2 },
      { id: 4, next_board: null, previous_board: 3 },
      { id: 5, next_board: 1, previous_board: null },
    ]);
  });

  it('should insert a new board at the end of the list', () => {
    const newBoard = { id: 5, next_board: null, previous_board: 4 };
    insertBoard(newBoard, boardArray);
    expect(boardArray).toEqual([
      { id: 1, next_board: 2, previous_board: null },
      { id: 2, next_board: 3, previous_board: 1 },
      { id: 3, next_board: 4, previous_board: 2 },
      { id: 4, next_board: 5, previous_board: 3 },
      { id: 5, next_board: null, previous_board: 4 },
    ]);
  });

  it('should insert a new board when there is only one board in the list', () => {
    boardArray = [{ id: 1, next_board: null, previous_board: null }];
    const newBoard = { id: 2, next_board: 1, previous_board: null };
    insertBoard(newBoard, boardArray);

    expect(boardArray).toEqual([
      { id: 1, next_board: null, previous_board: 2 },
      { id: 2, next_board: 1, previous_board: null },
    ]);
  });

  it('should insert the board when there are no boards in the array', () => {
    boardArray = [];
    const newBoard = { id: 1, next_board: null, previous_board: null };
    insertBoard(newBoard, boardArray);
    expect(boardArray).toEqual([{ id: 1, next_board: null, previous_board: null }]);
  });
});
