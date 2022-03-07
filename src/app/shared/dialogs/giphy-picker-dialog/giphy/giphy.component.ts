import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import * as global from 'src/app/globals';

import { throttle } from 'throttle-debounce';
import { renderGrid } from '@giphy/js-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';

// create a GiphyFetch with your api key
// apply for a new Web SDK key. Use a separate key for every platform (Android, iOS, Web)
const gf = new GiphyFetch('Xa971PzzeVPnuZ8fqr6d5CgZ5WN4wPtd')

@Component({
  selector: 'benji-giphy-picker',
  templateUrl: 'giphy.component.html',
})
export class GiphyComponent implements OnInit, AfterViewInit {
  images;
  typingTimer;
  @Output() imageSelected = new EventEmitter<any>();

  query: string = "";
  grid;
  constructor(private httpClient: HttpClient) {}

  ngOnInit() {
    this.grid = this.makeGrid(document.querySelector('.grid'));
   // this.getGiphyImages('nature');
  }

  ngAfterViewInit(): void {
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

  getGiphyImages = (query) => {
    this.query = query;
    this.grid.remove();
    this.grid = this.makeGrid(document.querySelector('.grid'));
  }

  setImage(url) {
    this.imageSelected.emit(url);
  }
    
  makeGrid(targetEl: HTMLElement) {
    const render = () => {
        // here is the @giphy/js-components import
        return renderGrid(
            {
                width: 528,
                fetchGifs: (offset: number) => { 
                  if(this.query !="") {
                    return gf.search(this.query);
                  }  else { return gf.trending(); };
                },
                columns: 3,
                gutter: 8,
                onGifClick:(gif: IGif, e: Event) => {
                  e.preventDefault();
                  this.setImage(gif.images.original.url);
                }
            },
            targetEl
        )
    }
    const resizeRender = throttle(500, render)
    window.addEventListener('resize', resizeRender, false)
    const remove = render()
    return {
        remove: () => {
            remove()
            window.removeEventListener('resize', resizeRender, false)
        },
    }
  }
}
