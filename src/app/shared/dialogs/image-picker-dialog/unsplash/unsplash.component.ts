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

  ngOnInit() {}

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
      console.log(res);
      this.images = res.results;
    });
  }

  setImage(image) {
    const downloadUrl = image.download_url + '&client_id=' + 'Q1DbOLo0lFiydsPULxz_pl6zCGHwKSlJWBkusbAKBZ8';
    this.httpClient.get(downloadUrl).subscribe((res: any) => {
      // console.log(res);
    });
    this.imageSelected.emit(image.image_url);
  }
}
