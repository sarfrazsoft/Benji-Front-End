import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
// import { Observable } from 'rxjs';
import 'rxjs/add/observable/fromEvent';
// import { fromEvent } from 'rxjs/observable/fromEvent';
import { merge } from 'rxjs/observable/merge';
import {
  debounceTime,
  distinct,
  filter,
  flatMap,
  map,
  tap
} from 'rxjs/operators';
@Component({
  selector: 'benji-infinite-scroll-list',
  template: `
    <table>
      <tbody>
        <tr
          *ngFor="let item of (itemResults$ | async)"
          [style.height]="itemHeight + 'px'"
        >
          <td>{{ item.name }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class InfiniteScrollListComponent {
  private cache = [];
  private pageByManual$ = new BehaviorSubject(1);
  private itemHeight = 40;
  private numberOfItems = 10;
  private pageByScroll$ = Observable.fromEvent(window, 'scroll').pipe(
    map(() => {
      console.log(window.scrollY);
      return window.scrollY;
    }),
    filter(
      current => current >= document.body.clientHeight - window.innerHeight
    ),
    debounceTime(200),
    distinct(),
    map(y =>
      Math.ceil(
        (y + window.innerHeight) / (this.itemHeight * this.numberOfItems)
      )
    )
  );

  private pageByResize$ = Observable.fromEvent(window, 'resize').pipe(
    debounceTime(200),
    map(_ =>
      Math.ceil(
        (window.innerHeight + document.body.scrollTop) /
          (this.itemHeight * this.numberOfItems)
      )
    )
  );

  private pageToLoad$ = merge(
    this.pageByManual$,
    this.pageByScroll$,
    this.pageByResize$
  ).pipe(
    distinct(),
    filter(page => this.cache[page - 1] === undefined)
  );

  loading = false;

  itemResults$ = this.pageToLoad$.pipe(
    tap(_ => (this.loading = true)),
    flatMap((page: number) => {
      console.log(page);
      return this.httpClient
        .get(`https://swapi.co/api/people?page=${page}`)
        .pipe(
          map((resp: any) => resp.results),
          tap(resp => {
            this.cache[page - 1] = resp;
            if (
              this.itemHeight * this.numberOfItems * page <
              window.innerHeight
            ) {
              this.pageByManual$.next(page + 1);
            }
          })
        );
    }),
    map(() => _.flatMap(this.cache))
  );

  constructor(private httpClient: HttpClient) {}
}
