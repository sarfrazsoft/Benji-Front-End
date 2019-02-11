import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LaunchSessionDialogComponent } from 'src/app/shared';

@Component({
  selector: 'benji-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  launchSession(): void {
    this.dialog
      .open(LaunchSessionDialogComponent, {})
      .afterClosed()
      .subscribe(user => {});
  }
}
