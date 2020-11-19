import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BackendRestService, ContextService } from 'src/app/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { UtilsService } from 'src/app/services/utils.service';
import { ConfirmationDialogComponent } from 'src/app/shared';
import { AdminService } from '../../admin-panel/services';

@Component({
  selector: 'benji-lessons-list',
  templateUrl: './lessons.component.html',
  styleUrls: ['./lessons.component.scss'],
})
export class LessonsComponent implements OnInit {
  @Input() lessons: Array<any> = [];
  launchSessionLabel = '';
  rightLaunchArrow = '';
  rightCaret = '';
  dialogRef;

  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private restService: BackendRestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService,
    private utilsService: UtilsService
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
  launchSession(event, lesson): void {
    // if it's a single user lesson
    this.restService.start_lesson(lesson.id).subscribe(
      (lessonRun) => {
        if (lesson.single_user_lesson) {
          setTimeout(() => {
            this.router.navigate(['/user/lesson/' + lessonRun.lessonrun_code]);
          }, 1500);
        } else {
          this.router.navigate(['/screen/lesson/' + lessonRun.lessonrun_code]);
        }
      },
      (err) => console.log(err)
    );
    event.stopPropagation();
  }

  openDetails(lesson: Lesson) {
    this.adminService.getLessonDetails(lesson.id).subscribe((res: Lesson) => {
      if (res.lesson_details) {
        console.log(res);
        this.contextService.lesson = res;
        this.router.navigate(['lesson', lesson.id], {
          relativeTo: this.activatedRoute,
        });
      }
    });
  }

  edit($event, lesson: Lesson) {
    if (lesson.id) {
      if (lesson.effective_permission === 'admin' || lesson.effective_permission === 'edit') {
        this.router.navigate(['editor', lesson.id], {
          relativeTo: this.activatedRoute,
        });
      } else {
        this.utilsService.showWarning(`You don't have sufficient permission to perform this action.`);
      }
    }
    $event.stopPropagation();
  }

  delete($event, lesson: Lesson) {
    if (lesson.id) {
      if (lesson.effective_permission === 'admin') {
        const msg = 'Are you sure you want to delete ' + lesson.lesson_name + '?';
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
              this.adminService.deleteLesson(lesson.id).subscribe((delRes) => {
                if (delRes.success) {
                  this.adminService.getLessons().subscribe((lessons) => {
                    this.lessons = lessons;
                  });
                  this.utilsService.openSnackBar(`Lesson successfully deleted.`, `close`);
                }
              });
            }
          });
      } else {
        this.utilsService.showWarning(`You don't have sufficient permission to perform this action.`);
      }
    }
    $event.stopPropagation();
  }
}
