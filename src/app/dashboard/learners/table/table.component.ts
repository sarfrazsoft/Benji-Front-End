import { SelectionModel } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { uniqBy } from 'lodash';
import { BehaviorSubject, merge, Observable, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { ActivityReport, Team, User } from 'src/app/services/backend/schema';
import { PaginatedResponse } from 'src/app/services/backend/schema/course_details';
import { ConfirmationDialogComponent } from 'src/app/shared';
import { LearnerService } from '../services';

@Component({
  selector: 'benji-learners-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class LearnersTableComponent implements AfterViewInit, OnInit {
  private eventsSubscription: Subscription;
  @Input() events: Observable<void>;
  displayedColumns: string[] = [
    'select',
    'name',
    'teams',
    'view_profile',
    // 'viewDetails',
  ];

  initialSessionFilter = 'all';
  sessionFilter$ = new BehaviorSubject<any>(null);
  dialogRef;

  set sessionFilter(lessons: any) {
    this.sessionFilter$.next(lessons);
  }
  get sessionFilter(): any {
    return this.sessionFilter$.getValue();
  }

  selection = new SelectionModel<any>(true, []);
  teams: Array<Team> = [];
  data: Array<TeamUserTable> = [];
  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private learnerService: LearnerService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  sessionFilterChange($event) {
    this.sessionFilter = $event.value;
  }

  ngOnInit() {
    this.eventsSubscription = this.events.subscribe(() => this.deleteSelectedParticipants());

    this.sessionFilter$.subscribe((val) => {
      let data: Array<TeamUserTable> = [];
      this.teams.forEach((team) => {
        if (team.id + '' === val || val === 'all') {
          team.teammembership_set.forEach((teamuser) => {
            const bu = teamuser.benjiuser;

            const fdata = data.filter((t) => t.id === bu.id);
            if (fdata.length) {
              fdata[0].teams.push(team.name);
            } else {
              data.push({ name: bu.first_name + ' ' + bu.last_name, id: bu.id, teams: [team.name] });
            }
          });
        }
      });
      data = uniqBy(data, 'id');
      this.data = data;
    });
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

          return data.results;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe((teams: Array<Team>) => {
        this.teams = teams;
        let data: Array<TeamUserTable> = [];
        teams.forEach((team) => {
          team.teammembership_set.forEach((teamuser) => {
            const bu = teamuser.benjiuser;

            const fdata = data.filter((t) => t.id === bu.id);
            if (fdata.length) {
              fdata[0].teams.push(team.name);
            } else {
              data.push({ name: bu.first_name + ' ' + bu.last_name, id: bu.id, teams: [team.name] });
            }
          });
        });
        data = uniqBy(data, 'id');
        this.resultsLength = data.length;
        this.data = data;
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

  showProfile(row) {
    this.router.navigate([row.id], { relativeTo: this.activatedRoute });
  }

  deleteSelectedParticipants() {
    const selectedParticipants = this.selection.selected;
    if (selectedParticipants.length > 0) {
      const a = selectedParticipants.length === 1 ? 'this' : 'these';
      const b = selectedParticipants.length === 1 ? '' : 's';
      const msg = 'Are you sure you want to delete ' + selectedParticipants.length + ' group' + b + '?';
      this.dialogRef = this.dialog
        .open(ConfirmationDialogComponent, {
          data: {
            confirmationMessage: msg,
          },
          disableClose: true,
          panelClass: 'dashboard-dialog',
        })
        .afterClosed()
        .subscribe((res) => {
          if (res) {
            console.log(selectedParticipants);
          }
        });
    }
  }
}

export interface TeamUserTable {
  name: string;
  id: number;
  teams: Array<string>;
}
