import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import {
  debounceTime,
  distinct,
  filter,
  flatMap,
  map,
  tap,
} from 'rxjs/operators';
import { LayoutService } from 'src/app/services/layout.service';
import { EditorService } from './services';

import { Store } from '@ngrx/store';
import { Activity } from './models';
import * as fromStore from './store';

@Component({
  selector: 'benji-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit, OnDestroy {
  activities$: Observable<Activity[]>;
  showCancelAddSlide = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private editorService: EditorService,
    private store: Store<fromStore.EditorState>
  ) {
    this.layoutService.hideSidebar = true;
    this.activatedRoute.data.forEach((data: any) => {
      console.log(data);
    });
  }

  ngOnInit() {
    this.activities$ = this.store.select(fromStore.getAllActivities);

    // // create observable that emits click events
    // const source = fromEvent(window, 'scroll');
    // // map to string with given event timestamp
    // const example = source.pipe(map(event => `Event time: ${event.timeStamp}`));
    // // output (example): 'Event time: 7276.390000000001'
    // const subscribe = example.subscribe(val => console.log(val));
  }

  addSlide() {
    // this.editorService.
    // this.router.navigate(['/dashboard/learners/add']);
    this.store.dispatch(new fromStore.AddPlaceholderActivity());
    this.showCancelAddSlide = true;
  }

  cancelAddSlide() {
    this.showCancelAddSlide = false;
    this.store.dispatch(new fromStore.RemovePlaceholderActivity());
  }
  ngOnDestroy() {
    this.layoutService.hideSidebar = false;
  }
}
