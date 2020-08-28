import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinct, filter, flatMap, map, tap } from 'rxjs/operators';
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
      // console.log(data);
    });
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const lessonId = paramMap.get('lessonId');
      if (lessonId) {
        this.loadLessonActivities('lessonId');
      } else {
        this.startNewLesson();
      }
    });
  }

  ngOnInit() {
    // this.activities$ = this.store.select(fromStore.getAllActivities);
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
    this.store.dispatch(new fromStore.AddEmptyLessonActivity());
    // this.showCancelAddSlide = true;
  }

  cancelAddSlide() {
    // this.showCancelAddSlide = false;
    // this.store.dispatch(new fromStore.RemovePlaceholderActivity());
  }
  ngOnDestroy() {
    this.layoutService.hideSidebar = false;
  }

  loadLessonActivities(lessonId) {
    this.store.dispatch(new fromStore.LoadLessonActivites(lessonId));
  }

  startNewLesson() {
    this.store.dispatch(new fromStore.AddEmptyLessonActivity());
    // this.store.dispatch(new fromStore.AddLobbyActivity())
  }

  // saveLesson() {
  //   const lesson = [
  //     {
  //       activity_type: 'LobbyActivity',
  //       activity_id: 'lobby1',
  //       description: 'hello world',
  //     },
  //     {
  //       activity_type: 'TitleActivity',
  //       activity_id: 'title1',
  //       main_title: 'Hello World',
  //       hide_timer: true,
  //       title_text: 'some title text',
  //     },
  //   ];
  //   this.store.dispatch(new fromStore.SaveLesson(lesson));
  // }
}
