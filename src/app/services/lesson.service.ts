import { Injectable } from '@angular/core';
import { CoverPhoto } from './backend/schema/course_details';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as global from 'src/app/globals';

@Injectable()
export class LessonService {
  constructor(private httpClient: HttpClient) {}

  maxIdIndex: number;
  coverPhoto: string;

  hostLocation = environment.web_protocol + '://' + environment.host;

  setCoverPhoto(images: Array<CoverPhoto>) {
    if (images.length > 0) {
      const ids = images.map((object) => object.id);
      const max = Math.max(...ids);
      this.maxIdIndex = images.findIndex((x) => x.id === max);

      const image_url = images[this.maxIdIndex]?.image_url;
      const img = images[this.maxIdIndex]?.img;

      if (!image_url && !img) {
        return null;
      }

      return image_url ?? this.hostLocation + img;
    } else {
      return null;
    }
  }

  updateLessonRunImage(
    lessonrunCode: number,
    lessonImage: Blob,
    lessonImageName: string,
    imageUrl: string,
    imageId: number
  ) {
    const url =
      global.apiRoot + '/course_details/lesson_run/' + lessonrunCode + '/upload_image/?image_id=' + imageId;
    const formData: FormData = new FormData();
    if (lessonImage) {
      formData.append('img', lessonImage, lessonImageName);
    }
    if (imageUrl) {
      formData.append('image_url', imageUrl);
    }
    const headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    const params = new HttpParams();
    return this.httpClient.post(url, formData, { params, headers }).map((res: any) => {
      return res;
    });
  }

}
