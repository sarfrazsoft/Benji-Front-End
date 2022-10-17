import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Board, BrainstormActivity } from '../backend/schema';

@Injectable()
export class BoardsNavigationService {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  navigateToNextAvailableBoard(boards: Array<Board>, board: Board): void {
    const b = this.isNextBoardAvailableToNavigate(boards, board);
    if (b) {
      this.boardChangingQueryParams(b.id);
    }
    return null;
  }

  isNextBoardAvailableToNavigate(boards: Array<Board>, currentBoard: Board): Board | null {
    let nextBoardExists = true;
    for (let i = 0; i < boards.length; i++) {
      const b = boards[i];
      if (currentBoard.next_board === b.id && b.status !== 'closed') {
        // navigate if the board is not closed
        const nextBoard = b;
        return nextBoard;
      } else if (!currentBoard.next_board) {
        // there is no next board
        nextBoardExists = false;
        return null;
      }
      if (i === boards.length - 1) {
        // no suiteable board found
        return null;
      }
    }
  }

  isPreviousBoardAvailableToNavigate(boards: Array<Board>, currentBoard: Board): Board | null {
    let previousBoardExists = true;
    for (let i = 0; i < boards.length; i++) {
      const b = boards[i];
      if (currentBoard.previous_board === b.id && b.status !== 'closed') {
        // navigate if the board is not closed
        const nextBoard = b;
        return nextBoard;
      } else if (!currentBoard.previous_board) {
        // there is no next board
        previousBoardExists = false;
        return null;
      }
      if (i === boards.length - 1) {
        // no suiteable board found
        return null;
      }
    }
  }

  private boardChangingQueryParams(boardId: number) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { board: boardId },
      queryParamsHandling: 'merge',
    });
  }

  private getBoard(boardId: number, boards: Array<Board>): Board {
    let board;
    boards.forEach((b) => {
      if (b.id === boardId) {
        board = b;
      }
    });
    return board;
  }
}
