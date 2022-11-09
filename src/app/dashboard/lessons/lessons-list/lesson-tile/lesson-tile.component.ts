import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ContextService } from 'src/app/services';
import { LessonInformation, TeamUser } from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import { LessonRunDetails } from 'src/app/services/backend/schema/course_details';
import { UtilsService } from 'src/app/services/utils.service';
import { LessonService } from 'src/app/services/lesson.service';
@Component({
  selector: 'benji-lesson-tile',
  templateUrl: './lesson-tile.component.html',
})
export class LessonTileComponent implements OnInit {
  @Input() lesson: LessonRunDetails;
  @Output() editSessionEvent = new EventEmitter<any>();
  @Output() duplicateSessionEvent = new EventEmitter<any>();
  @Output() moveToFoldersEvent = new EventEmitter<any>();
  @Output() deleteSessionEvent = new EventEmitter<any>();

  showSettings: boolean;
  dialogRef;
  settingsDialogRef;
  timeStamp: string;
  participantsCount: number;
  coverPhoto: string;
  hostname = window.location.host + '/participant/join?link=';
  maxIdIndex: number;
  folderLessonsIDs: Array<number> = [];

  hostLocation = environment.web_protocol + '://' + environment.host;

  constructor(
    private router: Router,
    private contextService: ContextService,
    private utilsService: UtilsService,
    private lessonService: LessonService
  ) {}

  ngOnInit() {
    this.participantsCount = this.lesson.participant_set.length;
    this.coverPhoto = this.lessonService.setCoverPhoto(this.lesson.lessonrun_images) ??
      'assets/img/temporary/dummy.png';
    this.calculateTimeStamp();
    setInterval(() => {
      this.calculateTimeStamp();
    }, 60000);
  }

  calculateTimeStamp() {
    this.timeStamp = this.utilsService.calculateTimeStamp(this.lesson.lesson.creation_time);
  }

  navigateToSession() {
    const user: TeamUser = JSON.parse(localStorage.getItem('user'));
    if (user.id === this.lesson.host.id) {
      localStorage.setItem('host_' + this.lesson.lessonrun_code, JSON.stringify(user));
    }
    this.router.navigate(['/screen/lesson/' + this.lesson.lessonrun_code]);
    this.contextService.selectedFolder = null;
  }

  copyLink(val) {
    this.utilsService.copyToClipboard(this.hostname + val.lessonRunCode);
  }

  getLessonDetails(): LessonInformation {
    return {
      lessonId: this.lesson.lesson.id,
      lessonRunCode: this.lesson.lessonrun_code,
      lessonTitle: this.lesson.lesson.lesson_name,
      lessonDescription: this.lesson.lesson.lesson_description,
      lessonImage: this.lesson.lessonrun_images[this.maxIdIndex]?.img,
      imageUrl: this.lesson.lessonrun_images[this.maxIdIndex]?.image_url,
    }
  }

  edit() {
    this.editSessionEvent.emit(this.getLessonDetails());
  }

  delete() {
    this.deleteSessionEvent.emit(this.getLessonDetails());
  }

  duplicateSession() {
    this.duplicateSessionEvent.emit(this.getLessonDetails());
  }

  moveToFolders() {
    this.moveToFoldersEvent.emit(this.getLessonDetails());
  }

}
