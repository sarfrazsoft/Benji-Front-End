import { animate, state, style, transition, trigger } from '@angular/animations';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as LogRocket from 'logrocket';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPermissionsService } from 'ngx-permissions';
import { fromEvent } from 'rxjs';
import { ActivitiesService, BrainstormEventService, BrainstormService } from 'src/app/services/activities';
import {
  Board,
  BoardStatus,
  BrainstormActivity,
  BrainstormRemoveIdeaCommentEvent,
  BrainstormRemoveIdeaHeartEvent,
  BrainstormRemoveIdeaPinEvent,
  BrainstormSubmitIdeaCommentEvent,
  BrainstormSubmitIdeaHeartEvent,
  EventTypes,
  Idea,
  PostSize,
  QueryParamsObject,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import {
  BrainstormRemoveIdeaCommentResponse,
  BrainstormSubmitIdeaCommentResponse,
} from 'src/app/services/backend/schema/event-responses';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { UtilsService } from 'src/app/services/utils.service';
import { IdeaDetailedInfo, IdeaUserRole } from 'src/app/shared/components/idea-detailed/idea-detailed';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs';
import { IdeaDetailedDialogComponent } from 'src/app/shared/dialogs/idea-detailed-dialog/idea-detailed.dialog';
import { environment } from 'src/environments/environment';

@UntilDestroy()
@Component({
  selector: 'benji-brainstorm-card',
  templateUrl: './brainstorm-card.component.html',
  animations: [
    trigger('enableDisable', [
      // ...
      state(
        'enabled',
        style({
          opacity: 1,
          display: 'block',
        })
      ),
      state(
        'disabled',
        style({
          opacity: 0,
          display: 'none',
        })
      ),
      transition('enabled => disabled', [animate('0.1s')]),
      transition('disabled => enabled', [animate('0.1s')]),
    ]),
  ],
})
export class BrainstormCardComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() board: Board;
  @Input() item: Idea;
  @Input() category;
  @Input() submissionScreen;
  @Input() voteScreen;
  @Input() act: BrainstormActivity;
  @Input() activityState: UpdateMessage;
  @Input() minWidth;
  @Input() sendMessage;
  @Input() joinedUsers;
  showUserName;
  @Input() participantCode;
  @Input() eventType;
  @Input() isColumnsLayout;
  @Input() myGroup;
  @Input() avatarSize;
  @Input() userRole: IdeaUserRole;
  @Input() ideaDetailedDialogOpen: boolean;
  @ViewChild('colName') colNameElement: ElementRef;
  @ViewChild('player') player: ElementRef;
  hostname = environment.web_protocol + '://' + environment.host;

  @Output() viewImage = new EventEmitter<string>();
  @Output() deleteIdea = new EventEmitter<Idea>();
  @Output() viewChanged = new EventEmitter<any>();
  @Output() ideaDetailedDialogOpened = new EventEmitter<any>();
  @Output() ideaDetailedDialogClosed = new EventEmitter<any>();

  commentModel = '';
  submittingUser = undefined;
  submitting_participant;

  deactivateHearting = false;
  classGrey: boolean;
  classWhite: boolean;
  commentKey: string;
  imgSrc = '/assets/img/cards/like.svg';
  isAdmin: boolean;
  boardStatus: BoardStatus;
  mobileSize = false;
  timeStamp: string;
  postSize: PostSize;

  videoAvailable = false;
  oldVideo;

  delta = 6;
  startX;
  startY;

  ideaDetailedDialogRef: MatDialogRef<IdeaDetailedDialogComponent, any>;
  userSubmittedComment = false;
  userSubmittedSuccesfully = false;
  queryParamSubscription;

  localActivityState: UpdateMessage;

  @ViewChild('iframeContainer') iframeContainer: ElementRef;
  hostAvatarSize: string;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private matDialog: MatDialog,
    private activitiesService: ActivitiesService,
    private brainstormService: BrainstormService,
    private brainstormEventService: BrainstormEventService,
    private deviceService: DeviceDetectorService,
    private _ngZone: NgZone,
    private ngxPermissionsService: NgxPermissionsService,
    private boardStatusService: BoardStatusService,
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {
    // get parameters
    if (this.eventType !== 'BrainstormSetCategoryEvent') {
      this.queryParamSubscription = this.activatedRoute.queryParams.subscribe((p: QueryParamsObject) => {
        if (p.post && !this.ideaDetailedDialogOpen) {
          // tslint:disable-next-line:radix
          if (parseInt(p.post) === this.item.id) {
            this.showDetailedIdea(this.item);
          }
        }
      });
    }

    if (this.item && this.item.submitting_participant) {
      this.submittingUser = this.item.submitting_participant.participant_code;
      this.commentKey = 'comment_' + this.item.id + this.submittingUser;
    } else {
      // it is host's idea
      if (this.participantCode) {
        // a participant is viewing it
        this.commentKey = 'comment_' + this.item.id + 'host';
      }
    }

    if (this.participantCode) {
    } else {
      this.commentKey = 'comment_' + this.item?.id + 'host';
    }

    const draftComment = this.brainstormService.getDraftComment(this.commentKey);
    if (draftComment) {
      this.commentModel = draftComment;
    }

    this.ngxPermissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.isAdmin = true;
      }
    });

    this.boardStatusService.boardStatus$.subscribe((val: BoardStatus) => {
      if (val) {
        this.boardStatus = val;
      }
    });

    const obj = this.brainstormService.getUserRole(this.participantCode, this.item, this.boardStatus);
    this.userRole = obj.userRole;

    this.calculateTimeStamp();
    setInterval(() => {
      this.calculateTimeStamp();
    }, 60000);

    if (this.item.idea_video) {
      this.videoAvailable = true;
      this.oldVideo = this.item.idea_video.id;
    }

    this.brainstormEventService.ideaCommentEvent$.subscribe((v: BrainstormSubmitIdeaCommentResponse) => {
      // Add the comment to the card
      this.addComment();
    });

    if (this.board.post_size) {
      this.postSize = this.board.post_size;
      this.hostAvatarSize = this.postSize === 'small' ? 'small' : 'medium';
    }
    this.brainstormService.selectedBoard$.pipe(untilDestroyed(this)).subscribe((board: Board) => {
      if (board) {
        this.showUserName = board.board_activity?.show_participant_name_flag;
      }
    });
  }

  ngOnDestroy() {
    if (this.queryParamSubscription) {
      this.queryParamSubscription.unsubscribe();
    }
  }

  ngAfterViewInit() {}

  areCommentsAllowed() {
    return this.board.allow_comment;
  }

  areHeartsAllowed() {
    return this.board.allow_heart;
  }

  ngOnChanges(changes) {
    if (this.eventType === EventTypes.brainstormEditIdeaSubmitEvent) {
      if (this.item.idea_video && this.videoAvailable) {
        if (this.oldVideo !== this.item.idea_video.id) {
          // video was already available and probably changed
          this.videoAvailable = false;
          this.oldVideo = this.item.idea_video.id;
          setTimeout(() => {
            this.videoAvailable = true;
          }, 5);
        }
      } else if (this.item.idea_video && !this.videoAvailable) {
        // video did not exist and probably added now
        this.videoAvailable = true;
      }
    } else if (this.eventType === EventTypes.brainstormBoardPostSizeEvent) {
      this.postSize = this.board.post_size;
      this.hostAvatarSize = this.postSize === 'small' ? 'small' : 'medium';
    } else if (
      this.activityState.eventType !== EventTypes.brainstormSubmitIdeaCommentEvent &&
      this.activityState.eventType !== EventTypes.notificationEvent
    ) {
      this.localActivityState = this.activityState;
    }
  }

  addComment() {
    if (this.ideaDetailedDialogRef) {
      this.ideaDetailedDialogRef.componentInstance.brainstormSubmitIdeaCommentEvent();
    }
    if (this.userSubmittedComment) {
      let existingComment = '';
      if (this.ideaDetailedDialogRef) {
        existingComment = this.brainstormService.getDraftComment(this.commentKey);
        existingComment = existingComment.trim();
      } else {
        existingComment = this.commentModel;
        existingComment = existingComment.trim();
      }
      this.item.comments.forEach((c) => {
        existingComment = existingComment.trim();
        if (
          c.comment === existingComment &&
          (c.participant === this.participantCode || !this.participantCode) &&
          !this.userSubmittedSuccesfully
        ) {
          // there is a comment by this participant in the comments that is identical to commentModal
          // safe to assume the comment is submitted
          this.userSubmittedSuccesfully = true;
          this.userSubmittedComment = false;
          this.removeDraftComment();

          if (this.ideaDetailedDialogRef) {
            this.ideaDetailedDialogRef.componentInstance.ideaCommentSuccessfullySubmitted();
          }
        }
      });
    }
  }

  delete(id) {
    this.matDialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: 'Are you sure you want to delete this idea?',
          actionButton: 'Delete',
        },
        disableClose: true,
        panelClass: 'confirmation-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.deleteIdea.emit(id);
        }
      });
  }

  unpin(id) {
    this.ngxPermissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.sendMessage.emit(new BrainstormRemoveIdeaPinEvent(id));
      }
    });
  }

  isAbsolutePath(imageUrl: string) {
    if (imageUrl && imageUrl.includes('https:')) {
      return true;
    } else {
      return false;
    }
  }

  isUploadCare(imageUrl: string) {
    if (imageUrl && imageUrl.includes('ucarecdn')) {
      return true;
    }
    return false;
  }

  openImage(imageUrl: string) {
    this.viewImage.emit(imageUrl);
  }

  getPersonName(idea: Idea) {
    if (idea) {
      if (idea.submitting_participant) {
        return this.getParticipantName(idea.submitting_participant.participant_code);
      } else {
        return this.getParticipantName(null);
      }
    }
  }

  getParticipantName(code: number) {
    return this.activitiesService.getParticipantName(this.localActivityState, code);
  }

  submitComment(ideaId, val) {
    this.userSubmittedComment = true;
    this.userSubmittedSuccesfully = false;
    this.commentModel = val;
    this.sendMessage.emit(new BrainstormSubmitIdeaCommentEvent(val, ideaId));
  }

  removeDraftComment() {
    this.commentModel = '';
    this.brainstormService.removeDraftComment(this.commentKey);
  }

  onCommentFocus() {
    this.classGrey = true;
  }
  onCommentBlur() {
    this.classGrey = false;
  }

  commentTyped() {
    this.viewChanged.emit();
    this.brainstormService.saveDraftComment(this.commentKey, this.commentModel);
  }

  removeComment(commentId, ideaId) {
    this.sendMessage.emit(new BrainstormRemoveIdeaCommentEvent(commentId, ideaId));
  }

  canDeleteComment(participantCode) {
    if (this.participantCode && this.participantCode === participantCode) {
      return true;
    }
    return false;
  }

  hasParticipantHearted(item: Idea) {
    let hearted = false;
    item.hearts.forEach((element) => {
      if (element.participant === this.participantCode) {
        hearted = true;
        this.deactivateHearting = false;
      }
      // If a trainer hearts an idea the heart object does not have
      // a participant code.
      if (element.participant === null && !this.participantCode) {
        hearted = true;
        this.deactivateHearting = false;
      }
    });
    return hearted;
  }

  removeHeart(item, event) {
    if (!this.board.allow_heart) {
      return;
    }
    let hearted;
    item.hearts.forEach((element) => {
      if (element.participant === this.participantCode) {
        hearted = element;
      }
      // If a trainer hearts an idea the heart object does not have
      // a participant code.
      if (element.participant === null && !this.participantCode) {
        hearted = element;
      }
    });
    if (hearted) {
      this.sendMessage.emit(new BrainstormRemoveIdeaHeartEvent(item.id, hearted.id));
    }
    this.imgSrc = '/assets/img/cards/like.svg';
  }

  setHeart(idea: Idea) {
    if (this.board.allow_heart) {
      if (!this.deactivateHearting) {
        this.deactivateHearting = true;
        this.sendMessage.emit(new BrainstormSubmitIdeaHeartEvent(idea.id));
      }
    }
  }

  mouseDownEvent(event) {
    this.startX = event.pageX;
    this.startY = event.pageY;
  }

  mouseUpEvent(event, idea: Idea) {
    const diffX = Math.abs(event.pageX - this.startX);
    const diffY = Math.abs(event.pageY - this.startY);

    if (diffX < this.delta && diffY < this.delta) {
      // Click!
      // as the query parameters are changed the
      // post will open up by subscription
      this.ideaChangingQueryParams(this.item.id);
    }
  }

  checkIfIdeaDragged(): boolean {
    return false;
  }

  showDetailedIdea(idea: Idea) {
    if (this.deviceService.isMobile()) {
      this.openDialog(idea, 'idea-detailed-mobile-dialog', false);
    } else {
      this.openDialog(idea, 'idea-detailed-dialog', true);
    }
    // this.openDialog(idea, 'idea-detailed-mobile-dialog', false);
    // this.openDialog(idea, 'idea-detailed-dialog', true);

    if (this.item.idea_video) {
      this.player.nativeElement.pause();
    }
  }

  public ideaChangingQueryParams(ideaId: number) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { post: ideaId },
      queryParamsHandling: 'merge',
    });
  }

  removePostQueryParam() {
    // Remove query params
    this.router.navigate([], {
      queryParams: {
        post: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  openDialog(idea: Idea, assignedClass, isDesktop) {
    const dialogRef = this.dialog.open(IdeaDetailedDialogComponent, {
      disableClose: true,
      hasBackdrop: isDesktop,
      panelClass: assignedClass,
      data: {
        showCategoriesDropdown: this.isColumnsLayout,
        categories: this.board.brainstormcategory_set,
        item: this.item,
        category: this.category,
        myGroup: this.myGroup,
        activityState: this.activityState,
        participantCode: this.participantCode,
        userRole: this.userRole,
        showUserName: this.showUserName,
        boardStatus: this.boardStatus,
        board: this.board,
      } as IdeaDetailedInfo,
    });

    const sub = dialogRef.componentInstance.sendMessage.subscribe((event) => {
      this.sendMessage.emit(event);
    });

    dialogRef.componentInstance.deleteIdea.subscribe((event) => {
      this.deleteIdea.emit(event);
      dialogRef.close();
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.brainstormService.saveIdea$.next(result);
      }
      this.ideaDetailedDialogRef = null;
      this.removePostQueryParam();
      this.ideaDetailedDialogClosed.emit();
    });

    // detect screen size changes
    this.breakpointObserver.observe(['(max-width: 848px)']).subscribe((result: BreakpointState) => {
      if (result.matches) {
        dialogRef.addPanelClass('idea-detailed-mobile-dialog');
        dialogRef.removePanelClass('idea-detailed-dialog');
      } else {
        dialogRef.addPanelClass('idea-detailed-dialog');
        dialogRef.removePanelClass('idea-detailed-mobile-dialog');
      }
    });

    this.ideaDetailedDialogRef = dialogRef;
    this.ideaDetailedDialogOpened.emit();
  }

  videoLoaded() {
    this.viewChanged.emit();
  }

  typeOfImage(item: Idea) {
    if (item && item.idea_image) {
      if (item.idea_image.document) {
        if (item.idea_image.document.includes('giphy.com')) {
          return 'giphy';
        } else if (item.idea_image.document.includes('unsplash')) {
          return 'unsplash';
        } else if (
          !item.idea_image.document.includes('https:') &&
          item.idea_image.document_type === 'document'
        ) {
          return 'uploaded';
        }
      }
    }
  }

  getPdfSrc() {
    const ideaDocument = this.item.idea_document;
    if (ideaDocument.document_url_converted) {
      return ideaDocument.document_url_converted;
    } else {
      return ideaDocument.document_url;
    }
  }

  canUserDrag() {
    if (this.userRole === 'owner' && this.isColumnsLayout) {
      return true;
    }
    return false;
    // !isColumnsLayout && (userRole !== 'owner')
  }

  calculateTimeStamp(): void {
    if (!this.item) {
      return;
    }
    this.timeStamp = this.utilsService.calculateTimeStamp(this.item.time);
  }
}
