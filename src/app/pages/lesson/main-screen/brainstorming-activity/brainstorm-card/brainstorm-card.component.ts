import {
  animate,
  state,
  style,
  transition,
  trigger,
  // ...
} from '@angular/animations';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPermissionsService } from 'ngx-permissions';
import { take } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ActivitiesService, BrainstormService } from 'src/app/services/activities';
import {
  Board,
  BoardStatus,
  BrainstormActivity,
  BrainstormAddIdeaPinEvent,
  BrainstormRemoveIdeaCommentEvent,
  BrainstormRemoveIdeaHeartEvent,
  BrainstormRemoveIdeaPinEvent,
  BrainstormSubmitIdeaCommentEvent,
  BrainstormSubmitIdeaHeartEvent,
  Idea,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { BoardStatusService } from 'src/app/services/board-status.service';
import { IdeaDetailedInfo, IdeaUserRole } from 'src/app/shared/components/idea-detailed/idea-detailed';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs';
import { IdeaDetailedDialogComponent } from 'src/app/shared/dialogs/idea-detailed-dialog/idea-detailed.dialog';
import { blockQuoteRule } from 'src/app/shared/ngx-editor/plugins/input-rules';
import { environment } from 'src/environments/environment';

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
export class BrainstormCardComponent implements OnInit, OnChanges {
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
  @Input() showUserName;
  @Input() participantCode;
  @Input() eventType;
  @Input() isColumnsLayout;
  @Input() myGroup;
  @Input() avatarSize;
  @ViewChild('colName') colNameElement: ElementRef;
  @ViewChild('player') player: ElementRef;
  hostname = environment.web_protocol + '://' + environment.host;

  @Output() viewImage = new EventEmitter<string>();
  @Output() deleteIdea = new EventEmitter<Idea>();
  @Output() commentEdited = new EventEmitter<any>();

  commentModel = '';
  submittingUser;
  submitting_participant;
  userRole: IdeaUserRole;
  deactivateHearting = false;
  classGrey: boolean;
  classWhite: boolean;
  commentKey: string;
  imgSrc = '/assets/img/cards/like.svg';
  isAdmin: boolean;
  boardStatus: BoardStatus;
  mobileSize = false;
  timeStamp: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private matDialog: MatDialog,
    private activitiesService: ActivitiesService,
    private brainstormService: BrainstormService,
    private deviceService: DeviceDetectorService,
    private _ngZone: NgZone,
    private ngxPermissionsService: NgxPermissionsService,
    private boardStatusService: BoardStatusService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    if (this.item && this.item.submitting_participant) {
      this.submittingUser = this.item.submitting_participant.participant_code;
      this.commentKey = 'comment_' + this.item.id + this.submittingUser;
    }

    if (this.participantCode) {
      this.userRole = 'viewer';
    } else {
      // viewing user is the host
      this.userRole = 'owner';
      this.commentKey = 'comment_' + this.item.id + 'host';
    }

    if (this.item && this.item.submitting_participant && this.userRole !== 'owner') {
      this.submittingUser = this.item.submitting_participant.participant_code;
      if (this.submittingUser === this.participantCode && this.boardStatus === 'open') {
        this.userRole = 'owner';
      } else {
        this.userRole = 'viewer';
      }
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

    this.calculateTimeStamp();
    setInterval(() => {
      this.calculateTimeStamp();
    }, 60000);
  }

  checkBoardStatus() {
    if (this.boardStatus === 'open') {
      return true;
    } else {
      return false;
    }
  }

  ngOnChanges() {}

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
    return this.activitiesService.getParticipantName(this.activityState, code);
  }

  submitComment(ideaId, val) {
    this.sendMessage.emit(new BrainstormSubmitIdeaCommentEvent(val, ideaId));
    this.brainstormService.removeDraftComment(this.commentKey);
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
    if (this.boardStatus === 'open' || this.isAdmin) {
      if (!this.deactivateHearting) {
        this.deactivateHearting = true;
        this.sendMessage.emit(new BrainstormSubmitIdeaHeartEvent(idea.id));
      }
    }
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
    this.ideaChangingQueryParams(this.item.id);
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
      this.removePostQueryParam();
    });

    // detect screen size changes
    this.breakpointObserver.observe(['(max-width: 768px)']).subscribe((result: BreakpointState) => {
      if (result.matches) {
        dialogRef.addPanelClass('idea-detailed-mobile-dialog');
        dialogRef.removePanelClass('idea-detailed-dialog');
      } else {
        dialogRef.addPanelClass('idea-detailed-dialog');
        dialogRef.removePanelClass('idea-detailed-mobile-dialog');
      }
    });
  }

  onCommentFocus() {
    this.classGrey = true;
  }
  onCommentBlur() {
    this.classGrey = false;
  }

  commentTyped() {
    this.commentEdited.emit();
    this.brainstormService.saveDraftComment(this.commentKey, this.commentModel);
  }

  videoLoaded() {
    this.commentEdited.emit();
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

  calculateTimeStamp() {
    // Test string
    this.timeStamp = moment('Thu May 09 2022 17:32:03 GMT+0500').fromNow().toString();
    // this.timeStamp = moment(this.item.time).fromNow().toString();
    if (this.timeStamp === 'a few seconds ago' || this.timeStamp === 'in a few seconds') {
      this.timeStamp = '1m ago';
    } else if (this.timeStamp.includes('an hour ago')) {
      this.timeStamp = '1hr ago';
    } else if (this.timeStamp.includes('a minute ago')) {
      this.timeStamp = '1m ago';
    } else if (this.timeStamp.includes('minutes')) {
      this.timeStamp = this.timeStamp.replace(/\sminutes/, 'm');
    } else if (this.timeStamp.includes('hours')) {
      this.timeStamp = this.timeStamp.replace(/\shours/, 'hr');
    } else if (this.timeStamp.includes('days')) {
      this.timeStamp = this.timeStamp.replace(/\sdays/, 'd');
    } else if (this.timeStamp.includes('a month')) {
      this.timeStamp = this.timeStamp.replace(/a month/, '1mo');
    } else if (this.timeStamp.includes('months')) {
      this.timeStamp = this.timeStamp.replace(/\smonths/, 'mo');
    } else if (this.timeStamp.includes('a year')) {
      this.timeStamp = this.timeStamp.replace(/a year/, '1yr');
    } else if (this.timeStamp.includes('years')) {
      this.timeStamp = this.timeStamp.replace(/\syears/, 'yr');
    }
  }
}
