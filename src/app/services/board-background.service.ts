import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BoardBackgroundType } from './backend/schema';

@Injectable()
export class BoardBackgroundService {

  boardBackgroundType$ = new BehaviorSubject<BoardBackgroundType>(null);
  boardBackgroundColor$ = new BehaviorSubject<string>(null);
  boardBackgroundImage$ = new BehaviorSubject<string>(null);
  blurBackgroundImage$ = new BehaviorSubject<boolean>(null);

  set boardBackgroundType(boardBgType: BoardBackgroundType) {
    this.boardBackgroundType$.next(boardBgType);
  }
  get boardBackgroundType(): BoardBackgroundType {
    return this.boardBackgroundType$.getValue();
  }

  set boardBackgroundColor(boardBgColor: string) {
    this.boardBackgroundColor$.next(boardBgColor);
  }
  get boardBackgroundColor(): string {
    return this.boardBackgroundColor$.getValue();
  }

  set boardBackgroundImage(boardBgImage: string) {
    this.boardBackgroundImage$.next(boardBgImage);
  }
  get boardBackgroundImage(): string {
    return this.boardBackgroundImage$.getValue();
  }

  set blurBackgroundImage(blur: boolean) {
    this.blurBackgroundImage$.next(blur);
  }
  get blurBackgroundImage(): boolean {
    return this.blurBackgroundImage$.getValue();
  }

  constructor() {}
}
