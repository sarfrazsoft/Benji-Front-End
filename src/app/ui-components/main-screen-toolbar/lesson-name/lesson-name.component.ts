import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BrainstormService } from 'src/app/services';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { LessonRun } from 'src/app/services/backend/schema/course_details';
import { GetUpdatedLessonDetailEvent } from 'src/app/services/backend/schema/messages';
import { LessonService } from 'src/app/services/lesson.service';
import { SessionSettingsDialogComponent } from 'src/app/shared';
@Component({
  selector: 'benji-lesson-name',
  templateUrl: './lesson-name.component.html',
})
export class LessonNameComponent implements OnInit {
  @Input() activityState: UpdateMessage;
  @Output() socketMessage = new EventEmitter<any>();

  lessonRun: LessonRun;
  lessonName: string;
  coverPhoto: string;
  lessonImage: string;
  imageUrl: string;

  constructor(
    private matDialog: MatDialog,
    private brainstormService: BrainstormService,
    private lessonService: LessonService,
  ) {}

  ngOnInit() {
    this.lessonRun = this.activityState.lesson_run;
    this.coverPhoto = this.lessonService.setCoverPhoto(this.lessonRun.lessonrun_images);
    this.brainstormService.lessonName$.subscribe((lessonName: string) => {
      if (lessonName) {
        setTimeout(() => {
          this.lessonName = lessonName;
        }, 0);
        this.lessonRun.lesson.lesson_name = lessonName;
      }
    });

    this.brainstormService.lessonDescription$.subscribe((lessonDescription: string) => {
      if (lessonDescription) {
        this.lessonRun.lesson.lesson_description = lessonDescription;
      }
    });

    this.brainstormService.lessonImage$.subscribe((lessonImage) => {
      this.coverPhoto = lessonImage;
    });
  }

  openSessionSettings() {
    this.setImageValues();
    this.matDialog
      .open(SessionSettingsDialogComponent, {
        data: {
          id: this.lessonRun.lesson.id,
          title: this.lessonRun.lesson.lesson_name,
          description: this.lessonRun.lesson.lesson_description,
          lessonImage: this.lessonImage,
          imageUrl: this.imageUrl,
          Create: false,
        },
        panelClass: 'session-settings-dialog',
      })
      .afterClosed()
      .subscribe((data) => {
        if (data) {
          this.lessonService
            .updateLessonRunImage(
              this.lessonRun.lessonrun_code,
              data.lesson_image,
              data.lesson_image_name,
              data.image_url,
              this.lessonRun.lesson.id
            )
            .subscribe(
              (data) => {
                this.socketMessage.emit(new GetUpdatedLessonDetailEvent());
              },
              (error) => console.log(error)
            );
        }
      });
  }

  setImageValues() {
    if (this.coverPhoto) {
      if (this.coverPhoto.includes('media')) {
        this.lessonImage = this.coverPhoto;
        this.imageUrl = null;
      } else {
        this.imageUrl = this.coverPhoto;
        this.lessonImage = null;
      }
    } else {
      this.imageUrl = null;
      this.lessonImage = null;
    }
  }
}
