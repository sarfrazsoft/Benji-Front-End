import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import * as global from 'src/app/globals';
//import { renderGrid  } from 'giphy-api';

import { throttle } from 'throttle-debounce';
import { renderGrid } from '@giphy/js-components';
import { GiphyFetch } from '@giphy/js-fetch-api';

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
    //console.log
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
      console.log(this.images);
    });
  }

  setImage(url) {
    // console.log(url);
    this.imageSelected.emit(url);
  }


  

}
