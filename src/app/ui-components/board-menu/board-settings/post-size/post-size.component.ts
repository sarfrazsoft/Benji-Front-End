import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BrainstormService } from 'src/app';
import { Board, BrainstormBoardPostSizeEvent, PostSize } from 'src/app/services/backend/schema';
@Component({
  selector: 'benji-post-size',
  templateUrl: 'post-size.component.html',
})
export class PostSizeComponent implements OnInit {
  @Output() sendMessage = new EventEmitter<any>();

  postSizeDropdown: Array<{ value: PostSize; name: string }> = [
    {
      value: 'small',
      name: 'Small',
    },
    {
      value: 'medium',
      name: 'Medium',
    },
    {
      value: 'large',
      name: 'Large',
    },
  ];
  defaultSize = 'small';
  selectedBoard: Board;

  constructor(private brainstormService: BrainstormService) {}

  ngOnInit(): void {
    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.selectedBoardChanged(board);
      }
    });
  }

  selectedBoardChanged(board: Board) {
    this.selectedBoard = board;
    if (board.post_size) {
      this.defaultSize = board.post_size;
    }
  }

  changePostSize(size: { value: PostSize; name: string }) {
    this.sendMessage.emit(new BrainstormBoardPostSizeEvent(size.value, this.selectedBoard.id));
  }
}
