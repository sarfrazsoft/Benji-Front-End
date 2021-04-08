import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import * as global from 'src/app/globals';
import { BrainstormSubmitEvent, Category } from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { DraftIdea } from '../brainstorming-activity.component';

@Component({
  selector: 'benji-idea-container',
  templateUrl: './idea-container.component.html',
})
export class IdeaContainerComponent implements OnInit, OnChanges {
  @Input() categories = [];
  @Input() sendMessage;
  @Input() activityState;
  act;
  @Input() participantCode;
  @Input() idea: DraftIdea;

  userIdeaText = '';
  selectedIdeas = [];
  ideas = [];
  showVoteSubmitButton = false;
  noOfIdeasSubmitted = 0;
  maxSubmissions = 1;

  showCategoriesDropdown = false;
  // categories = [];
  selectedCategory: Category;

  imagesList: FileList;
  imageSrc;
  constructor(private httpClient: HttpClient, private utilsService: UtilsService) {}

  ngOnInit(): void {
    this.selectedCategory = this.act.brainstormcategory_set[0];

    this.userIdeaText = this.idea.text;
  }

  ngOnChanges() {
    this.act = this.activityState.brainstormactivity;

    // show dropdown if categorize_flag is set
    if (this.act.categorize_flag) {
      this.showCategoriesDropdown = true;
      this.categories = this.act.brainstormcategory_set;
    } else {
      this.showCategoriesDropdown = false;
    }
  }

  submitIdea(idea): void {
    if (!idea.editing) {
      return;
    }
    if (this.imagesList) {
      this.submitWithImg();
    } else {
      this.submitWithoutImg();
    }
  }

  submitWithoutImg() {
    if (this.userIdeaText.length === 0) {
      return;
    }
    this.sendMessage.emit(new BrainstormSubmitEvent(this.userIdeaText, this.selectedCategory.id));
    this.idea.editing = false;
  }

  submitWithImg() {
    this.submitImageNIdea();
  }

  onFileSelect(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length === 0) {
      this.imagesList = null;
    } else {
      this.imagesList = fileList;
      // set the imageSrc for preview thumbnail
      const file = fileList[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.imageSrc = reader.result);
      reader.readAsDataURL(file);

      console.log(this.imagesList);
    }
  }

  getSelectedFileName() {
    let name = '';
    if (this.imagesList.length > 0) {
      name = this.imagesList[0].name;
    }
    return name;
  }

  submitImageNIdea() {
    const code = this.activityState.lesson_run.lessonrun_code;
    const url = global.apiRoot + '/course_details/lesson_run/' + code + '/upload_image/';
    const participant_code = this.participantCode;
    const fileList: FileList = this.imagesList;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      this.utilsService
        .resizeImage({
          file: file,
          maxSize: 500,
        })
        .then((resizedImage: Blob) => {
          const formData: FormData = new FormData();
          formData.append('img', resizedImage, file.name);
          formData.append('participant_code', participant_code);
          const headers = new HttpHeaders();
          headers.set('Content-Type', null);
          headers.set('Accept', 'multipart/form-data');
          const params = new HttpParams();
          this.httpClient
            .post(url, formData, { params, headers })
            .map((res: any) => {
              this.imagesList = null;
              this.sendMessage.emit(
                new BrainstormSubmitEvent(this.userIdeaText, this.selectedCategory.id, res.id)
              );
              this.userIdeaText = '';
            })
            .subscribe(
              (data) => {},
              (error) => console.log(error)
            );
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  }
}
