import {
  animate,
  state,
  style,
  transition,
  trigger,
  // ...
} from '@angular/animations';
import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivitiesService } from 'src/app/services/activities';
import {
  BrainstormSubmitIdeaCommentEvent,
  Category,
  Group,
  Idea,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import { ImagePickerDialogComponent } from '../../dialogs/image-picker-dialog/image-picker.dialog';

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
  ],
})
export class IdeaDetailedComponent implements OnInit {
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

  imagesList: FileList;
  imageSrc;
  imageDialogRef;
  selectedImageUrl;
  pdfSelected;
  selectedpdfDoc;
  pdfSrc;
  hostname = environment.web_protocol + '://' + environment.host;
  @Input() data: {
    showCategoriesDropdown: boolean;
    categories: Array<Category>;
    item: Idea;
    category: Category;
    myGroup: Group;
    activityState: UpdateMessage;
  };
  @Output() sendMessage = new EventEmitter<any>();
  @Output() deleteIdea = new EventEmitter<any>();
  @Output() submit = new EventEmitter<any>();
  @Output() closeView = new EventEmitter<any>();

  constructor(private activitiesService: ActivitiesService, private matDialog: MatDialog) {}

  ngOnInit(): void {
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
  }

  removeImage() {
    this.imageSelected = false;
    this.imagesList = null;
    this.imageSrc = null;
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
            this.imagesList = res.this.data;
            const fileList: FileList = res.this.data;
            const file = fileList[0];
            const reader = new FileReader();
            reader.onload = (e) => (this.imageSrc = reader.result);
            reader.readAsDataURL(file);
          } else if (res.type === 'unsplash') {
            this.selectedImageUrl = res.this.data;
            this.imageSelected = true;
          } else if (res.type === 'giphy') {
            this.selectedImageUrl = res.this.data;
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
    this.deleteIdea.emit(this.idea.id);
  }
}
