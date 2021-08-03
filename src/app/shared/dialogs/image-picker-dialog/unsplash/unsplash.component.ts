import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import * as global from 'src/app/globals';

@Component({
  selector: 'benji-unsplash-picker',
  templateUrl: 'unsplash.component.html',
})
export class UnsplashComponent implements OnInit {
  images;
  typingTimer;
  @Output() imageSelected = new EventEmitter<any>();
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.getUnsplashImages('nature');
  }

  typingStoped(query) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.getUnsplashImages(query);
    }, 1000);
  }
  typingStarted() {
    clearTimeout(this.typingTimer);
  }

  getUnsplashImages(query) {
    this.httpClient.get(global.apiRoot + '/integrations/unsplash/?search=' + query).subscribe((res: any) => {
      // console.log(res);
      this.images = res.results;
    });
  }

  setImage(image) {
    const downloadUrl = image.download_url + '&client_id=' + '1Edq4aVRPr6QD3GhRxJryyY1bvc_YO7Wn3n8DjO6zrU';
    this.httpClient.get(downloadUrl).subscribe((res: any) => {
      // console.log(res);
    });
    this.imageSelected.emit(image.image_url);
  }
}
