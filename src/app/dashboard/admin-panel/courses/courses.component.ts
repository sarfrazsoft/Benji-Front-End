import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { BackendRestService } from 'src/app/services';
import { LaunchSessionDialogComponent } from 'src/app/shared';
import { AdminService } from '../services';

@Component({
  selector: 'benji-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  @Input() courses: Array<any> = [];
  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private restService: BackendRestService,
    private router: Router
  ) {}

  ngOnInit() {}

  // duplicate code in Launch Session dialog
  launchSession(id): void {
    this.adminService.getCourseDetails(id).subscribe(res => {
      this.restService
        .start_lesson(res[0].id)
        .subscribe(
          lessonRun =>
            this.router.navigate([
              '/screen/lesson/' + lessonRun.lessonrun_code
            ]),
          err => console.log(err)
        );
    });
  }
}
