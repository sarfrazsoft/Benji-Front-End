import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { merge, Observable, of as observableOf } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { GroupsService } from 'src/app/dashboard/groups/services/groups.service';

@Component({
  selector: 'benji-group-past-sessions-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class PastSessionsTableComponent implements AfterViewInit {
  displayedColumns: string[] = ['date', 'title', 'hosted_by', 'report'];
  data: any = [];
  selection = new SelectionModel<any>(true, []);
  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: HttpClient,
    private groupService: GroupsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.groupService.getPastSessions(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex
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
      .subscribe(data => {
        const tableData = [];
        data.forEach(run => {
          tableData.push({
            id: run.id,
            date: moment(run.start_time).format('MMMM, DD YYYY'),
            title: run.lesson.lesson_name,
            hostedBy: run.host
              ? run.host.first_name + ' ' + run.host.last_name
              : '',
            // tslint:disable-next-line:whitespace
            // participants: run.joined_users.length,
            lessonrunCode: run.lessonrun_code
          });
        });
        this.data = tableData;
        return data;
      });
  }

  showReports(row) {
    this.router.navigate([row.lessonrunCode], {
      relativeTo: this.activatedRoute
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
