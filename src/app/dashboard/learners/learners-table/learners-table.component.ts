import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatSort, MatTableDataSource, Sort } from '@angular/material';
import { noop as _noop } from 'lodash';

import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'benji-learners-table',
  templateUrl: './learners-table.component.html',
  styleUrls: ['./learners-table.component.scss']
})
export class LearnersTableComponent
  implements OnInit, OnChanges, AfterViewInit {
  dataSource: MatTableDataSource<Element>;
  selection = new SelectionModel<any>(true, []);

  limit = 1000;
  displayedColumns: string[] = [
    'select',
    'created',
    'state',
    'number',
    'title'
  ];
  full = false;
  @ViewChild(MatSort) sort: MatSort;

  scrollxx: EventEmitter<boolean> = new EventEmitter<boolean>();

  exampleDatabase: ExampleHttpDatabase | null;
  data: GithubIssue[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  pageIndex = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.exampleDatabase = new ExampleHttpDatabase(this.http);

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.pageIndex = 0));

    merge(this.sort.sortChange, this.scrollxx)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          // tslint:disable-next-line:no-non-null-assertion
          return this.exampleDatabase!.getRepoIssues(
            this.sort.active,
            this.sort.direction,
            this.pageIndex
          );
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.total_count;

          return [...this.data, ...data.items];
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.data = data));
  }

  handleScroll = (scrolled: boolean) => {
    console.log(scrolled);
    this.pageIndex = this.pageIndex + 1;
    this.scrollxx.emit();
  }
  hasMore = () => !this.dataSource || this.data.length < this.limit;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.data.forEach(row => this.selection.select(row));
  }

  ngOnChanges() {
    this.isAllSelected();
  }
}

export interface GithubApi {
  items: GithubIssue[];
  total_count: number;
}

export interface GithubIssue {
  created_at: string;
  number: string;
  state: string;
  title: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleHttpDatabase {
  constructor(private http: HttpClient) {}

  getRepoIssues(
    sort: string,
    order: string,
    page: number
  ): Observable<GithubApi> {
    const href = 'https://api.github.com/search/issues';
    const requestUrl = `${href}?q=repo:angular/material2&sort=${sort}&order=${order}&page=${page +
      1}`;

    return this.http.get<GithubApi>(requestUrl);
  }
}
