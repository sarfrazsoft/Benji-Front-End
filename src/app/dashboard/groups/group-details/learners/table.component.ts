import { SelectionChange, SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ActivityReport, User } from 'src/app/services/backend/schema';
import { PaginatedResponse } from 'src/app/services/backend/schema/course_details';
import { ConfirmationDialogComponent } from 'src/app/shared';
import { GroupsService } from '../../services';
import { AddLearnersDialogComponent } from '../add-learners-dialog/add-learners.dialog';

@Component({
  selector: 'benji-group-learners-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class LearnersTableComponent
  implements AfterViewInit, OnInit, OnDestroy {
  @Input() showControls = true;
  private eventsSubscription: Subscription;
  @Input() events: Observable<any>;
  @Output() selectionEvent = new EventEmitter();
  displayedColumns: string[] = [
    'select',
    'firstName',
    'lastName',
    'job_title',
    'view_profile'
  ];
  dialogRef;

  data: Array<User> = [];
  selection = new SelectionModel<any>(true, []);

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private http: HttpClient,
    private learnerService: GroupsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (!this.showControls) {
      this.displayedColumns = this.displayedColumns.slice(
        this.displayedColumns.findIndex(val => val === 'select'),
        this.displayedColumns.length - 1
      );
    }

    if (this.events) {
      this.eventsSubscription = this.events.subscribe(res => {
        if (res) {
          console.log(res);
        }
        console.log('yolo');
        this.addSelectedLearner();
      });
    }

    this.selection.changed.subscribe((change: SelectionChange<User>) => {
      console.log(change);
      this.selectionEvent.emit(change);
    });
  }

  addSelectedLearner() {
    console.log(this.selection.selected);
  }

  ngOnDestroy() {
    if (this.events) {
      this.eventsSubscription.unsubscribe();
    }
  }

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
      .subscribe((data: Array<User>) => {
        this.data = data;
        return data;
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

  showProfile(row) {
    if (!this.showControls) {
      return;
    }
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  addLearners() {
    this.dialogRef = this.dialog
      .open(AddLearnersDialogComponent, {
        data: {
          confirmationMessage: 'hurr'
        },
        disableClose: true,
        panelClass: ['dashboard-dialog', 'add-learner-dialog']
      })
      .afterClosed()
      .subscribe(res => {
        if (res) {
          console.log(res);
        }
      });
  }

  removeLearners() {
    const selectedLearners = this.selection.selected;
    if (selectedLearners.length > 0) {
      const a = selectedLearners.length === 1 ? 'this' : 'these';
      const b = selectedLearners.length === 1 ? '' : 's';
      const msg =
        'Are you sure you want to remove ' +
        selectedLearners.length +
        ' learner' +
        b +
        '?';
      this.dialogRef = this.dialog
        .open(ConfirmationDialogComponent, {
          data: {
            confirmationMessage: msg
          },
          disableClose: true,
          panelClass: 'dashboard-dialogoo'
        })
        .afterClosed()
        .subscribe(res => {
          if (res) {
            console.log(selectedLearners);
          }
        });
    }
  }
}
