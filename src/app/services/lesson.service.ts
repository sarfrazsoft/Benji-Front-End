import { Injectable } from '@angular/core';
import { CoverPhoto } from './backend/schema/course_details';
import { environment } from 'src/environments/environment';

@Injectable()
export class LessonService {
  constructor() {}

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
        // this.coverPhoto = null;
        return null;
      }

      return image_url ?? this.hostLocation + img;
    } else {
      return null;
    }
  }

}
