import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
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
  BoardMode,
  BoardStatus,
  BrainstormActivity,
  BrainstormEditDocumentIdeaEvent,
  BrainstormEditIdeaSubmitEvent,
  BrainstormEditIdeaVideoSubmitEvent,
  BrainstormEditInstructionEvent,
  BrainstormEditSubInstructionEvent,
  BrainstormRemoveSubmissionEvent,
  BrainstormSubmitDocumentEvent,
  BrainstormSubmitEvent,
  BrainstormSubmitVideoEvent,
  BrainstormToggleCategoryModeEvent,
  Category,
  Group,
  Idea,
  ResetGroupingEvent,
  StartBrainstormGroupEvent,
  Timer,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IdeaCreationDialogComponent } from 'src/app/shared/dialogs/idea-creation-dialog/idea-creation.dialog';
import { ParticipantGroupingInfoDialogComponent } from 'src/app/shared/dialogs/participant-grouping-info-dialog/participant-grouping-info.dialog';
import { isSet } from 'src/app/shared/util/value';

@Component({
  selector: 'benji-ideas-board',
  templateUrl: './board.component.html',
})
export class BoardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() board: Board;
  @Input() activityState: UpdateMessage;
  @Input() isHost: boolean;
  @Input() eventType;
  @Input() boardMode: BoardMode;

  showParticipantsGroupsDropdown = false;
  @Input() participantCode;

  timer: Timer;
  act: BrainstormActivity;

  voteScreen = false;
  VnSComplete = false;
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
  boardStatus: BoardStatus;

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
  private typingTimer;

  @ViewChild('brainstormHeadWrapper') elementView: ElementRef;
  headWrapperHeight;

  @Output() sendMessage = new EventEmitter<any>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private contextService: ContextService,
    private matDialog: MatDialog,
    private utilsService: UtilsService,
    private activitySettingsService: ActivitySettingsService,
    private httpClient: HttpClient,
    private permissionsService: NgxPermissionsService,
    private sharingToolService: SharingToolService,
    private brainstormService: BrainstormService,
    private boardStatusService: BoardStatusService
  ) {}

  ngOnInit() {
    this.act = this.activityState.brainstormactivity;

    if (!this.isHost) {
      this.participantCode = this.participantCode;
      if (this.board.board_activity.grouping && this.board.board_activity.grouping.groups.length) {
        this.initParticipantGrouping(this.act);
      }
    }

    if (this.isHost) {
      if (this.eventType === 'AssignGroupingToActivities') {
      }
      this.applyGroupingOnActivity(this.activityState);
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

    this.onChanges();

    this.settingsSubscription = this.activitySettingsService.settingChange$.subscribe((val) => {
      if (val && val.controlName === 'participantNames') {
        // this.showUserName = val.state;
        // this.sendMessage.emit(new BrainstormToggleParticipantNameEvent());
      }
      if (val && val.controlName === 'categorize') {
        this.sendMessage.emit(new BrainstormToggleCategoryModeEvent());
      }
      if (val && val.controlName === 'resetGrouping') {
        if (this.board.board_activity.grouping) {
          const groupingID = this.board.board_activity.grouping.id;
          this.sendMessage.emit(new ResetGroupingEvent(groupingID));
        }
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

    this.boardStatusService.boardStatus$.subscribe((val: BoardStatus) => {
      if (val) {
        this.boardStatus = val;
      }
    });

    this.getBoardInstructions();
  }

  getBoardInstructions() {
    // this.brainstormService.boardTitle$.subscribe((title: string) => {
    //   if (title) {
    //     this.title_instructions = title;
    //   }
    // });
    // this.brainstormService.boardInstructions$.subscribe((instructions: string) => {
    //   if (instructions) {
    //     this.sub_instructions = instructions;
    //   }
    // });
  }

  applyGroupingOnActivity(state: UpdateMessage) {
    // const activityType = this.getActivityType().toLowerCase();
    if (this.board.board_activity.grouping !== null) {
      // if grouping is already applied return
      return;
    }
    // if grouping is not applied check if grouping tool has
    // information if grouping should be applied on this activity or not
    const sm = state;
    if (sm && sm.running_tools && sm.running_tools.grouping_tool) {
      const gt = sm.running_tools.grouping_tool;
      for (const grouping of gt.groupings) {
        // if (
        //   grouping.assignedActivities &&
        //   grouping.assignedActivities.includes(state[activityType].activity_id)
        // ) {
        // const assignedActivities = ['1637726964645'];
        // if (assignedActivities.includes(state[activityType].activity_id)) {
        // if (activityType === 'brainstormactivity') {
        this.sendMessage.emit(new StartBrainstormGroupEvent(grouping.id, this.board.id));
        // } else if (activityType === 'casestudyactivity') {
        //   this.sendMessage.emit(new StartCaseStudyGroupEvent(grouping.id));
        // }
        break;
        // }
      }
    }
  }

  ngOnChanges() {
    this.onChanges();
  }

  onChanges() {
    const act = this.activityState.brainstormactivity;
    this.act = cloneDeep(this.activityState.brainstormactivity);
    if (this.elementView && this.elementView.nativeElement) {
      this.headWrapperHeight = this.elementView.nativeElement.offsetHeight + 49;
    }
    if (
      this.eventType === 'BrainstormEditBoardInstruction' ||
      this.eventType === 'BrainstormEditSubInstruction'
    ) {
      this.getBoardInstructions();

      // console.log(this.elementView.nativeElement.offsetHeight);
      // this.headWrapperHeight = this.elementView.nativeElement.offsetHeight;
    } else {
      // populate groupings dropdown
      // if (
      //   this.board &&
      //   this.board.board_activity.grouping &&
      //   this.board.board_activity.grouping.groups.length
      // ) {
      //   this.permissionsService.hasPermission('PARTICIPANT').then((val) => {
      //     if (val) {
      //       this.initParticipantGrouping(this.act);
      //     }
      //   });
      //   this.permissionsService.hasPermission('ADMIN').then((val) => {
      //     if (val) {
      //       this.participantGroups = this.board.board_activity.grouping.groups;
      //     }
      //   });
      // } else {
      //   // grouping is null in activity
      //   if (this.eventType === 'AssignGroupingToActivities') {
      //     this.applyGroupingOnActivity(this.activityState);
      //   }
      // }

      const sm = this.activityState;
      if (sm && sm.running_tools && sm.running_tools.grouping_tool) {
        const gt = sm.running_tools.grouping_tool;
        this.sharingToolService.updateParticipantGroupingToolDialog(gt);
      }

      this.joinedUsers = this.activityState.lesson_run.participant_set;

      this.getBoardInstructions();

      this.showUserName = this.board.board_activity.show_participant_name_flag;
    }
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

  getParticipantGroup(participantCode, participantGroups) {
    return this.brainstormService.getMyGroup(participantCode, participantGroups);
  }

  initParticipantGrouping(act: BrainstormActivity) {
    // Check if groups are created
    // if groups are present then check if participant is in the group
    // if participant is not present in the group then open grouping info dialog
    this.participantGroups = this.board.board_activity.grouping.groups;
    if (this.participantGroups.length > 0) {
      this.myGroup = this.getParticipantGroup(this.participantCode, this.participantGroups);
      if (this.myGroup === null) {
        // There are groups in the activity but this participant is not in any groups
        if (this.dialogRef) {
          this.sharingToolService.updateParticipantGroupingInfoDialog(
            this.activityState.running_tools.grouping_tool
          );
          // this.dialogRef.close();
          // this.dialogRef = null;
        } else if (!this.dialogRef || !this.dialogRef.componentInstance) {
          this.dialogRef = this.sharingToolService.openParticipantGroupingInfoDialog(
            this.activityState,
            this.participantCode
          );
          // this.dialogRef =
          // this.sharingToolService.openParticipantGroupingToolDialog(this.activityState);
          this.sharingToolService.sendMessage$.subscribe((v) => {
            if (v) {
              this.sendMessage.emit(v);
            }
          });
        }
      } else {
        // filter ideas on participant screen by the group they are in.
        this.filterIdeasBasedOnGroup(this.myGroup);
        if (this.dialogRef) {
          this.dialogRef.close();
        }
      }
    }
  }

  resetGrouping() {
    this.sendMessage.emit(new ResetGroupingEvent(this.board.board_activity.grouping.id));
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
    return this.minWidth === 'small' ? 288 : this.minWidth === 'medium' ? 360 : 480;
  }
  classificationTypeChanged(selectedClassificationType) {
    const sct = selectedClassificationType;
    if (sct.type === 'everyone') {
      // this.participantGroups = null;
      this.selectedParticipantGroup = null;
      this.showParticipantsGroupsDropdown = false;

      this.act = cloneDeep(this.activityState.brainstormactivity);
    } else if (sct.type === 'groups') {
      this.participantGroups = this.board.board_activity.grouping.groups;
      this.showParticipantsGroupsDropdown = true;
    } else if (sct.type === 'individuals') {
      this.participantGroups = null;
    }
  }

  ParticipantGroupChanged(selectedParticipantGroup: Group) {
    this.filterIdeasBasedOnGroup(selectedParticipantGroup);
  }

  filterIdeasBasedOnGroup(selectedParticipantGroup: Group) {
    const board = cloneDeep(this.board);
    for (let i = 0; i < board.brainstormcategory_set.length; i++) {
      const category = board.brainstormcategory_set[i];
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
    this.board = board;
    this.eventType = 'filtered';
  }

  getUsersIdeas(act: BrainstormActivity): Array<Idea> {
    let arr: Array<Idea> = [];
    this.board.brainstormcategory_set.forEach((category) => {
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

  addCardUnderCategory(category: Category) {
    this.openDialog(category);
  }

  postIdeaClickedInChild() {
    this.openDialog();
  }

  openDialog(category?: Category) {
    const dialogRef = this.matDialog.open(IdeaCreationDialogComponent, {
      panelClass: 'idea-creation-dialog',
      data: {
        showCategoriesDropdown: this.boardMode === 'columns',
        categories: this.board.brainstormcategory_set,
        lessonRunCode: this.activityState.lesson_run.lessonrun_code,
        category: category,
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
    // idea.idea_image when idea is being edited
    console.log(idea);
    if (idea.imagesList || idea.selectedThirdPartyImageUrl || idea.idea_image) {
      this.submitImageNIdea(idea);
    } else if (idea.selectedpdfDoc) {
      this.submitDocumentNIdea(idea);
    } else if (idea.video_id) {
      this.submitWithVideo(idea);
    } else if (idea.webcamImageId) {
      this.submitWithWebcamImage(idea);
    } else if (idea.meta) {
      this.submitWithWebcamImage(idea);
    } else {
      this.submitWithoutImg(idea);
    }
  }

  submit(i) {
    this.sendMessage.emit(new BrainstormSubmitEvent(i));
  }

  edit(i) {
    this.sendMessage.emit(new BrainstormEditIdeaSubmitEvent(i));
  }

  submitWithWebcamImage(idea) {
    let i: any = {
      text: idea.text,
      title: idea.title,
      category: idea.category.id,
      groupId: idea.groupId,
      idea_image: idea.webcamImageId,
      image_path: idea.selectedThirdPartyImageUrl,
      idea_video: idea.video_id,
      meta: idea.meta,
    };
    if (idea.id) {
      i = { id: idea.id, ...i };
      // idea exists
      // image has been added using webcam
      // TODO(mahin)
      this.edit(i);
    } else {
      this.submit(i);
    }
  }

  submitWithoutImg(idea) {
    if (!idea.text && !idea.title) {
      return;
    }
    if (idea.text && idea.text.length === 0 && idea.title && idea.title.length === 0) {
      return;
    }
    let i: any = {
      text: idea.text,
      title: idea.title,
      category: idea.category.id,
      groupId: idea.groupId,
      idea_image: idea.idea_image ? (idea.idea_image.id ? idea.idea_image.id : null) : null,
      image_path: idea.selectedThirdPartyImageUrl,
      idea_video: idea.video_id,
    };
    if (idea.id) {
      // if there's id in the idea that means we're editing existing idea
      i = { ...i, id: idea.id };
      this.edit(i);
    } else {
      // create new idea
      this.submit(i);
    }
  }

  submitWithVideo(idea) {
    let i: any = {
      text: idea.text,
      title: idea.title,
      category: idea.category.id,
      groupId: idea.groupId,
      idea_image: idea.webcamImageId,
      image_path: idea.selectedThirdPartyImageUrl,
      idea_video: idea.video_id,
    };
    if (idea.id) {
      // update video
      i = { ...i, id: idea.id };
      this.sendMessage.emit(new BrainstormEditIdeaVideoSubmitEvent(i));
    } else {
      // create idea with uploaded video
      this.sendMessage.emit(new BrainstormSubmitVideoEvent(i));
    }
  }

  uploadImageNCreateEditIdea(idea, action: 'create' | 'edit') {
    const fileList: FileList = idea.imagesList;
    const participant_code = this.participantCode;
    const code = this.activityState.lesson_run.lessonrun_code;
    const url = global.apiRoot + '/course_details/lesson_run/' + code + '/upload_document/';
    const file: File = fileList[0];
    this.utilsService
      .resizeImage({
        file: file,
        maxSize: 500,
      })
      .then((resizedImage: Blob) => {
        console.log(resizedImage);
        const formData: FormData = new FormData();
        formData.append('document', resizedImage, file.name);
        formData.append('participant_code', participant_code ? participant_code.toString() : '');
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
            let i: any = {
              text: idea.text,
              title: idea.title,
              category: idea.category.id,
              groupId: idea.groupId,
              idea_image: res.id,
            };
            if (action === 'create') {
              this.submit(i);
            } else if (action === 'edit') {
              i = { ...i, id: idea.id };
              this.edit(i);
            }
          })
          .subscribe(
            (data) => {},
            (error) => console.log(error)
          );
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  submitImageNIdea(idea) {
    if (idea.id) {
      // update the idea with an image
      this.updateIdeaWithImage(idea);
      return;
    }

    if (idea.imagesList && idea.imagesList.length > 0) {
      // if it is an image to be uploaded
      this.uploadImageNCreateEditIdea(idea, 'create');
    } else {
      // if it is a url from third party image service
      if (idea.selectedThirdPartyImageUrl) {
        const i: any = {
          text: idea.text,
          title: idea.title,
          category: idea.category.id,
          groupId: idea.groupId,
          idea_image: idea.idea_image ? (idea.idea_image.id ? idea.idea_image.id : null) : null,
          image_path: idea.selectedThirdPartyImageUrl,
        };
        this.submit(i);
      }
    }
  }

  updateIdeaWithImage(idea) {
    // idea.idea_image when idea is being edited
    if (idea.selectedThirdPartyImageUrl || idea.idea_image) {
      // updated with third party image
      const i = {
        id: idea.id,
        text: idea.text,
        title: idea.title,
        category: idea.category.id,
        groupId: idea.groupId,
        idea_image: undefined,
        image_path: idea.selectedThirdPartyImageUrl,
      };
      this.sendMessage.emit(new BrainstormEditIdeaSubmitEvent(i));
    } else {
      // idea is updated with computer uploaded image
      this.uploadImageNCreateEditIdea(idea, 'edit');
    }
  }

  submitDocumentNIdea(idea) {
    if (idea.id) {
      // update the idea with an image
      this.updateIdeaWithDocument(idea);
      return;
    }
    this.sendMessage.emit(
      new BrainstormSubmitDocumentEvent(
        idea.text,
        idea.title,
        idea.category.id,
        idea.groupId,
        idea.selectedpdfDoc
      )
    );
  }

  updateIdeaWithDocument(idea) {
    this.sendMessage.emit(
      new BrainstormEditDocumentIdeaEvent(
        idea.id,
        idea.text,
        idea.title,
        idea.category.id,
        idea.selectedpdfDoc
      )
    );
  }

  isSet(val) {
    return isSet(val);
  }
  submitWithIframeData(idea) {
    let i: any = {
      text: idea.text,
      title: idea.title,
      categoryId: idea.category.id,
      meta: {
        iframe: idea.iframeData,
      },
    };
    if (idea.id) {
      i = { ...i, id: i.id };
      this.sendMessage.emit(new BrainstormEditIdeaSubmitEvent(i));
    } else {
      this.sendMessage.emit(new BrainstormSubmitEvent(i));
    }
  }
}
