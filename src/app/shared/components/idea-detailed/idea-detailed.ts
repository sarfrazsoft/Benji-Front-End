import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { NgxPermissionsService } from 'ngx-permissions';
import { ContextService } from 'src/app/services';
import { ActivitiesService, BrainstormService } from 'src/app/services/activities';
import { getItemFromList } from 'src/app/services/activities/item-list-functions/get-item-from-list/get-item-from-list';
import {
  Board,
  BoardStatus,
  BrainstormAddIdeaPinEvent,
  BrainstormRemoveIdeaPinEvent,
  BrainstormSetCategoryEvent,
  BrainstormSubmitIdeaCommentEvent,
  Category,
  Group,
  Idea,
  IdeaDocument,
  PostSize,
  RemoveIdeaDocumentEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation/confirmation.dialog';
import { GiphyPickerDialogComponent } from '../../dialogs/giphy-picker-dialog/giphy-picker.dialog';
import {
  DialogResult,
  ImagePickerDialogComponent,
} from '../../dialogs/image-picker-dialog/image-picker.dialog';
import { FileProgress } from '../uploadcare-widget/uploadcare-widget.component';

export interface IdeaDetailedInfo {
  showCategoriesDropdown: boolean;
  categories: Array<Category>;
  item: Idea;
  category: Category;
  myGroup: Group;
  activityState: UpdateMessage;
  participantCode: number;
  userRole: IdeaUserRole;
  showUserName: boolean;
  boardStatus: BoardStatus;
  board: Board;
}
export type IdeaUserRole = 'owner' | 'viewer';
@Component({
  selector: 'benji-idea-detailed',
  templateUrl: 'idea-detailed.html',
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
    trigger('openClose', [
      state(
        'open',
        style({
          width: '512px',
        })
      ),
      state(
        'closed',
        style({
          width: '0px',
        })
      ),
      transition('* => closed', [animate('0.5s 0ms ease-in-out')]),
      transition('* => open', [animate('0.5s 0ms ease-in-out')]),
    ]),
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [style({ transform: 'translateX(100%)' }), animate('0.5s 0ms ease-in-out')]),
      transition('* => void', [animate('0.5s 0ms ease-in-out', style({ transform: 'translateX(100%)' }))]),
    ]),
    trigger('openupClosedown', [
      state(
        'openUp',
        style({
          height: '300px',
        })
      ),
      state(
        'closeDown',
        style({
          // height: '0px',
        })
      ),
      transition('* => closeDown', [animate('0.5s 0ms ease-in-out')]),
      transition('* => openUp', [animate('0.5s 0ms ease-in-out')]),
    ]),
    trigger('flyUpDown', [
      state('up', style({ transform: 'translateY(0)' })),
      transition('void => *', [style({ transform: 'translateY(100%)' }), animate('0.5s 0ms ease-in-out')]),
      transition('* => void', [animate('0.5s 0ms ease-in-out', style({ transform: 'translateY(100%)' }))]),
    ]),
  ],
  host: {
    '(document:keydown)': 'handleKeyboardEvent($event)',
  },
})
export class IdeaDetailedComponent implements OnInit, OnChanges {
  showCategoriesDropdown = false;
  categories: Array<Category> = [];
  idea: Idea;
  selectedCategory: Category;
  group: Group;
  activityState: UpdateMessage;
  userIdeaText = '';
  ideaTitle;
  lessonRunCode;
  imageSelected = false;
  uploadPanelExpanded: boolean;
  participantCode = null;
  submitting_participant = null;
  boardStatus: BoardStatus;

  imagesList: FileList;
  imageSrc;
  imageDialogRef;
  selectedImageUrl;
  selectedThirdPartyImageUrl;
  pdfSelected;
  selectedpdfDoc;
  pdfSrc;
  hostname = environment.web_protocol + '://' + environment.host;
  userRole: IdeaUserRole;
  commentModel = '';

  // video variables
  videoURL: string;
  videoURLConverted: string;
  video = false;
  video_id: number;
  videoCleared = false;

  webcamImageId: number;
  webcamImage = false;
  webcamImageURL: string;
  webcamImageCleared = false;

  iframeAvailable = false;
  iframeData: any;
  meta: any;
  iframeRemoved = false;

  showInline = false;

  showModal = false;

  dashboardProps = {
    plugins: ['Webcam', 'GoogleDrive'],
  };

