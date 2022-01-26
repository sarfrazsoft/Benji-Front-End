import {
  animate,
  state,
  style,
  transition,
  trigger,
  // ...
} from '@angular/animations';
import { Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ContextService } from 'src/app/services';
import { ActivitiesService } from 'src/app/services/activities';
import {
  BrainstormSubmitIdeaCommentEvent,
  Category,
  Group,
  Idea,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation/confirmation.dialog';
import { ImagePickerDialogComponent } from '../../dialogs/image-picker-dialog/image-picker.dialog';
export interface IdeaDetailedInfo {
  showCategoriesDropdown: boolean;
  categories: Array<Category>;
  item: Idea;
  category: Category;
  myGroup: Group;
  activityState: UpdateMessage;
  isMobile: boolean;
  participantCode: number;
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
        })
      ),
      state(
        'disabled',
        style({
          opacity: 0,
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
          height: '0px',
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
  @Input() data: IdeaDetailedInfo;
  @Output() sendMessage = new EventEmitter<any>();
  @Output() deleteIdea = new EventEmitter<any>();
  @Output() submit = new EventEmitter<any>();
  @Output() closeView = new EventEmitter<any>();

  @Output() previousItemRequested = new EventEmitter<any>();
  @Output() nextItemRequested = new EventEmitter<any>();

  constructor(
    private activitiesService: ActivitiesService,
    private matDialog: MatDialog,
    private deleteDialog: MatDialog,
    private contextService: ContextService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.initIdea();
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
    if (this.data.item.idea_image) {
      this.imageSelected = true;
      this.imageSrc = this.data.item.idea_image.img;
    }
    if (this.data.participantCode) {
      this.participantCode = this.data.participantCode;
      this.userRole = 'viewer';
    } else {
      // viewing user is the host
      this.userRole = 'owner';
    }

    if (this.data.item.submitting_participant && this.userRole !== 'owner') {
      this.submitting_participant = this.data.item.submitting_participant.participant_code;
      if (this.submitting_participant === this.participantCode) {
        this.userRole = 'owner';
      } else {
        this.userRole = 'viewer';
      }
    }
    if (this.data.item.idea_document) {
      this.pdfSelected = true;
      this.pdfSrc = this.hostname + this.data.item.idea_document.document;
    }
    if (this.data.category) {
      this.selectedCategory = this.data.category;
    }
    if (this.data.myGroup) {
      this.group = this.data.myGroup;
    }
    this.activityState = this.data.activityState;
  }

  onSubmit() {
    this.submit.emit({
      ...this.idea,
      text: this.userIdeaText,
      title: this.ideaTitle,
      category: this.selectedCategory,
      imagesList: this.imagesList,
      selectedImageUrl: this.selectedImageUrl,
      selectedThirdPartyImageUrl: this.selectedThirdPartyImageUrl,
    });
  }

  closeDialog() {
    // this.dialogRef.close();
    this.closeView.emit();
  }

  remove() {
    if (this.pdfSelected) {
      this.clearPDF();
    } else {
      this.removeImage();
    }
    this.uploadPanelExpanded = true;
  }

  removeImage() {
    this.imageSelected = false;
    this.imagesList = null;
    this.imageSrc = null;
    this.selectedImageUrl = null;
    this.selectedThirdPartyImageUrl = null;
    this.idea.idea_image = null;
  }

  clearPDF() {
    this.selectedpdfDoc = null;
    this.pdfSelected = false;
    this.pdfSrc = null;
  }

  openImagePickerDialog() {
    const code = this.lessonRunCode;
    this.imageDialogRef = this.matDialog
      .open(ImagePickerDialogComponent, {
        data: {
          lessonRunCode: code,
        },
        disableClose: false,
        panelClass: ['dashboard-dialog', 'image-picker-dialog'],
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (res.type === 'upload') {
            this.imageSelected = true;
            this.imagesList = res.data;
            const fileList: FileList = res.data;
            const file = fileList[0];
            const reader = new FileReader();
            reader.onload = (e) => (this.imageSrc = reader.result);
            reader.readAsDataURL(file);
          } else if (res.type === 'unsplash') {
            this.selectedImageUrl = res.data;
            this.imageSrc = res.data;
            this.imageSelected = true;
            this.selectedThirdPartyImageUrl = res.data;
          } else if (res.type === 'giphy') {
            this.selectedThirdPartyImageUrl = res.data;
            this.imageSrc = res.data;
            this.selectedImageUrl = res.data;
            this.imageSelected = true;
          }
        }
      });
  }

  isAbsolutePath(imageUrl: string) {
    if (imageUrl.includes('https:')) {
      return true;
    } else {
      return false;
    }
  }

  getParticipantName(code: number) {
    return this.activitiesService.getParticipantName(this.activityState, code);
  }

  submitComment(ideaId, val) {
    this.sendMessage.emit(new BrainstormSubmitIdeaCommentEvent(val, ideaId));
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

  delete() {
    this.deleteDialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationMessage: 'Are you sure you want to delete this idea?',
          actionButton: 'Delete',
        },
        disableClose: true,
        panelClass: 'idea-delte-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) { this.deleteIdea.emit(this.idea.id); }
      });
  }

  toggle() {
    this.uploadPanelExpanded = !this.uploadPanelExpanded;
  }

  previousArrowClicked() {
    this.previousItemRequested.emit();
  }

  nextArrowClicked() {
    this.nextItemRequested.emit();
  }

  participantIsOwner() {}
}
