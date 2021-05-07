import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { uniqBy } from 'lodash';
import * as moment from 'moment';
import { BehaviorSubject, merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { PastSessionsService } from 'src/app/services';

@Component({
  selector: 'benji-past-sessions-table',
  templateUrl: './table.component.html',
})
export class PastSessionsTableComponent implements AfterViewInit {
  set sessionFilter(lessons: any) {
    this.sessionFilter$.next(lessons);
  }
  get sessionFilter(): any {
    return this.sessionFilter$.getValue();
  }

  constructor(
    private http: HttpClient,
    private pastSessionsService: PastSessionsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private pastSessionService: PastSessionsService
  ) {}
  displayedColumns: string[] = ['date', 'title', 'hosted_by', 'noOfParticipants', 'report'];
  data: any = [];
  selection = new SelectionModel<any>(true, []);
  resultsLength = 0;
  isLoadingResults = true;
  initialSessionFilter = 'all';

  sessionFilter$ = new BehaviorSubject<any>(null);

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  sessionFilterChange($event) {
    this.sessionFilter = $event.value;
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.sessionFilter$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.pastSessionsService.getPastSessions(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.sessionFilter
          );
        }),
        map((data: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.resultsLength = data.count;

          return data.results;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe((data) => {
        // data[0].start_time = data[1].start_time;
        // data[2].start_time = data[1].start_time;
        // console.log(data);
        // data = uniqBy(data, 'start_time');
        const tableData = [];
        data.forEach((run) => {
          console.log(run);
          // if (run.participant_set.length) {
          tableData.push({
            id: run.id,
            date: moment(run.start_time).format('MMMM, DD YYYY'),
            title: run.lesson.lesson_name,
            hostedBy: run.host ? run.host.first_name + ' ' + run.host.last_name : '',
            noOfParticipants: run.participant_set.length,
            lessonrunCode: run.lessonrun_code,
            is_accessible: run.is_accessible,
          });
          // }
        });

        const resArr = [];
        tableData.forEach(function (item) {
          const i = resArr.findIndex((x) => x.name === item.name);
          if (i <= -1) {
            resArr.push({ id: item.id, name: item.name });
          }
        });
        if (tableData.length && tableData[0].id) {
          tableData.sort((a, b) => b.id - a.id);
        }
        console.log(tableData);

        this.data = tableData;
        return data;
      });
  }

  showReports(row) {
    this.pastSessionService.resetFilter();
    this.router.navigate([row.lessonrunCode], {
      relativeTo: this.activatedRoute,
    });
  }

  // Selection code
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }
}
