import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as global from 'src/app/globals';
import {
  BrainstormImageSubmitEvent,
  BrainstormSubmitEvent,
  Category,
  Idea,
} from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { ImagePickerDialogComponent } from 'src/app/shared/dialogs/image-picker-dialog/image-picker.dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'benji-uncategorized-ideas',
  templateUrl: './uncategorized.component.html',
})
export class UncategorizedComponent implements OnInit, OnChanges {
  @Input() submissionScreen;
  @Input() voteScreen;
  @Input() act;
  @Input() minWidth;
  @Input() sendMessage;
  @Input() joinedUsers;
  @Input() showUserName;

  ideas = [];

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
    this.ideas = [];
    this.act.brainstormcategory_set.forEach((category) => {
      if (!category.removed && category.brainstormidea_set) {
        category.brainstormidea_set.forEach((idea: Idea) => {
          if (!idea.removed) {
            this.ideas.push({ ...idea, showClose: false });
          }
        });
      }
    });
    // act.idea_rankings.forEach((idea) => {
    //   this.ideas.push({ ...idea, showClose: false });
    // });
    this.ideas.sort((a, b) => b.num_votes - a.num_votes);
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
    console.log(idea);
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
