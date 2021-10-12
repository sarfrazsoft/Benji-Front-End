import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import * as global from 'src/app/globals';
import {
  BrainstormCreateCategoryEvent,
  BrainstormImageSubmitEvent,
  BrainstormRemoveCategoryEvent,
  BrainstormRenameCategoryEvent,
  BrainstormSetCategoryEvent,
  BrainstormSubmitEvent,
  Category,
  Idea,
} from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { environment } from 'src/environments/environment';
import { IdeaCreationDialogComponent } from 'src/app/shared/dialogs/idea-creation-dialog/idea-creation.dialog';

@Component({
  selector: 'benji-categorized-ideas',
  templateUrl: './categorized.component.html',
})
export class CategorizedComponent implements OnInit, OnChanges {
  @Input() submissionScreen;
  @Input() voteScreen;
  @Input() act;
  @Input() minWidth;
  @Input() sendMessage;
  @Input() joinedUsers;
  @Input() showUserName;
  @ViewChild('colName') colNameElement: ElementRef;
  hostname = environment.web_protocol + '://' + environment.host;

  @Output() viewImage = new EventEmitter<string>();
  @Output() deleteIdea = new EventEmitter<Idea>();

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private utilsService: UtilsService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.populateCategories();
  }

  populateCategories() {
    this.act.brainstormcategory_set.forEach((category) => {
      if (category.brainstormidea_set) {
        category.brainstormidea_set.forEach((idea) => {
          idea = { ...idea, showClose: false, editing: false, addingIdea: false };
        });
      } else {
        // Editor preview panel
      }
    });
  }

  addIdea(column) {
    if (column.id) {
      column.addingIdea = true;
    }
  }

  addColumn(newCategoryNumber) {
    this.sendMessage.emit(new BrainstormCreateCategoryEvent('Category ' + newCategoryNumber));
  }

  deleteCol(categoryId) {
    this.sendMessage.emit(new BrainstormRemoveCategoryEvent(categoryId, true));
  }

  onColumnNameBlur(column) {
    this.sendMessage.emit(new BrainstormRenameCategoryEvent(column.id, column.category_name));
    column.editing = false;
  }

  saveNewIdea(column, text) {
    column.addingIdea = false;
    this.sendMessage.emit(new BrainstormSubmitEvent(text, column.id));
  }

  isAbsolutePath(imageUrl: string) {
    // console.log(imageUrl);
    if (imageUrl.includes('https:')) {
      return true;
    } else {
      return false;
    }
  }

  openImage(imageUrl: string) {
    this.viewImage.emit(imageUrl);
  }

  getPersonName(idea: Idea) {
    if (idea && idea.submitting_participant) {
      const user = this.joinedUsers.find(
        (u) => u.participant_code === idea.submitting_participant.participant_code
      );
      return user.display_name;
    }
  }

  columnHeaderClicked(column) {
    column.editing = true;
    setTimeout(() => {
      this.colNameElement.nativeElement.focus();
    }, 0);
  }

  delete(id) {
    this.deleteIdea.emit(id);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.sendCategorizeEvent(event);
    }
  }

  sendCategorizeEvent(event) {
    const id = event.container.data[event.currentIndex].id;
    let categoryId;
    this.act.brainstormcategory_set.forEach((cat) => {
      cat.brainstormidea_set.forEach((idea) => {
        if (idea.id === id) {
          categoryId = cat.id;
        }
      });
    });
    this.sendMessage.emit(new BrainstormSetCategoryEvent(id, categoryId));
  }

  openDialog() {
    const dialogRef = this.dialog.open(IdeaCreationDialogComponent, {
      width: '621px',
      panelClass: 'idea-dialog',
      data: {
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Use Template') {
      }
      console.log(`Dialog result: ${result}`);
    });
  }

}