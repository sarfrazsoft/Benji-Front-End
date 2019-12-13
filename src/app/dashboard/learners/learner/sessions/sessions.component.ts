import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { LearnerService } from 'src/app/dashboard/learners/services';
import { User } from 'src/app/services/backend/schema';
import { PaginatedResponse } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['date', 'title', 'hosted_by', 'report'];

  data: any = [];
  selection = new SelectionModel<any>(true, []);

  dataa = {
    count: 1,
    next: null,
    previous: null,
    results: [
      {
        id: 6,
        date: '7-7-2019',
        title: 'Active Listening',
        hostedBy: 'Mahin baghi',
        lessonrunCode: 65367
      },
      {
        id: 7,
        date: '7-7-2019',
        title: 'Active Listening 2',
        hostedBy: 'Mahin baghi',
        participants: 18
      },
      {
        id: 8,
        date: '7-7-2019',
        title: 'Active Listening',
        hostedBy: 'Mahin baghi',
        participants: 5
      }
    ]
  };

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: HttpClient,
    private learnerService: LearnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.learnerService.getPastSessions(
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
        // console.log(data);
        this.data = this.dataa.results;
        return data;
      });
  }

  showReports(row) {
    console.log(row);
    // this.router.navigate(['reports'], {
    //   queryParams: row.id,
    //   relativeTo: this.activatedRoute
    // });
    // this.router.navigate(['/dashboard/pastsessions/1']);
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
    // this.router.navigate(['/reports']);
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
