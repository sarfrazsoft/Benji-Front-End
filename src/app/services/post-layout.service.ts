import { Injectable } from '@angular/core';
import * as moment from 'moment';
import Grid, { DraggerCancelEvent, DraggerEndEvent, GridOptions, Item } from 'muuri';
import { NgxPermissionsService } from 'ngx-permissions';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { PostOrder } from '../pages/lesson/main-screen/brainstorming-activity/grid/grid.component';
import { BoardSort, BoardStatus, SetMetaDataBoardEvent, TopicMedia, UpdateMessage } from './backend/schema';
@Injectable()
export class PostLayoutService {
  sendMessage$ = new BehaviorSubject<any>(null);

  set sendMessage(lesson: UpdateMessage) {
    this.sendMessage$.next(lesson);
  }
  get sendMessage(): UpdateMessage {
    return this.sendMessage$.getValue();
  }

  constructor() {}

  onGridCreated(grid: Grid, boardId: number) {
    const board_id = boardId;
    console.log('grid created');
    /**
     * Now you can do everything you want with the Grid object,
     * like subcribing to Muuri's events
     */
    grid.on('add', function (items) {
      // console.log(items);
    });

    grid.on('remove', (items) => {
      console.log(items);
    });

    grid.on('dragEnd', (item: Item, event: DraggerEndEvent | DraggerCancelEvent) => {
      const elemGrid = item.getGrid();
      const gridItems: Item[] = elemGrid.getItems();
      const ideasOrder = [];
      gridItems.forEach((itemElem: Item, i) => {
        const el = itemElem.getElement();
        ideasOrder.push({
          ideaId: el.getAttribute('id'),
          order: i.toString(),
        });
      });
      this.sendMessage$.next(
        new SetMetaDataBoardEvent(board_id, {
          updated: 'post_order',
          post_order: ideasOrder,
        })
      );
    });
  }

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

  itemMovedByTheHost(grid: Grid, postOrder: Array<PostOrder>) {
    const unsortedGridItems = grid.getItems();
    const sortOrder: Array<PostOrder> = postOrder;
    const sortedArray = [];
    sortOrder.forEach((orderItem) => {
      unsortedGridItems.forEach((item) => {
        if (orderItem.ideaId === item.getElement().getAttribute('id')) {
          sortedArray.push(item);
        }
      });
    });
    console.log(sortedArray);
    grid.sort(sortedArray);
  }
}