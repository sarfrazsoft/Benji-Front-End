import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinct, filter, flatMap, map, takeUntil, tap } from 'rxjs/operators';
import { LayoutService } from 'src/app/services/layout.service';
import { EditorService } from './services';

import { LocationStrategy } from '@angular/common';
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
  private ngUnsubscribe = new Subject();

  lessonName$: Observable<any>;
  lessonName: string;
  showEditableLessonName = false;
  @ViewChild('name', { static: false }) searchElement: ElementRef;

  lessonError$: Observable<any>;
  error = null;

  lessonSaving$: Observable<any>;
  savingLesson = false;

  lessonSaved$: Observable<any>;
  lessonSaved = false;

  showCancelAddSlide = false;

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
    // event.stopPropagation();
    // event.preventDefault();
    // this.preventBackButton();
    this.router.navigate(['/dashboard']);
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private layoutService: LayoutService,
    private editorService: EditorService,
    private store: Store<fromStore.EditorState>,
    private locationStrategy: LocationStrategy
  ) {
    this.preventBackButton();
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

  preventBackButton() {
    history.pushState(null, null, location.href);
    this.locationStrategy.onPopState(() => {
      history.pushState(null, null, location.href);
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
        this.error = null;
      }
    });

    this.lessonSaving$ = this.store.select(fromStore.getSavingLesson);
    this.lessonSaving$.subscribe((e) => {
      if (e) {
        this.savingLesson = true;
      } else {
        setTimeout(() => {
          this.savingLesson = false;
        }, 500);
      }
    });

    this.lessonSaved$ = this.store.select(fromStore.getLessonSaved);
    this.lessonSaved$.subscribe((e) => {
      if (e) {
        setTimeout(() => {
          this.lessonSaved = true;
        }, 500);
      } else {
        this.lessonSaved = false;
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

  saveLesson() {
    // this.store.dispatch(new fromStore.SaveLesson());
  }

  cancelAddSlide() {
    // this.showCancelAddSlide = false;
    // this.store.dispatch(new fromStore.RemovePlaceholderActivity());
  }
  ngOnDestroy() {
    this.layoutService.hideSidebar = false;
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
        })),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((pair) => {
        if (pair.activities.length === 0 && pair.loaded) {
          this.store.dispatch(new fromStore.AddEmptyLessonActivity());
        }
      });
  }

  startNewLesson() {}
}