  dashboardModalProps = {
    target: document.body,
    onRequestCloseModal: (): void => {
      this.showModal = false;
    },
  };

  @Input() data: IdeaDetailedInfo;
  @Output() sendMessage = new EventEmitter<any>();
  @Output() deleteIdea = new EventEmitter<any>();
  @Output() submit = new EventEmitter<any>();
  @Output() closeView = new EventEmitter<any>();
  @Output() disableArrows = new EventEmitter<boolean>();
  @Output() ideaEditEvent = new EventEmitter<boolean>();
  @Output() previousItemRequested = new EventEmitter<any>();
  @Output() nextItemRequested = new EventEmitter<any>();

  addCommentFocused: boolean;
  titleFocused: boolean;
  tiptapFocus: boolean;
  commentKey: string;
  fileProgress: FileProgress;
  mediaUploading = false;
  isHost = false;
  color = '';
  hoverColor = '';

  pdfCleared = false;
  emptyUserIdeaText: boolean;

  // postSize: PostSize;
  // hostAvatarSize: string;

  userSubmittedComment = false;
  userSubmittedSuccesfully = false;
  @ViewChild('scrollableArea', { static: false }) scrollableArea: ElementRef;

  constructor(
    private activitiesService: ActivitiesService,
    private matDialog: MatDialog,
    private httpClient: HttpClient,
    private deleteDialog: MatDialog,
    private brainstormService: BrainstormService,
    private ngxPermissionsService: NgxPermissionsService
  ) {}

  ngOnInit(): void {
    this.ngxPermissionsService.hasPermission('ADMIN').then((val) => {
      if (val) {
        this.isHost = true;
      }
    });

    this.ngxPermissionsService.hasPermission('PARTICIPANT').then((val) => {
      if (val) {
        this.isHost = false;
      }
    });

    if (!this.userIdeaText || this.userIdeaText?.length < 7) {
      this.emptyUserIdeaText = true;
    } else {
      this.emptyUserIdeaText = false;
    }
  }

  ngOnChanges() {
    this.initIdea();
  }

  isUserRoleOwner(): boolean {
    return this.userRole === 'owner';
  }

