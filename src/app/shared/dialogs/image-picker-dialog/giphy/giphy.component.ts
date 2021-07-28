import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import * as global from 'src/app/globals';

@Component({
  selector: 'benji-giphy-picker',
  templateUrl: 'giphy.component.html',
})
export class GiphyComponent implements OnInit {
  images;
  typingTimer;
  @Output() imageSelected = new EventEmitter<any>();
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.getGiphyImages('nature');
  }

  typingStoped(query) {
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => {
      this.getGiphyImages(query);
    }, 1000);
  }
  typingStarted() {
    clearTimeout(this.typingTimer);
  }

  getGiphyImages(query) {
    this.httpClient.get(global.apiRoot + '/integrations/giphy/?search=' + query).subscribe((res: any) => {
      this.images = res.results;
    });
  }

  setImage(url) {
    // console.log(url);
    this.imageSelected.emit(url);
  }
}
