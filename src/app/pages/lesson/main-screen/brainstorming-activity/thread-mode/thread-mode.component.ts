import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { differenceBy, find, findIndex, includes, remove } from 'lodash';
import * as global from 'src/app/globals';
import { BrainstormService } from 'src/app/services';
import { Board, BrainstormSubmitEvent, Category, Idea } from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { ImagePickerDialogComponent } from 'src/app/shared/dialogs/image-picker-dialog/image-picker.dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'benji-thread-mode-ideas',
  templateUrl: './thread-mode.component.html',
})
export class ThreadModeComponent implements OnInit, OnChanges {
  @Input() board: Board;
  @Input() submissionScreen;
  @Input() voteScreen;
  @Input() act;
  @Input() activityState;
  @Input() minWidth;
  @Input() sendMessage;
  @Input() joinedUsers;
  @Input() showUserName;
  @Input() participantCode;
  @Input() eventType;
  @Input() categorizeFlag;
  @Input() myGroup;

  ideas = [];
  cycle = 'first';

  hostname = environment.web_protocol + '://' + environment.host;

  @Output() viewImage = new EventEmitter<string>();
  @Output() deleteIdea = new EventEmitter<Idea>();

  constructor(
    private dialog: MatDialog,
    private httpClient: HttpClient,
    private utilsService: UtilsService,
    private brainstormService: BrainstormService
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.cycle === 'first' || this.eventType === 'filtered') {
      this.ideas = [];
      this.ideas = this.populateIdeas(this.board);
      this.cycle = 'second';
    } else {
      if (this.eventType === 'BrainstormSubmitEvent') {
        this.addIdea(this.act, this.ideas);
      } else if (this.eventType === 'BrainstormSubmitIdeaCommentEvent') {
        this.ideaCommented(this.act, this.ideas);
      } else if (this.eventType === 'BrainstormRemoveIdeaCommentEvent') {
        this.ideaCommented(this.act, this.ideas);
      } else if (this.eventType === 'BrainstormSubmitIdeaHeartEvent') {
        this.ideaHearted(this.act, this.ideas);
      } else if (this.eventType === 'BrainstormRemoveIdeaHeartEvent') {
        this.ideaHearted(this.act, this.ideas);
      } else if (this.eventType === 'BrainstormRemoveSubmissionEvent') {
        this.ideaRemoved(this.act, this.ideas);
      } else if (this.eventType === 'BrainstormEditIdeaSubmitEvent') {
        this.ideaEdited(this.act, this.ideas);
      }
    }
  }

  populateIdeas(board) {
    const ideas = [];
    board.brainstormcategory_set.forEach((category) => {
      if (!category.removed && category.brainstormidea_set) {
        category.brainstormidea_set.forEach((idea: Idea) => {
          if (!idea.removed) {
            ideas.push({ ...idea, showClose: false });
          }
        });
      }
    });
    return ideas;
  }

  addIdea(act, existingIdeas) {
    const newIdeas = this.populateIdeas(act);
    if (newIdeas.length === existingIdeas.length) {
    } else {
      const myDifferences = differenceBy(newIdeas, existingIdeas, 'id');
      existingIdeas.push(myDifferences[0]);
    }
  }

  ideaRemoved(act, existingIdeas) {
    const newIdeas = this.populateIdeas(act);
    if (newIdeas.length === existingIdeas.length) {
    } else {
      const myDifferences: any = differenceBy(existingIdeas, newIdeas, 'id');
      remove(existingIdeas, (idea: any) => idea.id === myDifferences[0].id);
    }
  }

  ideaCommented(act, existingIdeas: Array<Idea>) {
    const newIdeas = this.populateIdeas(act);
    newIdeas.forEach((newIdea: Idea) => {
      const existingIdea = find(existingIdeas, { id: newIdea.id });
      if (existingIdea.comments.length < newIdea.comments.length) {
        const myDifferences = differenceBy(newIdea.comments, existingIdea.comments, 'id');
        existingIdea.comments.push(myDifferences[0]);
      } else if (existingIdea.comments.length > newIdea.comments.length) {
        const myDifferences: Array<any> = differenceBy(existingIdea.comments, newIdea.comments, 'id');
        remove(existingIdea.comments, (idea: any) => idea.id === myDifferences[0].id);
      }
    });
  }

  ideaHearted(act, existingIdeas: Array<Idea>) {
    const newIdeas = this.populateIdeas(act);
    newIdeas.forEach((newIdea: Idea) => {
      const existingIdea = find(existingIdeas, { id: newIdea.id });
      if (existingIdea.hearts.length < newIdea.hearts.length) {
        const myDifferences = differenceBy(newIdea.hearts, existingIdea.hearts, 'id');
        existingIdea.hearts.push(myDifferences[0]);
      } else if (existingIdea.hearts.length > newIdea.hearts.length) {
        const myDifferences: Array<any> = differenceBy(existingIdea.hearts, newIdea.hearts, 'id');
        remove(existingIdea.hearts, (idea: any) => idea.id === myDifferences[0].id);
      }
    });
  }

  ideaEdited(act, existingIdeas: Array<Idea>) {
    const newIdeas = this.populateIdeas(act);
    newIdeas.forEach((newIdea: Idea, index) => {
      const existingIdeaIndex = findIndex(existingIdeas, { id: newIdea.id });
      if (existingIdeas[existingIdeaIndex].version < newIdea.version) {
        existingIdeas.splice(existingIdeaIndex, 1, newIdea);
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

  delete(id) {
    this.deleteIdea.emit(id);
  }
}
