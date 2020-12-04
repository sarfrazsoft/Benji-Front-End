import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { EditorService } from 'src/app/dashboard/editor/services';
import * as global from 'src/app/globals';
import { BackendRestService, ContextService } from 'src/app/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { UtilsService } from 'src/app/services/utils.service';
import { ConfirmationDialogComponent } from 'src/app/shared';
import { AdminService } from '../../../admin-panel/services';

@Component({
  selector: 'benji-lesson-tile',
  templateUrl: './lesson-tile.component.html',
  styleUrls: ['./lesson-tile.component.scss'],
})
export class LessonTileComponent implements OnInit {
  @Input() lesson: Lesson;
  launchSessionLabel = '';
  rightLaunchArrow = '';
  rightCaret = '';
  dialogRef;

  description = '';
  editingDescription = false;

  constructor(
    private dialog: MatDialog,
    private adminService: AdminService,
    private restService: BackendRestService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService,
    private utilsService: UtilsService,
    private editorService: EditorService
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
                    if (lessons.length) {
                      lessons = lessons.sort((a, b) => b.id - a.id);
                    }
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

  editDescription($event, lesson: Lesson) {
    this.description = lesson.lesson_description;
    this.editingDescription = true;
  }

  saveDescription($event) {
    $event.preventDefault();
    $event.stopPropagation();

    const l: Lesson = {
      id: this.lesson.id,
      lesson_name: this.lesson.lesson_name,
      lesson_description: this.description,
    };
    this.editorService
      .updateLesson(l, this.lesson.id)
      .pipe(
        map((res) => res),
        catchError((error) => error)
      )
      .subscribe((res: Lesson) => {
        this.lesson.lesson_description = res.lesson_description;
        this.editingDescription = false;
      });
  }
}
