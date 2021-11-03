import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as global from 'src/app/globals';
import { BrainstormImageSubmitEvent, BrainstormSubmitEvent, Category } from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { ImagePickerDialogComponent } from 'src/app/shared/dialogs/image-picker-dialog/image-picker.dialog';
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
  selectedCategory: Category;

  imagesList: FileList;
  imageSrc;
  imageDialogRef;
  selectedImageUrl;
  constructor(
    private matDialog: MatDialog,
    private httpClient: HttpClient,
    private utilsService: UtilsService
  ) {}

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
    if (this.imagesList || this.selectedImageUrl) {
      this.submitWithImg();
    } else {
      this.submitWithoutImg();
    }
  }

  submitWithoutImg() {
    if (this.userIdeaText.length === 0) {
      return;
    }
    this.sendMessage.emit(new BrainstormSubmitEvent(this.userIdeaText, '', this.selectedCategory.id, null));
    this.idea.editing = false;
  }

  submitWithImg() {
    this.submitImageNIdea();
    this.idea.editing = false;
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
    if (fileList && fileList.length > 0) {
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
              if (!this.userIdeaText) {
                this.userIdeaText = '';
              }
              // this.sendMessage.emit(
              //   new BrainstormSubmitEvent(this.userIdeaText, this.selectedCategory.id, res.id)
              // );
              // this.userIdeaText = '';
            })
            .subscribe(
              (data) => {},
              (error) => console.log(error)
            );
        })
        .catch(function (err) {
          console.error(err);
        });
    } else {
      if (this.selectedImageUrl) {
        this.sendMessage.emit(
          new BrainstormImageSubmitEvent(
            this.userIdeaText,
            '',
            this.selectedCategory.id,
            this.selectedImageUrl
          )
        );
      }
    }
  }

  openImagePickerDialog() {
    const code = this.activityState.lesson_run.lessonrun_code;
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
            this.imagesList = res.data;
            const fileList: FileList = res.data;
            const file = fileList[0];
            const reader = new FileReader();
            reader.onload = (e) => (this.imageSrc = reader.result);
            reader.readAsDataURL(file);
          } else if (res.type === 'unsplash') {
            this.selectedImageUrl = res.data;
          } else if (res.type === 'giphy') {
            this.selectedImageUrl = res.data;
          }
        }
      });
  }
}
