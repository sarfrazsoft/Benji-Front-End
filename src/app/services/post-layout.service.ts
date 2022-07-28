import { Injectable } from '@angular/core';
import * as moment from 'moment';
import Grid from 'muuri';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BoardSort, BoardStatus, TopicMedia, UpdateMessage } from './backend/schema';

@Injectable()
export class PostLayoutService {
  constructor() {}

  sortGrid(sortOrder: BoardSort, grid: Grid) {
    let gridSort;
    switch (sortOrder) {
      case 'likes':
        gridSort = 'hearts';
        break;
      case 'newest_to_oldest':
        gridSort = 'newestToOldest';
        break;
      case 'oldest_to_newest':
        gridSort = 'oldestToNewest';
        break;
      case 'unsorted':
        // gridSort = 'order';
        break;
    }
    if (gridSort && grid) {
      setTimeout(() => {
        grid.sort('pin' + ' ' + gridSort);
        grid.refreshSortData();
      });
    }
  }

  getSortPresetsData() {
    return {
      oldestToNewest: (item, element) => {
        return Number(moment(element.getAttribute('time')));
      },
      newestToOldest: (item, element) => {
        return 99999999999 - Number(moment(element.getAttribute('time')));
      },
      hearts: (item, element) => {
        return 1000 - Number(element.getAttribute('hearts'));
      },
      order: (item, element) => {
        return 1000 - Number(element.getAttribute('order'));
      },
      pin: (item, element) => {
        return Number(element.getAttribute('pin'));
      },
    };
  }

  refreshGridLayout(grid: Grid, instant?: boolean) {
    setTimeout(() => {
      grid.refreshItems().layout(instant);
    });
  }
}
