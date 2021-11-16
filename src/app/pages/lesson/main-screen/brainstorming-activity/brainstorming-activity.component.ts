import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
  expandRightOnEnterAnimation,
  fadeInOnEnterAnimation,
  fadeInRightOnEnterAnimation,
  fadeInUpOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  slideInRightOnEnterAnimation,
  slideInUpOnEnterAnimation,
  slideOutRightOnLeaveAnimation,
} from 'angular-animations';
import { clone, cloneDeep, uniqBy } from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import { Observable, Subscription } from 'rxjs';
import { BrainStormComponent } from 'src/app/dashboard/past-sessions/reports';
import * as global from 'src/app/globals';
import { ImageViewDialogComponent } from 'src/app/pages/lesson/shared/dialogs/image-view/image-view.dialog';
import {
  ActivitySettingsService,
  BrainstormService,
  ContextService,
  SharingToolService,
} from 'src/app/services';
import {
  BrainstormActivity,
  BrainstormCreateCategoryEvent,
  BrainstormEditIdeaSubmitEvent,
  BrainstormImageSubmitEvent,
  BrainstormRemoveCategoryEvent,
  BrainstormRemoveSubmissionEvent,
  BrainstormRenameCategoryEvent,
  BrainstormSetCategoryEvent,
  BrainstormSubmissionCompleteInternalEvent,
  BrainstormSubmitEvent,
  BrainstormToggleCategoryModeEvent,
  Group,
  Idea,
  Timer,
} from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { IdeaCreationDialogComponent } from 'src/app/shared/dialogs/idea-creation-dialog/idea-creation.dialog';
import { ImagePickerDialogComponent } from 'src/app/shared/dialogs/image-picker-dialog/image-picker.dialog';
import { ParticipantGroupingDialogComponent } from 'src/app/shared/dialogs/participant-grouping-dialog/participant-grouping.dialog';
import { ParticipantGroupingInfoDialogComponent } from 'src/app/shared/dialogs/participant-grouping-info-dialog/participant-grouping-info.dialog';
import { environment } from 'src/environments/environment';
import { BaseActivityComponent } from '../../shared/base-activity.component';
import { UncategorizedComponent } from './uncategorized/uncategorized.component';

