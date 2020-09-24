import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, fromEvent, Observable } from 'rxjs';
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
  lessonActivities$: Observable<Activity[]>;
  getActivitiesLoaded$: Observable<any>;

  lessonName$: Observable<any>;
  lessonName: string;
  showEditableLessonName = false;
  @ViewChild('name', { static: false }) searchElement: ElementRef;

  lessonError$: Observable<any>;
  error = '';

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
      if (data && data.editorData && data.editorData.lesson) {
        this.router.navigate([data.editorData.lesson.id], {
          relativeTo: this.activatedRoute,
        });
      }
    });
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const lessonId = paramMap.get('lessonId');
      if (lessonId) {
        this.loadLessonActivities(lessonId);
      } else {
        // this.startNewLesson();
      }
    });
  }

  ngOnInit() {
    this.lessonName$ = this.store.select(fromStore.getLessonName);

    this.lessonName$.subscribe((name) => (this.lessonName = name));

    this.lessonError$ = this.store.select(fromStore.getErrorInLeson);

    this.lessonError$.subscribe((e) => {
      if (e === true) {
        this.error = 'Invalid lesson';
      } else {
        this.error = '';
      }
    });
  }

  lessonNameClicked(name) {
    this.showEditableLessonName = true;
    setTimeout(() => {
      // this will make the execution after the above boolean has changed
      // this.searchElement.nativeElement.focus();
      this.searchElement.nativeElement.focus();
    }, 3);
  }

  updateName(inputField) {
    this.store.dispatch(new fromStore.UpdateLessonName(inputField.value));
    this.showEditableLessonName = false;
  }

  addSlide() {
    // this.editorService.
    // this.router.navigate(['/dashboard/learners/add']);
    this.store.dispatch(new fromStore.AddEmptyLessonActivity());
    // this.showCancelAddSlide = true;
  }

  saveLesson() {
    // this.store.dispatch(new fromStore.SaveLesson());
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

    this.lessonActivities$ = this.store.select(fromStore.getAllLessonActivities);
    this.getActivitiesLoaded$ = this.store.select(fromStore.getActivitiesLoaded);

    combineLatest([this.lessonActivities$, this.getActivitiesLoaded$])
      .pipe(
        map(([a$, c$]) => ({
          activities: a$,
          loaded: c$,
        }))
      )
      .subscribe((pair) => {
        if (pair.activities.length === 0 && pair.loaded) {
          this.store.dispatch(new fromStore.AddEmptyLessonActivity());
        }
      });
  }

  startNewLesson() {
    // this.store.dispatch(new fromStore.SaveEmptyLesson());
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
