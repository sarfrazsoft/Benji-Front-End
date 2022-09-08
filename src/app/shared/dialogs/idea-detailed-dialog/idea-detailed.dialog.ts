import {
  animate,
  state,
  style,
  transition,
  trigger,
  // ...
} from '@angular/animations';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { BrainstormService } from 'src/app/services/activities';
import { Category, Group, Idea, UpdateMessage } from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import { IdeaDetailedComponent, IdeaDetailedInfo } from '../../components/idea-detailed/idea-detailed';
import { ConfirmationDialogComponent } from '../confirmation/confirmation.dialog';

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
export class IdeaDetailedDialogComponent implements OnInit {
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

  @ViewChild(IdeaDetailedComponent) ideaDetailedComponent: IdeaDetailedComponent;

  isEdited: boolean;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogRef: MatDialogRef<IdeaDetailedDialogComponent>,
    private matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: IdeaDetailedInfo,
    private brainstormService: BrainstormService
  ) {}

  ngOnInit(): void {
    this.dialogRef.backdropClick().subscribe(() => {
      if (this.isEdited) {
        this.openConfirmationDialog();
      } else {
        this.dialogRef.close();
      }
    });

    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        if (this.isEdited) {
          this.openConfirmationDialog();
        } else {
          this.dialogRef.close();
        }
      }
    });
  }

  openConfirmationDialog() {
    this.matDialog
      .open(ConfirmationDialogComponent, {
        data: {
          confirmationTitle: 'Discard edits?',
          confirmationMessage:
            'Are you sure you want to discard your edits to your post? This can’t be undone.',
          actionButton: 'Discard',
          cancelButton: 'Keep working',
        },
        disableClose: true,
        panelClass: 'confirmation-dialog',
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.dialogRef.close();
        }
      });
  }

  ideaIsEdited(event) {
    this.isEdited = event;
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

  public ideaChangingQueryParams(ideaId: number) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { post: ideaId },
      queryParamsHandling: 'merge',
    });
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
    this.ideaChangingQueryParams(newItem.id);
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

  ideaCommentSuccessfullySubmitted(): void {
    this.ideaDetailedComponent.ideaCommentSuccessfullySubmitted();
  }
  brainstormSubmitIdeaCommentEvent(): void {
    this.ideaDetailedComponent.brainstormSubmitIdeaCommentEvent();
  }
}