  handleKeyboardEvent(event: KeyboardEvent) {
    const el = document.getElementsByClassName('scrollable-area')[0];
    // if the user is owner and editables items have focus then return
    // if the user is not owner then don't return in any case
    if (this.isUserRoleOwner() && el.contains(document.activeElement)) {
      // if focus is on any of the editable areas
      console.log('returned');
      return;
    }
    if ((!this.addCommentFocused && !this.titleFocused) || !this.isUserRoleOwner()) {
      this.executeAction(event);
    }
  }
  executeAction(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.nextArrowClicked();
    }
    if (event.key === 'ArrowLeft') {
      this.previousArrowClicked();
    }
  }

  isUploadCare(url: string) {
    if (url && url.includes('ucarecdn')) {
      return true;
    }
    return false;
  }

  initIdea() {
    this.showCategoriesDropdown = this.data.showCategoriesDropdown;
    this.categories = this.data.categories.filter((val) => !val.removed);
    this.idea = this.data.item;
    if (this.categories.length) {
      this.selectedCategory = this.categories[0];
    }
    this.ideaTitle = this.data.item.title;
    this.userIdeaText = this.data.item.idea;
    this.boardStatus = this.data.boardStatus;

    // initialize idea image
    if (this.data.item.idea_image) {
      this.imageSelected = true;
      if (this.data.item.idea_image.document) {
        this.imageSrc = this.data.item.idea_image.document;
        if (!this.imageSrc.startsWith('/media') && !this.imageSrc.startsWith('https')) {
          this.imageSrc = '/media' + this.imageSrc;
        }
      } else if (this.data.item.idea_image.document_url) {
        this.imageSrc = this.data.item.idea_image.document_url;
      }
    } else {
      this.removeImage();
    }

    // check if idea has document and reset if
    // document isn't present
    if (this.data.item.idea_document) {
      this.clearPDF();
      const ideaDocument = this.data.item.idea_document;
      if (ideaDocument.document_url_converted) {
        this.pdfSrc = this.data.item.idea_document.document_url_converted;
      } else {
        this.pdfSrc = this.data.item.idea_document.document_url;
      }
      this.pdfSelected = true;
    } else {
      this.clearPDF();
    }

    // check if idea has video and reset if not
    if (this.data.item.idea_video) {
      this.video = true;
      if (this.data.item.idea_video.document) {
        this.videoURL = this.data.item.idea_video.document;
      } else if (this.data.item.idea_video.document_url) {
        // upload care videos come here
        this.videoURLConverted = this.data.item.idea_video.document_url_converted;
        this.videoURL = this.data.item.idea_video.document_url;
      }
    } else {
      this.removeVideo();
    }

    // check if idea has and iframe and attach it
    this.meta = cloneDeep(this.data.item.meta);
    if (this.meta && this.meta.iframe) {
      if (this.meta.iframe && this.meta.iframe.iframeHTML) {
        this.iframeAvailable = true;
        this.iframeData = this.meta.iframe;
      }
    } else {
      this.removeIframe();
    }

    this.userRole = this.data.userRole;

    if (this.data.participantCode) {
      this.participantCode = this.data.participantCode;
    } else {
      // viewing user is the host
      this.commentKey = 'comment_' + this.data.item.id + 'host';
    }
    if (this.data.item.submitting_participant) {
      this.submitting_participant = this.data.item.submitting_participant.participant_code;
      this.commentKey = 'comment_' + this.data.item.id + this.submitting_participant;
    }

    const draftComment = this.brainstormService.getDraftComment(this.commentKey);
    if (draftComment) {
      this.commentModel = draftComment;
    }

    if (this.data.category) {
      this.selectedCategory = this.data.category;
    }
    if (this.data.myGroup) {
      this.group = this.data.myGroup;
    }
    this.activityState = this.data.activityState;

    this.lessonRunCode = this.activityState?.lesson_run?.lessonrun_code;

    // if (this.data?.board?.post_size) {
    //   this.postSize = this.data.board.post_size;
    //   this.hostAvatarSize = this.postSize === 'small' ? 'small' : 'medium';
    // }
  }

  ideaIsEdited(event) {
    if (event) {
      this.ideaEditEvent.emit(true);
    }
    // check if user entered a link in the titlebox
    this.checkIfLink(event);
  }

  removeIdeaDocumentFromBE() {
    this.sendMessage.emit(new RemoveIdeaDocumentEvent(this.idea.id));
  }

  onSubmit() {
    if (this.pdfCleared || this.webcamImageCleared || this.videoCleared) {
      this.removeIdeaDocumentFromBE();
    }
    this.submit.emit({
      ...this.idea,
      text: this.userIdeaText,
      title: this.ideaTitle,
      category: this.selectedCategory,
      imagesList: this.imagesList,
      selectedImageUrl: this.selectedImageUrl,
      selectedThirdPartyImageUrl: this.selectedThirdPartyImageUrl,
      video_id: this.video_id,
      webcamImageId: this.webcamImageId,
      selectedpdfDoc: this.selectedpdfDoc,
      meta: this.meta,
    });
  }

  closeDialog() {
    this.closeView.emit();
  }

  remove() {
    if (this.pdfSelected) {
      this.clearPDF();

      this.pdfCleared = true;
    } else if (this.video) {
      this.removeVideo();
      this.videoCleared = true;
    } else if (this.iframeAvailable) {
      this.removeIframe();
    } else {
      this.removeImage();
      this.webcamImageCleared = true;
    }
    this.uploadPanelExpanded = true;
    this.ideaEditEvent.emit(true);
  }

  removeImage() {
    this.imageSelected = false;
    this.imagesList = null;
    this.imageSrc = null;
    this.selectedImageUrl = null;
    this.selectedThirdPartyImageUrl = null;
    // this.idea.idea_image = null;
    this.removeWebcamImage();
  }

  clearPDF() {
    this.selectedpdfDoc = null;
    this.pdfSelected = false;
    this.pdfSrc = null;
  }

  removeVideo() {
    this.video = false;
    this.videoURL = null;
    this.videoURLConverted = null;
    this.video_id = null;
  }

  removeWebcamImage() {
    this.webcamImage = false;
    this.webcamImageId = null;
    this.webcamImageURL = null;
  }

  removeIframe() {
    this.iframeAvailable = false;
    this.iframeData = null;
    this.meta.iframe = null;

    this.iframeRemoved = true;
  }

  openImagePickerDialog() {
    this.imageDialogRef = this.matDialog
      .open(ImagePickerDialogComponent, {
        disableClose: false,
        panelClass: ['dashboard-dialog', 'image-picker-dialog'],
      })
      .afterClosed()
      .subscribe((res: DialogResult) => {
        if (res) {
          this.uploadPanelExpanded = false;
          this.clearPDF();
          this.removeImage();
          if (res.type === 'upload') {
            this.imageSelected = true;
            this.ideaEditEvent.emit(true);
            this.imagesList = res.data;
            const fileList: FileList = res.data;
            const file = fileList[0];
            const reader = new FileReader();
            reader.onload = (e) => {
              this.imageSrc = reader.result;
            };
            reader.readAsDataURL(file);
          } else if (res.type === 'unsplash') {
            console.log(res.data);
            this.selectedImageUrl = res.data;
            this.imageSrc = res.data;
            this.imageSelected = true;
            this.ideaEditEvent.emit(true);
            this.selectedThirdPartyImageUrl = res.data;
          }
        }
      });
  }

  openGiphyPickerDialog() {
    const code = this.lessonRunCode;
    this.imageDialogRef = this.matDialog
      .open(GiphyPickerDialogComponent, {
        data: {
          lessonRunCode: code,
        },
        disableClose: false,
        panelClass: ['dashboard-dialog', 'giphy-picker-dialog'],
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.clearPDF();
          this.removeImage();
          if (res.type === 'giphy') {
            this.selectedImageUrl = res.data;
            this.selectedThirdPartyImageUrl = res.data;
            this.imageSrc = res.data;
            this.imageSelected = true;
            this.ideaEditEvent.emit(true);
          }
        }
      });
  }

  isAbsolutePathOrNewlySelectedImage(imageUrl: string) {
    if (imageUrl.includes('https:')) {
      return true;
    } else if (imageUrl.includes('data:image')) {
      return true;
    } else {
      return false;
    }
  }

  getParticipantName(code: number) {
    return this.activitiesService.getParticipantName(this.activityState, code);
  }

  submitComment(ideaId, val) {
    this.userSubmittedComment = true;
    this.userSubmittedSuccesfully = false;
    this.sendMessage.emit(new BrainstormSubmitIdeaCommentEvent(val, ideaId));
  }

  clearDraftComment(): void {
    this.commentModel = '';
    this.brainstormService.removeDraftComment(this.commentKey);
  }

  onCommentFocus() {
    this.addCommentFocused = true;
  }
  onCommentBlur() {
    this.addCommentFocused = false;
  }
  commentTyped() {
    this.brainstormService.saveDraftComment(this.commentKey, this.commentModel);
  }

  ideaCommentSuccessfullySubmitted(): void {
    this.userSubmittedSuccesfully = true;
    this.userSubmittedComment = false;
    this.clearDraftComment();
  }
  brainstormSubmitIdeaCommentEvent(): void {
    if (this.userSubmittedComment) {
      this.scrollIntoView();
      const existingComment = this.commentModel.trim();
      this.idea.comments.forEach((c) => {
        if (
          c.comment === existingComment &&
          (c.participant === this.participantCode || !this.participantCode) &&
          !this.userSubmittedSuccesfully
        ) {
          // there is a comment by this participant in the comments that is identical to commentModal
          // safe to assume the comment is submitted
          this.userSubmittedSuccesfully = true;
          this.userSubmittedComment = false;
          this.clearDraftComment();
        }
      });
    }
  }

  scrollIntoView(): void {
    setTimeout(() => {
      this.scrollableArea.nativeElement.scrollTop = this.scrollableArea.nativeElement.scrollHeight + 56;
    }, 200);
  }

  getInitials(nameString: string) {
    const fullName = nameString.split(' ');
    const first = fullName[0] ? fullName[0].charAt(0) : '';
    if (fullName.length === 1) {
      return first.toUpperCase();
    }
    const second = fullName[fullName.length - 1] ? fullName[fullName.length - 1].charAt(0) : '';
    return (first + second).toUpperCase();
  }

  pin() {
    this.sendMessage.emit(new BrainstormAddIdeaPinEvent(this.idea.id));
  }

  unpin() {
    this.sendMessage.emit(new BrainstormRemoveIdeaPinEvent(this.idea.id));
  }

  delete() {
    this.disableArrows.emit(true);
    this.deleteDialog
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
        this.disableArrows.emit(false);
        if (res) {
          this.deleteIdea.emit(this.idea.id);
        }
      });
  }

  toggle() {
    if (!this.isItemSelected()) {
      this.uploadPanelExpanded = !this.uploadPanelExpanded;
    }
  }

  previousArrowClicked() {
    this.previousItemRequested.emit();
  }

  nextArrowClicked() {
    this.nextItemRequested.emit();
  }

  mediaUploadProgress(fileProgress: FileProgress) {
    this.fileProgress = fileProgress;
    this.mediaUploading = true;
  }

  mediaUploaded(res: IdeaDocument) {
    this.mediaUploading = false;
    if (res.document_type === 'video') {
      if (res.document_url) {
        this.videoURL = res.document_url;
        this.videoURLConverted = res.document_url_converted;
      } else if (res.document) {
        this.videoURL = res.document;
      }
      this.video = true;
      this.video_id = res.id;
      if (this.videoCleared) {
        this.removeIdeaDocumentFromBE();
      }
      this.videoCleared = false;
    } else if (res.document_type === 'image') {
      if (res.document_url) {
        this.webcamImageURL = res.document_url;
      } else if (res.document) {
        this.webcamImageURL = res.document;
      }
      this.webcamImage = true;
      this.webcamImageId = res.id;

      if (this.webcamImageCleared) {
        this.removeIdeaDocumentFromBE();
      }
      this.webcamImageCleared = false;
    } else if (res.document_type === 'document') {
      this.selectedpdfDoc = res.id;
      if (res.document_url_converted) {
        this.pdfSrc = res.document_url_converted;
      } else {
        this.pdfSrc = res.document_url;
      }
      // this.pdfSrc = 'https://ucarecdn.com/7d9330de-a6be-497d-9a4c-3af802a63a2e/';
      this.webcamImage = false;
      this.video = false;
      this.pdfSelected = true;
      if (this.pdfCleared) {
        this.removeIdeaDocumentFromBE();
      }
      this.pdfCleared = false;
    }
    this.ideaEditEvent.emit(true);
  }

  focusOnEdit() {
    this.titleFocused = true;
  }
  unfocusedEdit() {
    this.titleFocused = false;
  }

  descriptionTextChanged($event: string) {
    this.userIdeaText = $event;
    this.ideaEditEvent.emit(true);
    this.checkIfLink(this.userIdeaText);
  }

  categoryChanged(category) {
    const lastIdea = getItemFromList(category.brainstormidea_set, 'last', 'previous_idea', 'next_idea');
    if (lastIdea) {
      this.sendMessage.emit(
        new BrainstormSetCategoryEvent({
          id: this.data.item.id,
          category: category.id,
          next_idea: null,
          previous_idea: lastIdea.id,
        })
      );
    }
  }

  areCommentsAllowed() {
    return this.data.board.allow_comment;
  }

  areHeartsAllowed() {
    return this.data.board.allow_heart;
  }

  changeOnHover($event) {
    this.hoverColor = $event.type === 'mouseover' ? 'primary-color' : 'white-color';
  }

  isItemSelected() {
    if (!this.imageSelected && !this.pdfSelected && !this.video && !this.webcamImage && !this.iframeData) {
      return false;
    }
    if (this.imageSelected || this.pdfSelected || this.video || this.webcamImage || this.iframeData) {
      return true;
    }
    return false;
  }

  checkIfLink(link: string) {
    if (this.isItemSelected()) {
      // Don't run if an item is already attached to the post
      return;
    }
    // link can be
    // https://something.com
    // abc https://something.com
    // https://www.canadianstage.com/
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
    const link2 = link.match(urlRegex);
    if (link2) {
      // send to iframely
      this.httpClient
        .get(`https://cdn.iframe.ly/api/iframely/?api_key=a8a6ac85153a6cb7d321bc&url=${link2[0]}`)
        .subscribe((res: any) => {
          if (res.html) {
            if (this.uploadPanelExpanded) {
              this.uploadPanelExpanded = false;
            }
            this.iframeAvailable = true;
            this.iframeRemoved = false;
            this.iframeData = { iframeHTML: res.html, url: res.url };
            this.meta = { ...this.meta, iframe: this.iframeData };
            // iframely.load();
          }
        });
    }
  }
}
