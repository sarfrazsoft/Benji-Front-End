import {
  animate,
  state,
  style,
  transition,
  trigger,
  // ...
} from '@angular/animations';
import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BrainstormService } from 'src/app/services/activities';
import {
  Category,
  Group,
  Idea,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import { IdeaDetailedInfo } from '../../components/idea-detailed/idea-detailed';

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
    @Inject(MAT_DIALOG_DATA)
    public data: IdeaDetailedInfo,
    private brainstormService: BrainstormService
  ) {
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
    let ideas = [];
    if (this.data.category) {
      // this is in categories view
      ideas = this.data.category.brainstormidea_set.filter((el) => !el.removed);
    } else {
      // this is in uncategorized view
      ideas = this.brainstormService.uncategorizedIdeas;
    }
    newItem = this.getNewItem(ideas, currentlySelectedItem, checkIndex);
    this.data = { ...this.data, item: newItem };
  }

  getNewItem(ideas, currentlySelectedItem, checkIndex) {
    let newItem;
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
    return newItem;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  propagate(event) {
    this.sendMessage.emit(event);
  }

  delete(event) {
    this.deleteIdea.emit(event);
  }
}
