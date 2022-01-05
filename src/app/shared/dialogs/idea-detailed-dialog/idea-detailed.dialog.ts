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
import { IdeaDetailedInfo } from '../../components/idea-detailed/idea-detailed';
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
  pdfSelected;
  selectedpdfDoc;
  pdfSrc;
  hostname = environment.web_protocol + '://' + environment.host;

  @Output() sendMessage = new EventEmitter<any>();
  @Output() deleteIdea = new EventEmitter<any>();
  @Output() previousItem = new EventEmitter<any>();
  @Output() nextItem = new EventEmitter<any>();
  constructor(
    private dialogRef: MatDialogRef<IdeaDetailedDialogComponent>,
    private activitiesService: ActivitiesService,
    @Inject(MAT_DIALOG_DATA)
    public data: IdeaDetailedInfo,
    private matDialog: MatDialog
  ) {
    // this.showCategoriesDropdown = data.showCategoriesDropdown;
    // this.categories = data.categories.filter((val) => !val.removed);
    // this.idea = data.item;
    // if (this.categories.length) {
    //   this.selectedCategory = this.categories[0];
    // }
    // this.ideaTitle = data.item.title;
    // this.userIdeaText = data.item.idea;
    // if (data.item.idea_image) {
    //   this.imageSelected = true;
    //   this.imageSrc = data.item.idea_image.img;
    // }
    // if (data.item.idea_document) {
    //   this.pdfSelected = true;
    //   this.pdfSrc = this.hostname + data.item.idea_document.document;
    // }
    // if (data.category) {
    //   this.selectedCategory = data.category;
    // }
    // if (data.myGroup) {
    //   this.group = data.myGroup;
    // }
    // this.activityState = data.activityState;
  }

  onSubmit(event) {
    this.dialogRef.close({
      ...event,
    });
  }

  nextItemRequested() {
    const checkIndex = 1;
    this.getItemByCheckIndex(checkIndex);
  }

  previousItemRequested() {
    const checkIndex = -1;
    this.getItemByCheckIndex(checkIndex);
  }

  getItemByCheckIndex(checkIndex) {
    let newItem;
    const currentlySelectedItem = this.data.item;
    const ideas = this.data.category.brainstormidea_set.filter((el) => !el.removed);
    for (let i = 0; i < ideas.length; i++) {
      const idea = ideas[i];
      if (idea.id === currentlySelectedItem.id) {
        if (ideas[i + checkIndex]) {
          newItem = ideas[i + checkIndex];
        } else {
          if (checkIndex === -1) {
            newItem = ideas[ideas.length - 1];
          } else {
            newItem = ideas[0];
          }
        }
      }
    }
    this.data = { ...this.data, item: newItem };
  }

  closeDialog() {
    this.dialogRef.close();
  }

  // remove() {
  //   if (this.pdfSelected) {
  //     this.clearPDF();
  //   } else {
  //     this.removeImage();
  //   }
  // }

  // removeImage() {
  //   this.imageSelected = false;
  //   this.imagesList = null;
  //   this.imageSrc = null;
  // }

  // clearPDF() {
  //   this.selectedpdfDoc = null;
  //   this.pdfSelected = false;
  //   this.pdfSrc = null;
  // }

  // openImagePickerDialog() {
  //   const code = this.lessonRunCode;
  //   this.imageDialogRef = this.matDialog
  //     .open(ImagePickerDialogComponent, {
  //       data: {
  //         lessonRunCode: code,
  //       },
  //       disableClose: false,
  //       panelClass: ['dashboard-dialog', 'image-picker-dialog'],
  //     })
  //     .afterClosed()
  //     .subscribe((res) => {
  //       if (res) {
  //         if (res.type === 'upload') {
  //           this.imageSelected = true;
  //           this.imagesList = res.data;
  //           const fileList: FileList = res.data;
  //           const file = fileList[0];
  //           const reader = new FileReader();
  //           reader.onload = (e) => (this.imageSrc = reader.result);
  //           reader.readAsDataURL(file);
  //         } else if (res.type === 'unsplash') {
  //           this.selectedImageUrl = res.data;
  //           this.imageSelected = true;
  //         } else if (res.type === 'giphy') {
  //           this.selectedImageUrl = res.data;
  //           this.imageSelected = true;
  //         }
  //       }
  //     });
  // }

  // isAbsolutePath(imageUrl: string) {
  //   if (imageUrl.includes('https:')) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // getParticipantName(code: number) {
  //   return this.activitiesService.getParticipantName(this.activityState, code);
  // }

  // submitComment(ideaId, val) {
  //   this.sendMessage.emit(new BrainstormSubmitIdeaCommentEvent(val, ideaId));
  // }

  propagate(event) {
    this.sendMessage.emit(event);
  }

  // getInitials(nameString: string) {
  //   const fullName = nameString.split(' ');
  //   const first = fullName[0] ? fullName[0].charAt(0) : '';
  //   if (fullName.length === 1) {
  //     return first.toUpperCase();
  //   }
  //   const second = fullName[fullName.length - 1] ? fullName[fullName.length - 1].charAt(0) : '';
  //   return (first + second).toUpperCase();
  // }

  delete(event) {
    this.deleteIdea.emit(event);
  }
}
