import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendRestService, ContextService } from 'src/app/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { LaunchSessionDialogComponent } from 'src/app/shared';
import { AdminService } from '../../admin-panel/services';

@Component({
  selector: 'benji-courses-list',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss']
})
export class CoursesComponent implements OnInit {
  @Input() courses: Array<any> = [];
  launchSessionLabel = '';
  rightLaunchArrow = '';
  rightCaret = '';
  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private restService: BackendRestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService
  ) {}

  ngOnInit() {
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.launchSessionLabel = info.parameters.launchSession;
        this.rightCaret = info.parameters.rightCaret;
        this.rightLaunchArrow = info.parameters.rightLaunchArrow;
      }
    });
  }

  // duplicate code in Launch Session dialog
  launchSession(event, id): void {
    this.adminService.getCourseDetails(id).subscribe((res: Array<Lesson>) => {
      // if it's a single user lesson
      this.restService.start_lesson(res[0].id).subscribe(
        lessonRun => {
          if (res[0].single_user_lesson) {
            setTimeout(() => {
              this.router.navigate([
                '/user/lesson/' + lessonRun.lessonrun_code
              ]);
            }, 1500);
          } else {
            this.router.navigate([
              '/screen/lesson/' + lessonRun.lessonrun_code
            ]);
          }
        },
        err => console.log(err)
      );
    });
    event.stopPropagation();
  }

  openDetails(course) {
    if (course.course_details) {
      this.router.navigate(['course', course.course_id], {
        relativeTo: this.activatedRoute
      });
    }
  }
}