@Component({
  selector: 'benji-ms-brainstorming-activity',
  templateUrl: './brainstorming-activity.component.html',
  styleUrls: ['./brainstorming-activity.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ duration: 200 }),
    fadeInUpOnEnterAnimation({ duration: 1000, delay: 0, translate: '300px' }),
    fadeOutOnLeaveAnimation({ duration: 200 }),
    slideInRightOnEnterAnimation({ duration: 100, translate: '600px' }),
    slideOutRightOnLeaveAnimation(),
    fadeInRightOnEnterAnimation(),
    slideInUpOnEnterAnimation(),
    expandRightOnEnterAnimation(),
  ],
})
export class MainScreenBrainstormingActivityComponent
  extends BaseActivityComponent
  implements OnInit, OnChanges, OnDestroy {
  @Input() peakBackState = false;
  @Input() activityStage: Observable<string>;
  peakBackStage = null;
  showParticipantUI = false;
  showParticipantsGroupsDropdown = false;
  participantCode;
  private eventsSubscription: Subscription;

  constructor(
    private contextService: ContextService,
    private matDialog: MatDialog,
    private utilsService: UtilsService,
    private activitySettingsService: ActivitySettingsService,
    private httpClient: HttpClient,
    private permissionsService: NgxPermissionsService,
    private sharingToolService: SharingToolService,
    private brainstormService: BrainstormService
  ) {
    super();
  }
  instructions = '';
  timer: Timer;
  act: BrainstormActivity;

  submissionScreen = false;
  voteScreen = false;
  VnSComplete = false;
  categorizeFlag = false;
  showUserName = true;
  minWidth = 'medium';
  colDeleted = 0;
  joinedUsers = [];
  answeredParticipants = [];
  unansweredParticipants = [];
  ideaSubmittedUsersCount = 0;
  voteSubmittedUsersCount = 0;
  dialogRef: MatDialogRef<ParticipantGroupingInfoDialogComponent>;
  shownSubmissionCompleteNofitication = false;

  // Groupings
  classificationTypes;
  participantGroups: Array<Group>;
  selectedClassificationType;
  selectedParticipantGroup: Group;
  myGroup: Group;

  imagesURLs = [
    'localhost/media/Capture_LGXPk9s.JPG',
    'localhost/media/Capture_LGXPk9s.JPG',
    '../../../../../assets//img/Desk_lightblue2.jpg',
  ];

  settingsSubscription;
  saveIdeaSubscription;
  imagesList: FileList;
  imageSrc;
  imageDialogRef;
  selectedImageUrl;

  ngOnInit() {
    super.ngOnInit();

    // this.act = clone(this.activityState.brainstormactivity);
    this.act = this.activityState.brainstormactivity;
    if (this.peakBackState) {
      this.eventsSubscription = this.activityStage.subscribe((state) => this.changeStage(state));
    }
    this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.participantCode = this.getParticipantCode();
        this.participantGroups = this.act.groups;

        this.myGroup = this.getParticipantGroup(this.participantCode, this.participantGroups);
      }
    });

    this.permissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.classificationTypes = [
          {
            type: 'everyone',
            title: 'Everyone',
            description: `Display everyone's work`,
            imgUrl: '/assets/img/brainstorm/everyone.svg',
          },
          {
            type: 'groups',
            title: 'Groups',
            description: `Display group's work`,
            imgUrl: '/assets/img/brainstorm/groups.svg',
          },
          // { type: 'individuals', title: 'Individuals', description: `Display single persons work`,
          // imgUrl: '/assets/img/brainstorm/individuals.svg' },
        ];
      }
    });

    this.onChanges();

    this.settingsSubscription = this.activitySettingsService.settingChange$.subscribe((val) => {
      if (val && val.controlName === 'participantNames') {
        this.showUserName = val.state;
      }
      if (val && val.controlName === 'categorize') {
        this.sendMessage.emit(new BrainstormToggleCategoryModeEvent());
      }
      if (val && val.controlName === 'cardSize') {
        this.minWidth = val.state.name;
      }
    });

    this.saveIdeaSubscription = this.brainstormService.saveIdea$.subscribe((val) => {
      if (val) {
        this.saveIdea(val);
      }
    });
  }

  getParticipantGroup(participantCode, participantGroups) {
    return this.getMyGroup(participantCode, participantGroups);
  }

  getPersonName(idea: Idea) {
    if (idea && idea.submitting_participant) {
      const user = this.joinedUsers.find(
        (u) => u.participant_code === idea.submitting_participant.participant_code
      );
      return user.display_name;
    }
  }

  getMinWidth() {
    return this.minWidth === 'small' ? 280 : this.minWidth === 'medium' ? 360 : 480;
  }

  ngOnDestroy() {
    this.contextService.destroyActivityTimer();
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
    if (this.saveIdeaSubscription) {
      this.saveIdeaSubscription.unsubscribe();
    }
    if (this.peakBackState) {
      this.eventsSubscription.unsubscribe();
    }
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
  changeStage(state) {
    this.peakBackStage = state;
    const act = this.activityState.brainstormactivity;
    if (state === 'next') {
    } else {
      // state === 'previous'
    }

    if (this.submissionScreen) {
      if (state === 'next') {
        this.voteScreen = true;
        this.submissionScreen = false;
        this.VnSComplete = false;
        this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
      } else {
        // state === 'previous'
        // do nothing
      }
    } else if (this.voteScreen) {
      if (state === 'next') {
        this.submissionScreen = false;
        this.voteScreen = false;
        this.VnSComplete = true;
      } else {
        // state === 'previous'
        this.submissionScreen = true;
        this.voteScreen = false;
        this.VnSComplete = false;
        this.ideaSubmittedUsersCount = this.act.submitted_participants.length;
      }
    } else if (this.VnSComplete) {
      if (state === 'next') {
        // do nothing
      } else {
        // state === 'previous'
        this.voteScreen = true;
        this.submissionScreen = false;
        this.VnSComplete = false;
        this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
      }
    }
  }

  classificationTypeChanged(selectedClassificationType) {
    // console.log(selectedClassificationType);
    const sct = selectedClassificationType;
    if (sct.type === 'everyone') {
      // this.participantGroups = null;
      this.selectedParticipantGroup = null;
      this.showParticipantsGroupsDropdown = false;

      this.act = cloneDeep(this.activityState.brainstormactivity);
    } else if (sct.type === 'groups') {
      this.participantGroups = this.act.groups;
      this.showParticipantsGroupsDropdown = true;
    } else if (sct.type === 'individuals') {
      this.participantGroups = null;
    }
  }

  ParticipantGroupChanged(selectedParticipantGroup: Group) {
    this.filterIdeasBasedOnGroup(selectedParticipantGroup);
  }

  filterIdeasBasedOnGroup(selectedParticipantGroup: Group) {
    // console.log(selectedParticipantGroup);
    // console.log(this.act);
    const act = cloneDeep(this.activityState.brainstormactivity);
    for (let i = 0; i < act.brainstormcategory_set.length; i++) {
      const category = act.brainstormcategory_set[i];
      if (!category.removed) {
        for (let j = 0; j < category.brainstormidea_set.length; j++) {
          const idea = category.brainstormidea_set[j];
          if (idea.submitting_participant) {
            if (
              !selectedParticipantGroup.participants.includes(idea.submitting_participant.participant_code)
            ) {
              category.brainstormidea_set.splice(j, 1);
              j--;
            }
          }
        }
      }
    }
    this.act = act;
    this.eventType = 'filtered';
  }

  onChanges() {
    this.eventType = this.getEventType();
    this.loadUsersCounts();
    const act = this.activityState.brainstormactivity;
    this.act = cloneDeep(this.activityState.brainstormactivity);
    // populate groupings dropdown
    if (this.act.groups && this.act.groups.length) {
      this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
        if (val) {
          this.participantCode = this.getParticipantCode();
          this.participantGroups = this.act.groups;
          this.myGroup = this.getParticipantGroup(this.participantCode, this.participantGroups);
          this.filterIdeasBasedOnGroup(this.myGroup);
        }
      });
      this.permissionsService.hasPermission('ADMIN').then((val) => {
        if (val) {
          this.participantGroups = this.act.groups;
        }
      });
    }

    const sm = this.activityState;
    if (sm && sm.running_tools && sm.running_tools.grouping_tool) {
      const gt = sm.running_tools.grouping_tool;
      if (sm.eventType === 'ViewGroupingEvent') {
        // if viewGrouping is true AND the dialog has not been opened
        // then open dialog
        this.permissionsService.hasPermission('PARTICIPANT').then((permission) => {
          if (gt.viewGrouping && (!this.dialogRef || !this.dialogRef.componentInstance)) {
            if (permission) {
              this.dialogRef = this.sharingToolService.openParticipantGroupingInfoDialog(this.activityState);
              // this.dialogRef =
              // this.sharingToolService.openParticipantGroupingToolDialog(this.activityState);
              this.sharingToolService.sendMessage$.subscribe((v) => {
                if (v) {
                  this.sendMessage.emit(v);
                }
              });
            }
          } else if (!gt.viewGrouping && this.dialogRef) {
            this.dialogRef.close();
            this.dialogRef = null;
          }
        });
      }
      this.sharingToolService.updateParticipantGroupingToolDialog(gt);
    }

    if (this.act.brainstormcategory_set.length) {
      // check if the categories have ids
      // if categories don't have ids it means
      // we're in the preview panel
      if (this.act.brainstormcategory_set[0].id) {
        this.act.brainstormcategory_set = this.act.brainstormcategory_set.sort((a, b) => a.id - b.id);
      } else {
      }
    }
    this.joinedUsers = this.activityState.lesson_run.participant_set;

    this.instructions = act.instructions;

    this.categorizeFlag = act.categorize_flag;
    if (this.categorizeFlag) {
    }

    if (this.peakBackState && this.peakBackStage === null) {
      this.voteScreen = true;
      this.submissionScreen = false;
      this.VnSComplete = false;
      this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
    } else if (!this.peakBackState) {
      if (!act.submission_complete) {
        this.submissionScreen = true;
        this.voteScreen = false;
        this.VnSComplete = false;
        this.timer = act.submission_countdown_timer;
        this.ideaSubmittedUsersCount = this.act.submitted_participants.length;
      } else if (act.voting_countdown_timer && !act.voting_complete) {
        this.voteScreen = true;
        this.submissionScreen = false;
        this.VnSComplete = false;
        this.timer = act.voting_countdown_timer;
        this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
      } else if (act.submission_complete && act.voting_complete) {
        this.submissionScreen = false;
        this.voteScreen = false;
        this.VnSComplete = true;
        this.timer = this.getNextActStartTimer();
      }

      // show snackbar when submission is complete
      if (
        !this.actEditor &&
        !act.submission_complete &&
        !act.voting_complete &&
        this.isAllSubmissionsComplete(act) &&
        !this.shownSubmissionCompleteNofitication
      ) {
        this.shownSubmissionCompleteNofitication = true;
        const snackBarRef = this.utilsService.openSuccessNotification('Submission complete', 'Start voting');
        snackBarRef.onAction().subscribe(($event) => {});
      }
    }
  }

  loadUsersCounts() {
    this.joinedUsers = [];
    this.answeredParticipants = [];
    this.unansweredParticipants = [];
    this.joinedUsers = this.getActiveParticipants();

    // participant_vote_counts
    if (!this.voteScreen) {
      this.activityState.brainstormactivity.submitted_participants.forEach((code) => {
        this.answeredParticipants.push(this.getParticipantName(code.participant_code));
      });
    } else if (this.voteScreen) {
      this.activityState.brainstormactivity.participant_vote_counts.forEach((code) => {
        this.answeredParticipants.push(this.getParticipantName(code.participant_code));
      });
    }
    this.unansweredParticipants = this.getUnAnsweredUsers();
  }

  getUnAnsweredUsers() {
    const answered = this.answeredParticipants;
    const active = [];
    for (let index = 0; index < this.joinedUsers.length; index++) {
      active.push(this.joinedUsers[index].display_name);
    }
    return active.filter((name) => !answered.includes(name));
  }

  isAllSubmissionsComplete(act: BrainstormActivity): boolean {
    const maxSubmissions = act.max_participant_submissions;

    let submissions = 0;
    act.participant_submission_counts.forEach((element) => {
      submissions = submissions + element.count;
    });

    let activeParticipants = 0;
    this.activityState.lesson_run.participant_set.forEach((element) => {
      if (element.is_active) {
        activeParticipants = activeParticipants + 1;
      }
    });

    const totalMaxSubmissions = activeParticipants * maxSubmissions;
    const totalCurrentSubmissions = this.getUsersIdeas(act).length;

    if (totalMaxSubmissions === totalCurrentSubmissions) {
      return true;
    }

    return false;
  }

  ngOnChanges() {
    this.onChanges();
  }

  getUsersIdeas(act: BrainstormActivity): Array<Idea> {
    let arr: Array<Idea> = [];
    act.brainstormcategory_set.forEach((category) => {
      if (!category.removed) {
        category.brainstormidea_set.forEach((idea) => {
          if (!idea.removed) {
            arr.push(idea);
          }
        });
      }
    });
    arr = arr.filter(
      (v, i, s) => i === s.findIndex((t) => t.submitting_participant === v.submitting_participant)
    );
    return arr;
  }

  getVoteSubmittedUsersCount(act: BrainstormActivity) {
    return act.participant_vote_counts.length;
  }

  deleteIdea(id) {
    this.sendMessage.emit(new BrainstormRemoveSubmissionEvent(id));
  }

  sendSocketMessage($event) {
    this.sendMessage.emit($event);
  }

  viewImage(imageUrl: string) {
    const dialogRef = this.matDialog
      .open(ImageViewDialogComponent, {
        data: { imageUrl: imageUrl },
        disableClose: false,
        panelClass: 'image-view-dialog',
      })
      .afterClosed()
      .subscribe((res) => {});
  }

  openDialog() {
    const dialogRef = this.matDialog.open(IdeaCreationDialogComponent, {
      panelClass: 'idea-dialog',
      data: {
        showCategoriesDropdown: this.categorizeFlag,
        categories: this.activityState.brainstormactivity.brainstormcategory_set,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveIdea(result);
      }
    });
  }

  saveIdea(result) {
    if (this.myGroup || this.selectedParticipantGroup) {
      let groupId = null;
      if (this.myGroup) {
        groupId = this.myGroup.id;
      } else {
        groupId = this.selectedParticipantGroup.id;
      }
      result = { ...result, groupId: groupId };
    }
    this.submitIdea(result);
  }

  submitIdea(idea): void {
    // if (!idea.editing) {
    //   return;
    // }
    if (idea.imagesList || idea.selectedImageUrl) {
      this.submitImageNIdea(idea);
    } else {
      this.submitWithoutImg(idea);
    }
  }

  submitWithoutImg(idea) {
    if (idea.text.length === 0) {
      return;
    }
    if (idea.id) {
      // if there's id in the idea that means we're editing existing idea
      this.sendMessage.emit(
        new BrainstormEditIdeaSubmitEvent(idea.id, idea.text, idea.title, idea.category.id, idea.groupId)
      );
    } else {
      // create new idea
      this.sendMessage.emit(new BrainstormSubmitEvent(idea.text, idea.title, idea.category.id, idea.groupId));
    }
  }

  submitImageNIdea(idea) {
    const code = this.activityState.lesson_run.lessonrun_code;
    const url = global.apiRoot + '/course_details/lesson_run/' + code + '/upload_image/';

    const participant_code = this.getParticipantCode().toString();
    const fileList: FileList = idea.imagesList;
    if (fileList && fileList.length > 0) {
      const file: File = fileList[0];
      this.utilsService
        .resizeImage({
          file: file,
          maxSize: 500,
        })
        .then((resizedImage: Blob) => {
          const formData: FormData = new FormData();
          formData.append('img', resizedImage, file.name);
          formData.append('participant_code', participant_code);
          const headers = new HttpHeaders();
          headers.set('Content-Type', null);
          headers.set('Accept', 'multipart/form-data');
          const params = new HttpParams();
          this.httpClient
            .post(url, formData, { params, headers })
            .map((res: any) => {
              this.imagesList = null;
              if (!idea.text) {
                idea.text = '';
              }
              this.sendMessage.emit(
                new BrainstormSubmitEvent(idea.text, idea.title, idea.category.id, idea.groupId, res.id)
              );
            })
            .subscribe(
              (data) => {},
              (error) => console.log(error)
            );
        })
        .catch(function (err) {
          console.error(err);
        });
    } else {
      if (idea.selectedImageUrl) {
        this.sendMessage.emit(
          new BrainstormImageSubmitEvent(
            idea.text,
            idea.title,
            idea.category.id,
            idea.groupId,
            idea.selectedImageUrl
          )
        );
      }
    }
  }
}
