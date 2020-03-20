import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { User } from 'src/app/services/backend/schema';
import { PaginatedResponse } from 'src/app/services/backend/schema/course_details';
import { ConfirmationDialogComponent } from 'src/app/shared';
import { GroupsService } from '../services';

@Component({
  selector: 'benji-groups-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class GroupsTableComponent implements OnInit, AfterViewInit, OnDestroy {
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  displayedColumns: string[] = [
    'select',
    'name',
    // 'noOfLearners',
    // 'createdOn',
    'viewDetails'
  ];

  data: any = [];
  selection = new SelectionModel<any>(true, []);

  resultsLength = 0;
  isLoadingResults = true;
  dialogRef;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private groupsService: GroupsService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe(() =>
      this.deleteSelectedGroups()
    );
  }

  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.groupsService.getGroups(
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
        this.data = groups;
        this.data = [];
        data.forEach(grps => {
          this.data.push({
            name: grps.group_name
          });
        });
      });
  }

  deleteSelectedGroups() {
    const selectedGroups = this.selection.selected;
    if (selectedGroups.length > 0) {
      const a = selectedGroups.length === 1 ? 'this' : 'these';
      const b = selectedGroups.length === 1 ? '' : 's';
      const msg =
        'Are you sure you want to delete ' +
        selectedGroups.length +
        ' group' +
        b +
        '?';
      this.dialogRef = this.dialog
        .open(ConfirmationDialogComponent, {
          data: {
            confirmationMessage: msg
          },
          disableClose: true,
          panelClass: 'dashboard-dialog'
        })
        .afterClosed()
        .subscribe(res => {
          if (res) {
            console.log(selectedGroups);
          }
        });
    }
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
