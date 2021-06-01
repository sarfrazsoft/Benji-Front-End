import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import * as global from 'src/app/globals';

@Component({
  selector: 'benji-giphy-picker',
  templateUrl: 'giphy.component.html',
})
export class GiphyComponent implements OnInit {
  images;
  typingTimer;
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {}

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
      console.log(res);
      this.images = res.results;
    });
  }
}
