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
  Board,
  BrainstormActivity,
  BrainstormCreateCategoryEvent,
  BrainstormEditIdeaSubmitEvent,
  BrainstormImageSubmitEvent,
  BrainstormRemoveCategoryEvent,
  BrainstormRemoveSubmissionEvent,
  BrainstormRenameCategoryEvent,
  BrainstormSetCategoryEvent,
  BrainstormSubmissionCompleteInternalEvent,
  BrainstormSubmitDocumentEvent,
  BrainstormSubmitEvent,
  BrainstormToggleCategoryModeEvent,
  BrainstormToggleParticipantNameEvent,
  Category,
  Group,
  Idea,
  ResetGroupingEvent,
  StartBrainstormGroupEvent,
  StartCaseStudyGroupEvent,
  Timer,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { GroupingToolGroups } from 'src/app/services/backend/schema/course_details';
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
  sub_instructions = '';
  timer: Timer;
  act: BrainstormActivity;

  submissionScreen = false;
  voteScreen = false;
  VnSComplete = false;
  categorizeFlag = false;
  showUserName = true;
  minWidth = 'small';
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

  selectedBoardIndex = 0;
  selectedBoard: Board;

  ngOnInit() {
    super.ngOnInit();
    this.participantCode = this.getParticipantCode();
    this.act = this.activityState.brainstormactivity;
    const hostBoardID = this.act.host_board;
    if (hostBoardID) {
      this.act.boards.forEach((v) => {
        if (hostBoardID === v.id) {
          this.selectedBoard = v;
        }
      });
    }
    this.brainstormService.selectedBoard = this.selectedBoard;
    this.eventType = this.getEventType();

    // this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
    //   if (val) {
    //     if (this.act.grouping && this.act.grouping.groups.length) {
    //       this.initParticipantGrouping(this.act);
    //     }
    //   }
    // });

    // this.permissionsService.hasPermission('ADMIN').then((val) => {
    //   if (val) {
    //     if (this.getEventType() === 'AssignGroupingToActivities') {
    //     }
    //     this.applyGroupingOnActivity(this.activityState);
    //     this.classificationTypes = [
    //       {
    //         type: 'everyone',
    //         title: 'Everyone',
    //         description: `Display everyone's work`,
    //         imgUrl: '/assets/img/brainstorm/everyone.svg',
    //       },
    //       {
    //         type: 'groups',
    //         title: 'Groups',
    //         description: `Display group's work`,
    //         imgUrl: '/assets/img/brainstorm/groups.svg',
    //       },
    //       // { type: 'individuals', title: 'Individuals', description: `Display single persons work`,
    //       // imgUrl: '/assets/img/brainstorm/individuals.svg' },
    //     ];
    //   }
    // });

    this.onChanges();

    // this.settingsSubscription = this.activitySettingsService.settingChange$.subscribe((val) => {
    //   if (val && val.controlName === 'participantNames') {
    //     // this.showUserName = val.state;
    //     this.sendMessage.emit(new BrainstormToggleParticipantNameEvent());
    //   }
    //   if (val && val.controlName === 'categorize') {
    //     this.sendMessage.emit(new BrainstormToggleCategoryModeEvent());
    //   }
    //   if (val && val.controlName === 'resetGrouping') {
    //     if (this.act.grouping) {
    //       const groupingID = this.act.grouping.id;
    //       this.sendMessage.emit(new ResetGroupingEvent(groupingID));
    //     }
    //   }
    //   if (val && val.controlName === 'cardSize') {
    //     this.minWidth = val.state.name;
    //   }
    // });

    // this.saveIdeaSubscription = this.brainstormService.saveIdea$.subscribe((val) => {
    //   if (val) {
    //     this.saveIdea(val);
    //   }
    // });
  }

  ngOnChanges() {
    this.onChanges();
  }

  onChanges() {
    this.eventType = this.getEventType();
    const act = this.activityState.brainstormactivity;
    this.act = cloneDeep(this.activityState.brainstormactivity);
    if (
      this.eventType === 'BrainstormEditBoardInstruction' ||
      this.eventType === 'BrainstormEditSubInstruction' ||
      this.eventType === 'HostChangeBoardEvent' ||
      this.eventType === 'BrainstormChangeModeEvent'
    ) {
    }
    const hostBoardID = this.act.host_board;
    if (hostBoardID) {
      this.act.boards.forEach((v) => {
        if (hostBoardID === v.id) {
          this.selectedBoard = v;
          this.brainstormService.selectedBoard = this.selectedBoard;
        }
      });
    }

    console.log(this.activityState.brainstormactivity);

    // populate groupings dropdown
    // if (this.act.grouping && this.act.grouping.groups.length) {
    //   this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
    //     if (val) {
    //       this.participantCode = this.getParticipantCode();
    //       this.initParticipantGrouping(this.act);
    //     }
    //   });
    //   this.permissionsService.hasPermission('ADMIN').then((val) => {
    //     if (val) {
    //       this.participantGroups = this.act.grouping.groups;
    //     }
    //   });
    // } else {
    //   // grouping is null in activity
    //   if (this.getEventType() === 'AssignGroupingToActivities') {
    //     this.applyGroupingOnActivity(this.activityState);
    //   }
    // }

    const sm = this.activityState;
    if (sm && sm.running_tools && sm.running_tools.grouping_tool) {
      const gt = sm.running_tools.grouping_tool;
      this.sharingToolService.updateParticipantGroupingToolDialog(gt);
    }

    // if (this.act.brainstormcategory_set.length) {
    //   // check if the categories have ids
    //   // if categories don't have ids it means
    //   // we're in the preview panel
    //   if (this.act.brainstormcategory_set[0].id) {
    //     this.act.brainstormcategory_set = this.act.brainstormcategory_set.sort((a, b) => a.id - b.id);
    //   } else {
    //   }
    // }
    // this.joinedUsers = this.activityState.lesson_run.participant_set;

    // this.instructions = act.instructions;
    // this.sub_instructions = act.sub_instructions;

    // this.categorizeFlag = act.categorize_flag;
    // this.showUserName = act.show_participant_name_flag;

    // if (this.peakBackState && this.peakBackStage === null) {
    //   this.voteScreen = true;
    //   this.submissionScreen = false;
    //   this.VnSComplete = false;
    //   this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
    // } else if (!this.peakBackState) {
    //   if (!act.submission_complete) {
    //     this.submissionScreen = true;
    //     this.voteScreen = false;
    //     this.VnSComplete = false;
    //     this.timer = act.submission_countdown_timer;
    //     this.ideaSubmittedUsersCount = this.act.submitted_participants.length;
    //   } else if (act.voting_countdown_timer && !act.voting_complete) {
    //     this.voteScreen = true;
    //     this.submissionScreen = false;
    //     this.VnSComplete = false;
    //     this.timer = act.voting_countdown_timer;
    //     this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
    //   } else if (act.submission_complete && act.voting_complete) {
    //     this.submissionScreen = false;
    //     this.voteScreen = false;
    //     this.VnSComplete = true;
    //     this.timer = this.getNextActStartTimer();
    //   }

    //   // show snackbar when submission is complete
    //   // if (
    //   //   !this.actEditor &&
    //   //   !act.submission_complete &&
    //   //   !act.voting_complete &&
    //   //   this.isAllSubmissionsComplete(act) &&
    //   //   !this.shownSubmissionCompleteNofitication
    //   // ) {
    //   //   this.shownSubmissionCompleteNofitication = true;
    //   //   const snackBarRef = this.utilsService.openSuccessNotification
    //   // ('Submission complete', 'Start voting');
    //   //   snackBarRef.onAction().subscribe(($event) => {});
    //   // }
    // }
  }

  ngOnDestroy() {
    this.contextService.destroyActivityTimer();
    if (this.settingsSubscription) {
      this.settingsSubscription.unsubscribe();
    }
    if (this.saveIdeaSubscription) {
      this.saveIdeaSubscription.unsubscribe();
    }
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  // getParticipantGroup(participantCode, participantGroups) {
  //   return this.brainstormService.getMyGroup(participantCode, participantGroups);
  // }

  // initParticipantGrouping(act: BrainstormActivity) {
  //   // Check if groups are created
  //   // if groups are present then check if participant is in the group
  //   // if participant is not present in the group then open grouping info dialog
  //   this.participantGroups = this.act.grouping.groups;
  //   if (this.participantGroups.length > 0) {
  //     this.myGroup = this.getParticipantGroup(this.participantCode, this.participantGroups);
  //     if (this.myGroup === null) {
  //       // There are groups in the activity but this participant is not in any groups
  //       if (this.dialogRef) {
  //         this.sharingToolService.updateParticipantGroupingInfoDialog(
  //           this.activityState.running_tools.grouping_tool
  //         );
  //         // this.dialogRef.close();
  //         // this.dialogRef = null;
  //       } else if (!this.dialogRef || !this.dialogRef.componentInstance) {
  //         this.dialogRef = this.sharingToolService.openParticipantGroupingInfoDialog(
  //           this.activityState,
  //           this.participantCode
  //         );
  //         // this.dialogRef =
  //         // this.sharingToolService.openParticipantGroupingToolDialog(this.activityState);
  //         this.sharingToolService.sendMessage$.subscribe((v) => {
  //           if (v) {
  //             this.sendMessage.emit(v);
  //           }
  //         });
  //       }
  //     } else {
  //       // filter ideas on participant screen by the group they are in.
  //       this.filterIdeasBasedOnGroup(this.myGroup);
  //       if (this.dialogRef) {
  //         this.dialogRef.close();
  //       }
  //     }
  //   }
  // }

  // resetGrouping() {
  //   const activityType = this.getActivityType().toLowerCase();
  //   this.sendMessage.emit(new ResetGroupingEvent(this.activityState[activityType].grouping.id));
  // }

  getPersonName(idea: Idea) {
    if (idea && idea.submitting_participant) {
      const user = this.joinedUsers.find(
        (u) => u.participant_code === idea.submitting_participant.participant_code
      );
      return user.display_name;
    }
  }

  // getMinWidth() {
  //   return this.minWidth === 'small' ? 280 : this.minWidth === 'medium' ? 360 : 480;
  // }
  // classificationTypeChanged(selectedClassificationType) {
  //   // console.log(selectedClassificationType);
  //   const sct = selectedClassificationType;
  //   if (sct.type === 'everyone') {
  //     // this.participantGroups = null;
  //     this.selectedParticipantGroup = null;
  //     this.showParticipantsGroupsDropdown = false;

  //     this.act = cloneDeep(this.activityState.brainstormactivity);
  //   } else if (sct.type === 'groups') {
  //     this.participantGroups = this.act.grouping.groups;
  //     this.showParticipantsGroupsDropdown = true;
  //   } else if (sct.type === 'individuals') {
  //     this.participantGroups = null;
  //   }
  // }

  // ParticipantGroupChanged(selectedParticipantGroup: Group) {
  //   this.filterIdeasBasedOnGroup(selectedParticipantGroup);
  // }

  // filterIdeasBasedOnGroup(selectedParticipantGroup: Group) {
  //   // console.log(selectedParticipantGroup);
  //   // console.log(this.act);
  //   const act = cloneDeep(this.activityState.brainstormactivity);
  //   for (let i = 0; i < act.brainstormcategory_set.length; i++) {
  //     const category = act.brainstormcategory_set[i];
  //     if (!category.removed) {
  //       for (let j = 0; j < category.brainstormidea_set.length; j++) {
  //         const idea = category.brainstormidea_set[j];
  //         if (idea.submitting_participant) {
  //           if (
  //             !selectedParticipantGroup.participants.includes(idea.submitting_participant.participant_code)
  //           ) {
  //             category.brainstormidea_set.splice(j, 1);
  //             j--;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   this.act = act;
  //   this.eventType = 'filtered';
  // }

  // loadUsersCounts() {
  //   this.joinedUsers = [];
  //   this.answeredParticipants = [];
  //   this.unansweredParticipants = [];
  //   this.joinedUsers = this.getActiveParticipants();

  //   // participant_vote_counts
  //   if (!this.voteScreen) {
  //     this.activityState.brainstormactivity.submitted_participants.forEach((code) => {
  //       this.answeredParticipants.push(this.getParticipantName(code.participant_code));
  //     });
  //   } else if (this.voteScreen) {
  //     this.activityState.brainstormactivity.participant_vote_counts.forEach((code) => {
  //       this.answeredParticipants.push(this.getParticipantName(code.participant_code));
  //     });
  //   }
  //   this.unansweredParticipants = this.getUnAnsweredUsers();
  // }

  // getUnAnsweredUsers() {
  //   const answered = this.answeredParticipants;
  //   const active = [];
  //   for (let index = 0; index < this.joinedUsers.length; index++) {
  //     active.push(this.joinedUsers[index].display_name);
  //   }
  //   return active.filter((name) => !answered.includes(name));
  // }

  // isAllSubmissionsComplete(act: BrainstormActivity): boolean {
  //   const maxSubmissions = act.max_participant_submissions;

  //   let submissions = 0;
  //   act.participant_submission_counts.forEach((element) => {
  //     submissions = submissions + element.count;
  //   });

  //   let activeParticipants = 0;
  //   this.activityState.lesson_run.participant_set.forEach((element) => {
  //     if (element.is_active) {
  //       activeParticipants = activeParticipants + 1;
  //     }
  //   });

  //   const totalMaxSubmissions = activeParticipants * maxSubmissions;
  //   const totalCurrentSubmissions = this.getUsersIdeas(act).length;

  //   if (totalMaxSubmissions === totalCurrentSubmissions) {
  //     return true;
  //   }

  //   return false;
  // }

  getUsersIdeas(act: BrainstormActivity): Array<Idea> {
    let arr: Array<Idea> = [];
    // act.brainstormcategory_set.forEach((category) => {
    //   if (!category.removed) {
    //     category.brainstormidea_set.forEach((idea) => {
    //       if (!idea.removed) {
    //         arr.push(idea);
    //       }
    //     });
    //   }
    // });
    arr = arr.filter(
      (v, i, s) => i === s.findIndex((t) => t.submitting_participant === v.submitting_participant)
    );
    return arr;
  }

  // getVoteSubmittedUsersCount(act: BrainstormActivity) {
  //   return act.participant_vote_counts.length;
  // }

  // deleteIdea(id) {
  //   this.sendMessage.emit(new BrainstormRemoveSubmissionEvent(id));
  // }

  sendSocketMessage($event) {
    this.sendMessage.emit($event);
  }

  // viewImage(imageUrl: string) {
  //   const dialogRef = this.matDialog
  //     .open(ImageViewDialogComponent, {
  //       data: { imageUrl: imageUrl },
  //       disableClose: false,
  //       panelClass: 'image-view-dialog',
  //     })
  //     .afterClosed()
  //     .subscribe((res) => {});
  // }

  // addCardUnderCategory(category: Category) {
  //   this.openDialog(category);
  // }

  // openDialog(category?: Category) {
  //   const dialogRef = this.matDialog.open(IdeaCreationDialogComponent, {
  //     panelClass: 'idea-creation-dialog',
  //     data: {
  //       showCategoriesDropdown: this.categorizeFlag,
  //       categories: this.activityState.brainstormactivity.brainstormcategory_set,
  //       lessonID: this.activityState.lesson_run.lessonrun_code,
  //       category: category,
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.saveIdea(result);
  //     }
  //   });
  // }

  // saveIdea(result) {
  //   if (this.myGroup || this.selectedParticipantGroup) {
  //     let groupId = null;
  //     if (this.myGroup) {
  //       groupId = this.myGroup.id;
  //     } else {
  //       groupId = this.selectedParticipantGroup.id;
  //     }
  //     result = { ...result, groupId: groupId };
  //   }
  //   this.submitIdea(result);
  // }

  // submitIdea(idea): void {
  //   // if (!idea.editing) {
  //   //   return;
  //   // }
  //   if (idea.imagesList || idea.selectedThirdPartyImageUrl) {
  //     this.submitImageNIdea(idea);
  //   } else if (idea.selectedpdfDoc) {
  //     this.submitDocumentNIdea(idea);
  //   } else {
  //     this.submitWithoutImg(idea);
  //   }
  // }

  // submitWithoutImg(idea) {
  //   // if (idea.text.length === 0) {
  //   //   return;
  //   // }
  //   if (idea.id) {
  //     // if there's id in the idea that means we're editing existing idea
  //     this.sendMessage.emit(
  //       new BrainstormEditIdeaSubmitEvent(idea.id, idea.text, idea.title, idea.category.id, idea.groupId)
  //     );
  //   } else {
  //     // create new idea
  //     this.sendMessage.emit(new BrainstormSubmitEvent(idea.text, idea.title,
  // idea.category.id, idea.groupId));
  //   }
  // }

  // submitImageNIdea(idea) {
  //   const code = this.activityState.lesson_run.lessonrun_code;
  //   const url = global.apiRoot + '/course_details/lesson_run/' + code + '/upload_image/';

  //   const participant_code = this.getParticipantCode();
  //   const fileList: FileList = idea.imagesList;
  //   console.log();
  //   if (fileList && fileList.length > 0) {
  //     const file: File = fileList[0];
  //     this.utilsService
  //       .resizeImage({
  //         file: file,
  //         maxSize: 500,
  //       })
  //       .then((resizedImage: Blob) => {
  //         const formData: FormData = new FormData();
  //         formData.append('img', resizedImage, file.name);
  //         formData.append('participant_code', participant_code ? participant_code.toString() : '');
  //         const headers = new HttpHeaders();
  //         headers.set('Content-Type', null);
  //         headers.set('Accept', 'multipart/form-data');
  //         const params = new HttpParams();
  //         this.httpClient
  //           .post(url, formData, { params, headers })
  //           .map((res: any) => {
  //             this.imagesList = null;
  //             if (!idea.text) {
  //               idea.text = '';
  //             }
  //             this.sendMessage.emit(
  //               new BrainstormSubmitEvent(idea.text, idea.title, idea.category.id, idea.groupId, res.id)
  //             );
  //           })
  //           .subscribe(
  //             (data) => {},
  //             (error) => console.log(error)
  //           );
  //       })
  //       .catch(function (err) {
  //         console.error(err);
  //       });
  //   } else {
  //     if (idea.selectedThirdPartyImageUrl) {
  //       this.sendMessage.emit(
  //         new BrainstormImageSubmitEvent(
  //           idea.text,
  //           idea.title,
  //           idea.category.id,
  //           idea.groupId,
  //           idea.selectedThirdPartyImageUrl
  //         )
  //       );
  //     }
  //   }
  // }

  // submitDocumentNIdea(idea) {
  //   const code = this.activityState.lesson_run.lessonrun_code;
  //   const url = global.apiRoot + '/course_details/lesson_run/' + code + '/upload_document/';

  //   const participant_code = this.getParticipantCode().toString();
  //   const file: File = idea.selectedpdfDoc;
  //   if (file) {
  //     const formData: FormData = new FormData();
  //     formData.append('document', file, file.name);
  //     formData.append('participant_code', participant_code);
  //     const headers = new HttpHeaders();
  //     headers.set('Content-Type', null);
  //     headers.set('Accept', 'multipart/form-data');
  //     const params = new HttpParams();
  //     this.httpClient
  //       .post(url, formData, { params, headers })
  //       .map((res: any) => {
  //         // we will get ID of document and that will be attached
  //         // with the idea
  //         this.sendMessage.emit(
  //           new BrainstormSubmitDocumentEvent(idea.text, idea.title
  //  idea.category.id, idea.groupId, res.id)
  //         );
  //       })
  //       .subscribe(
  //         (data) => {},
  //         (error) => console.log(error)
  //       );
  //   }
  //   // uploadFile(file: File, lessonId): Observable<any[]> {
  //   //   const formData: FormData = new FormData();
  //   //   formData.append('document', file);
  //   //   formData.append('lesson_id', lessonId);
  //   //   return this.httpClient.post<any[]>(global.apiRoot + '/course_details/upload-document/', formData);
  //   // }
  // }

  // changeStage(state) {
  //   this.peakBackStage = state;
  //   const act = this.activityState.brainstormactivity;
  //   if (state === 'next') {
  //   } else {
  //     // state === 'previous'
  //   }

  //   if (this.submissionScreen) {
  //     if (state === 'next') {
  //       this.voteScreen = true;
  //       this.submissionScreen = false;
  //       this.VnSComplete = false;
  //       this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
  //     } else {
  //       // state === 'previous'
  //       // do nothing
  //     }
  //   } else if (this.voteScreen) {
  //     if (state === 'next') {
  //       this.submissionScreen = false;
  //       this.voteScreen = false;
  //       this.VnSComplete = true;
  //     } else {
  //       // state === 'previous'
  //       this.submissionScreen = true;
  //       this.voteScreen = false;
  //       this.VnSComplete = false;
  //       this.ideaSubmittedUsersCount = this.act.submitted_participants.length;
  //     }
  //   } else if (this.VnSComplete) {
  //     if (state === 'next') {
  //       // do nothing
  //     } else {
  //       // state === 'previous'
  //       this.voteScreen = true;
  //       this.submissionScreen = false;
  //       this.VnSComplete = false;
  //       this.voteSubmittedUsersCount = this.getVoteSubmittedUsersCount(act);
  //     }
  //   }
  // }
}
