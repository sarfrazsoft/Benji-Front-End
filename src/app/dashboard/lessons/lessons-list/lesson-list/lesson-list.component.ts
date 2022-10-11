import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ContextService } from 'src/app/services';
import { Lesson } from 'src/app/services/backend/schema/course_details';
import { TeamUser } from 'src/app/services/backend/schema/user';
import { UtilsService } from 'src/app/services/utils.service';
export interface TableRowInformation {
  index: number;
  lessonRunCode: number;
  lessonTitle: string;
  host: string;
  lessonDescription: string;
  boards: number;
  participants: number;
  startDate: string;
  lessonId: number;
  hostId: number;
  lessonImageId?: number;
  lessonImage?: string;
  imageUrl?: string;
  lessonFolders?: Array<number>;
}
@Component({
  selector: 'benji-lesson-list',
  templateUrl: './lesson-list.component.html',
})
export class LessonListComponent implements OnChanges {
  @Input() lessonRuns: Array<Lesson> = [];
  @Output() editSessionEvent = new EventEmitter<TableRowInformation>();
  @Output() duplicateSessionEvent = new EventEmitter<TableRowInformation>();
  @Output() moveToFoldersEvent = new EventEmitter<TableRowInformation>();
  @Output() deleteSessionEvent = new EventEmitter<TableRowInformation>();

  displayedColumns: string[] = ['title', 'host', 'boards', 'participants', 'startDate', 'options'];
  dataSource: TableRowInformation[] = [];

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  options = [
    {
      option: 'Open',
      icon: '../../../../assets/img/dashboard/open.svg',
    },
    {
      option: 'View only',
      icon: '../../../../assets/img/dashboard/view-only.svg',
    },
    {
      option: 'Closed',
      icon: '../../../../assets/img/dashboard/closed.svg',
    },
  ];

  selectedCategory = 'Open';

  hostname = window.location.host + '/participant/join?link=';
  maxIdIndex: any;
  folderLessonsIDs: Array<number> = [];

  constructor(
    private router: Router,
    private utilsService: UtilsService,
    private contextService: ContextService,
  ) {}

  ngOnChanges() {
    this.getActiveSessions();
  }

  getActiveSessions() {
    this.dataSource = [];
    const slicedArray = this.lessonRuns;
    slicedArray.forEach((val: any, index: number) => {
      const ids = val.lessonrun_images.map((object) => {
        return object.id;
      });
      const max = Math.max(...ids);
      this.maxIdIndex = val.lessonrun_images.findIndex((x) => x.id === max);
      this.dataSource.push({
        index: index,
        lessonRunCode: val.lessonrun_code,
        lessonId: val.lesson.id,
        lessonTitle: val.lesson.lesson_name,
        lessonDescription: val.lesson.lesson_description,
        host: val.host.first_name + ' ' + val.host.last_name,
        hostId: val.host.id,
        boards: val.board_count,
        participants: val.participant_set.length,
        startDate: moment(val.start_time).format('MMM D, YYYY'),
        lessonImageId: val.lessonrun_images[this.maxIdIndex]?.id,
        lessonImage: val.lessonrun_images[this.maxIdIndex]?.img,
        imageUrl: val.lessonrun_images[this.maxIdIndex]?.image_url,
        lessonFolders: val.lesson.lesson_folders,
      });
    });
  }

  navigateToSession(element: TableRowInformation) {
    const user: TeamUser = JSON.parse(localStorage.getItem('user'));
    if (user.id === element.hostId) {
      localStorage.setItem('host_' + element.lessonRunCode, JSON.stringify(user));
    }
    this.router.navigate(['/screen/lesson/' + element.lessonRunCode], {
      queryParams: {
        folder: null,
      },
      queryParamsHandling: 'merge',
    });
    this.contextService.selectedFolder = null;
  }

  copyLink(val) {
    this.utilsService.copyToClipboard(this.hostname + val.lessonRunCode);
  }

  edit(val: TableRowInformation) {
    this.editSessionEvent.emit(val);
  }

  delete(val: TableRowInformation) {
    this.deleteSessionEvent.emit(val);
  }

  duplicateSession(val: TableRowInformation) {
    this.duplicateSessionEvent.emit(val);
  }

  moveToFolders(val: TableRowInformation) {
    this.moveToFoldersEvent.emit(val);
  }

  updateLessonName(name: string, code: number): void {
    this.dataSource.find(item => item.lessonRunCode == code).lessonTitle = name;
  }
}
