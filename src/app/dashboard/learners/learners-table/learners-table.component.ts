import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { User } from 'src/app/services/backend/schema';
import { LearnerService } from '../services';

@Component({
  selector: 'benji-learners-table',
  templateUrl: './learners-table.component.html',
  styleUrls: ['./learners-table.component.scss']
})
export class LearnersTableComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'select',
    'id',
    'firstName',
    'lastName',
    'job_title'
  ];
  dataa = [
    {
      id: 11,
      username: 'tutenstineatgmaildotcom',
      first_name: 'mahin',
      last_name: 'khan',
      email: 'tutenstine@gmail.com',
      verified_email: false,
      job_title: null,
      organization_name: null,
      orggroup_name: null,
      local_admin_permission: false,
      participant_permission: true
    },
    {
      id: 11,
      username: 'tutenstineatgmaildotcom',
      first_name: 'mahin',
      last_name: 'khan',
      email: 'tutenstine@gmail.com',
      verified_email: false,
      job_title: null,
      organization_name: null,
      orggroup_name: null,
      local_admin_permission: false,
      participant_permission: true
    },
    {
      id: 11,
      username: 'tutenstineatgmaildotcom',
      first_name: 'mahin',
      last_name: 'khan',
      email: 'tutenstine@gmail.com',
      verified_email: false,
      job_title: null,
      organization_name: null,
      orggroup_name: null,
      local_admin_permission: false,
      participant_permission: true
    },
    {
      id: 11,
      username: 'tutenstineatgmaildotcom',
      first_name: 'mahin',
      last_name: 'khan',
      email: 'tutenstine@gmail.com',
      verified_email: false,
      job_title: null,
      organization_name: null,
      orggroup_name: null,
      local_admin_permission: false,
      participant_permission: true
    },
    {
      id: 11,
      username: 'tutenstineatgmaildotcom',
      first_name: 'mahin',
      last_name: 'khan',
      email: 'tutenstine@gmail.com',
      verified_email: false,
      job_title: null,
      organization_name: null,
      orggroup_name: null,
      local_admin_permission: false,
      participant_permission: true
    }
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
    private learnerService: LearnerService
  ) {}

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.learnerService.getLearners(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex
          );
        }),
        map(data => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = 41; // data.total_count;

          return data;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.data = this.dataa));
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
}
