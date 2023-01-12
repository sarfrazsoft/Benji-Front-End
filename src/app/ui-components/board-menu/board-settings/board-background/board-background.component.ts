import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { asyncScheduler, Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { BrainstormService } from 'src/app/services';
import {
  Board,
  BoardBackgroundType,
  BrainstormBoardBackgroudEvent,
  ChangeBoardBackgroundTypeEvent,
  IdeaDocument,
  ToggleBlurBackgroundImageEvent,
} from 'src/app/services/backend/schema';
import { BoardBackgroundService } from 'src/app/services/board-background.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ImagePickerDialogComponent } from 'src/app/shared/dialogs/image-picker-dialog/image-picker.dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'benji-board-background',
  templateUrl: 'board-background.component.html',
})
export class BoardBackgroundComponent implements OnInit {
  @Input() selectedBoard: Board;
  @Input() lessonRunCode: number;
  @Output() sendMessage = new EventEmitter<any>();

  bgType: BoardBackgroundType;

  bgColor: string;
  bgImage: string;
  selectedImage: Blob;
  bgImgUrl: string;
  selectedImageName: string;
  blurImage: boolean;
  bgImgUpload: string;
  hostname = environment.web_protocol + '://' + environment.host;
  subject;

  constructor(
    private boardBackgroundService: BoardBackgroundService,
    private brainstormService: BrainstormService,
    private matDialog: MatDialog,
    private utilsService: UtilsService,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.setBgValues(this.selectedBoard);
    this.brainstormService.selectedBoard$.subscribe((board: Board) => {
      if (board) {
        this.setBgValues(board);
      }
    });

    this.subject = new Subject(); // a subject to notify
    const colorObservable = this.subject.asObservable();
    colorObservable.pipe(throttleTime(1500, asyncScheduler, {
      leading: false,
      trailing: true
    }))
      .subscribe(value => {
        if (value) {
          this.sendMessage.emit(
            new BrainstormBoardBackgroudEvent(
              this.selectedBoard?.id,
              this.bgImgUpload,
              this.bgImgUrl,
              this.bgColor
            )
          );
        }
      });
  }

  setBgValues(board: Board) {
    this.selectedBoard = board;
    this.bgType = this.selectedBoard.board_activity.background_type;
    // If no color then we need default color
    this.bgColor = this.selectedBoard.board_activity.color ?? '#555BEA';
    // BG upload and URL are mutually exlusive
    this.bgImage =
      this.selectedBoard.board_activity.image_upload ?? this.selectedBoard.board_activity.image_url;
    this.bgImgUpload = this.selectedBoard.board_activity.image_upload;
    this.bgImgUrl = this.selectedBoard.board_activity.image_url;
    this.blurImage = this.selectedBoard.board_activity.blur_image;
  }

  backgroundTypeChanged(type) {
    this.bgType = type;
    this.boardBackgroundService.boardBackgroundType = type;
    this.sendMessage.emit(new ChangeBoardBackgroundTypeEvent(this.selectedBoard.id, type));
  }

  onColorChange(color: string) {
    this.bgColor = color;
    if (this.bgType === 'color') {
      this.boardBackgroundService.boardBackgroundColor = color;
      this.subject.next(color);
    }
  }

  openImagePickerDialog() {
    this.matDialog
      .open(ImagePickerDialogComponent, {
        disableClose: false,
        panelClass: ['dashboard-dialog', 'image-picker-dialog'],
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          if (res.type === 'upload') {
            const fileList: FileList = res.data;
            const file: File = fileList[0];
            const reader = new FileReader();
            reader.onload = (e) => {
              this.bgImgUpload = reader.result.toString();
            };
            reader.readAsDataURL(file);
            this.utilsService
              .resizeImage({
                file: file,
                maxSize: 2400,
              })
              .then((resizedImage: Blob) => {
                this.selectedImage = resizedImage;
                this.selectedImageName = file.name;
                this.bgImgUrl = null;
                this.uploadImageToBenji();
              })
              .catch(function (err) {
                console.error(err);
              });
          } else if (res.type === 'unsplash') {
            this.bgImage = res.data;
            this.bgImgUrl = res.data;
            this.selectedImage = null;
            this.selectedImageName = null;
            this.boardBackgroundService.boardBackgroundImage = this.bgImgUrl;
            this.bgImgUpload = null; // BG upload and URL are mutually exlusive
            this.sendMessage.emit(
              new BrainstormBoardBackgroudEvent(this.selectedBoard.id, null, this.bgImgUrl, this.bgColor)
            );
          }
        }
      });
  }

  uploadImageToBenji() {
    const url = global.apiRoot + '/course_details/lesson_run/' + this.lessonRunCode + '/upload_document/';
    const formData: FormData = new FormData();
    formData.append('document_type', 'image');
    formData.append('document', this.selectedImage, this.selectedImageName);
    const headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    const params = new HttpParams();
    this.httpClient.post(url, formData, { params, headers }).subscribe(
      (data: IdeaDocument) => {
        this.bgImgUpload = this.hostname + data.document;
        this.bgImage = this.bgImgUpload;
        this.boardBackgroundService.boardBackgroundImage = this.bgImage;
        this.bgImgUrl = null; // BG upload and URL are mutually exlusive
        this.sendMessage.emit(
          new BrainstormBoardBackgroudEvent(
            this.selectedBoard.id,
            this.bgImgUpload,
            this.bgImgUrl,
            this.bgColor
          )
        );
      },
      (error) => console.log(error)
    );
  }

  toggleBlurImage() {
    this.blurImage = !this.blurImage;
    this.boardBackgroundService.blurBackgroundImage = this.blurImage;
    this.sendMessage.emit(new ToggleBlurBackgroundImageEvent(this.selectedBoard.id));
  }
}
