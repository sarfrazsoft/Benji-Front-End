import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import {
  Board,
  BrainstormEditInstructionEvent,
  BrainstormEditSubInstructionEvent,
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-page',
  templateUrl: './page.component.html',
})
export class PageComponent implements OnInit, OnChanges, OnDestroy {
  @Input() lessonRunCode;
  @Input() board: Board;
  @Input() isHost: boolean;
  @Input() eventType: string;
  @Output() sendMessage = new EventEmitter<any>();

  sub_instructions: string;
  myObservable = new Subject<string>();

  constructor() {}

  ngOnInit() {
    const sub_instructions = this.board.board_activity?.sub_instructions;
    this.setupPageContents(sub_instructions);

    this.myObservable.pipe(debounceTime(1000)).subscribe((val: string) => {
      const title = this.getTitle(val);
      if (title && title !== this.board.board_activity.instructions) {
        this.sendMessage.emit(new BrainstormEditInstructionEvent(title, this.board.id));
      }
      this.sendMessage.emit(new BrainstormEditSubInstructionEvent(val, this.board.id));
    });
  }

  ngOnChanges() {
    // only update the page contents only when it's a participant
    if (!this.isHost && this.eventType === 'BrainstormEditSubInstruction') {
      const sub_instructions = this.board.board_activity?.sub_instructions;
      this.setupPageContents(sub_instructions);
    } else if (this.eventType === 'HostChangeBoardEvent') {
      const sub_instructions = this.board.board_activity?.sub_instructions;
      this.setupPageContents(sub_instructions);
    }
  }

  setupPageContents(contents: string) {
    if (contents) {
      this.sub_instructions = contents;
    }
  }

  ngOnDestroy() {}

  sendSocketMessage($event): void {
    this.sendMessage.emit($event);
  }

  pageTextUpdated($event: string): void {
    // if (!this.isHost) {
    //   return;
    // }
    // console.log($event);
    this.myObservable.next($event);
  }

  getTitle(val: string): string {
    const parser = new DOMParser();
    const document = parser.parseFromString(val, 'text/html');
    return document.getElementsByTagName('h1')[0]?.innerHTML ?? '';
  }
}
