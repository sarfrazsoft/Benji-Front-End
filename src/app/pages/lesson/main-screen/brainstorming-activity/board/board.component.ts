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
import { clone, cloneDeep, uniqBy } from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import * as global from 'src/app/globals';
import { ImageViewDialogComponent } from 'src/app/pages/lesson/shared/dialogs/image-view/image-view.dialog';
import {
  ActivitySettingsService,
  BoardsNavigationService,
  BrainstormService,
  ContextService,
  SharingToolService,
} from 'src/app/services';
import {
  Board,
  BoardMode,
  BoardStatus,
  BoardTypes,
  BrainstormActivity,
  BrainstormEditDocumentIdeaEvent,
  BrainstormEditIdeaSubmitEvent,
  BrainstormEditIdeaVideoSubmitEvent,
  BrainstormRemoveSubmissionEvent,
  BrainstormSubmitDocumentEvent,
  BrainstormSubmitEvent,
  BrainstormSubmitVideoEvent,
  BrainstormToggleCategoryModeEvent,
  Category,
  Group,
  Idea,
  ResetGroupingEvent,
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
  boardTypes = BoardTypes;

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
  lessonRunCode;
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
    private boardStatusService: BoardStatusService,
    private boardsNavigationService: BoardsNavigationService
  ) {}

  ngOnInit() {
    this.act = this.activityState.brainstormactivity;
    this.lessonRunCode = this.activityState?.lesson_run?.lessonrun_code;

    if (!this.isHost) {
      this.participantCode = this.participantCode;
    }

    if (this.isHost) {
    }

    this.onChanges();

    this.settingsSubscription = this.activitySettingsService.settingChange$.subscribe((val) => {
      if (val && val.controlName === 'participantNames') {
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

    this.boardStatusService.boardStatus$.subscribe((val: BoardStatus) => {
      if (val) {
        this.boardStatus = val;
      }
    });

    // if it is a participant and the board is hidden
    // navigate to next available board
    if (!this.isHost && this.board.status === 'closed') {
      const navigationStatus = this.boardsNavigationService.navigateToNextAvailableBoard(
        this.act.boards,
        this.board
      );
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
    } else {
      this.joinedUsers = this.activityState.lesson_run.participant_set;

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

  getBoardType() {
    if (this.board.meta?.boardType) {
      return this.board.meta?.boardType;
    }
  }
}
