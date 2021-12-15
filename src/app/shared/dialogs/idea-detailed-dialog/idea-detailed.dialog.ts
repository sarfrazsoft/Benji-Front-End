import {
  animate,
  state,
  style,
  transition,
  trigger,
  // ...
} from '@angular/animations';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivitiesService } from 'src/app/services/activities';
import {
  BrainstormSubmitIdeaCommentEvent,
  Category,
  Group,
  Idea,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import { ImagePickerDialogComponent } from '../image-picker-dialog/image-picker.dialog';

@Component({
  selector: 'benji-idea-detailed-dialog',
  templateUrl: 'idea-detailed.dialog.html',
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
export class IdeaDetailedDialogComponent {
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
  docSelected;
  hostname = environment.web_protocol + '://' + environment.host;
  @Output() sendMessage = new EventEmitter<any>();
  constructor(
    private dialogRef: MatDialogRef<IdeaDetailedDialogComponent>,
    private activitiesService: ActivitiesService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      showCategoriesDropdown: boolean;
      categories: Array<Category>;
      item: Idea;
      category: Category;
      myGroup: Group;
      activityState: UpdateMessage;
    },
    private matDialog: MatDialog
  ) {
    this.showCategoriesDropdown = data.showCategoriesDropdown;
    this.categories = data.categories.filter((val) => !val.removed);
    this.idea = data.item;
    if (this.categories.length) {
      this.selectedCategory = this.categories[0];
    }
    this.ideaTitle = data.item.title;
    this.userIdeaText = data.item.idea;
    if (data.item.idea_image) {
      this.imageSelected = true;
      this.imageSrc = data.item.idea_image.img;
    }
    if (data.item.idea_document) {
      this.docSelected = true;
    }
    if (data.category) {
      this.selectedCategory = data.category;
    }
    if (data.myGroup) {
      this.group = data.myGroup;
    }
    this.activityState = data.activityState;
  }

  onSubmit() {
    this.dialogRef.close({
      ...this.idea,
      text: this.userIdeaText,
      title: this.ideaTitle,
      category: this.selectedCategory,
      imagesList: this.imagesList,
      selectedImageUrl: this.selectedImageUrl,
    });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  removeImage() {
    this.imageSelected = false;
    this.imagesList = null;
    this.imageSrc = null;
    this.selectedImageUrl = null;
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
            this.imageSelected = true;
          } else if (res.type === 'giphy') {
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
}
