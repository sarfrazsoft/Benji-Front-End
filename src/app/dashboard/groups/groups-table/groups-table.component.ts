import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { User } from 'src/app/services/backend/schema';
import { PaginatedResponse } from 'src/app/services/backend/schema/course_details';
import { GroupsService } from '../services';

@Component({
  selector: 'benji-groups-table',
  templateUrl: './groups-table.component.html',
  styleUrls: ['./groups-table.component.scss']
})
export class GroupsTableComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'noOfLearners',
    'createdOn',
    'viewDetails'
  ];

  data: any = [];
  selection = new SelectionModel<any>(true, []);

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: HttpClient,
    private groupsService: GroupsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.groupsService.getLearners(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex
          );
        }),
        map((data: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.count;

          return data.results;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe(data => {
        this.data = groups;
        // data.forEach(run => {
        //   tableData.push({
        //     id: run.id,
        //     date: moment(run.start_time).format('MMMM, DD YYYY'),
        //     title: run.lesson.lesson_name,
        //     hostedBy: run.host
        //       ? run.host.first_name + ' ' + run.host.last_name
        //       : '',
        //     // tslint:disable-next-line:whitespace
        //     // participants: run.joined_users.length,
        //     lessonrunCode: run.lessonrun_code
        //   });
        // });
        return data;
      });
  }

  formatDate(date) {
    return moment(date).format('MMMM, DD YYYY');
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
    this.isAllSelected()
      ? this.selection.clear()
      : this.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
    } row ${row.position + 1}`;
  }

  viewGroup(row) {
    this.router.navigate([row.shortName], {
      relativeTo: this.activatedRoute
    });
  }
}

export const groups = [
  {
    id: 1,
    name: 'Group One',
    shortName: 'group_one',
    learners: 6,
    createdOn: '2020-01-10T17:06:29.572377-05:00',
    createdBy: {
      id: 1,
      name: 'John Doe'
    }
  },
  {
    id: 2,
    name: 'Group Two',
    shortName: 'group_two',
    learners: 8,
    createdOn: '2020-01-10T17:06:29.572377-05:00',
    createdBy: {
      id: 1,
      name: 'John Doe'
    }
  }
];
