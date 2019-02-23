import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LaunchSessionDialogComponent } from 'src/app/shared';

@Component({
  selector: 'benji-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  @Input() courses: Array<any> = [];
  constructor(private dialog: MatDialog) {}

  ngOnInit() {}

  launchSession(id): void {
    this.dialog
      .open(LaunchSessionDialogComponent, {
        data: {
          courseId: id
        }
      })
      .afterClosed()
      .subscribe(user => {});
  }
}
