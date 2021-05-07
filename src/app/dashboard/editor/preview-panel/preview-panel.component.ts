import { Component, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { act } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ActivityTypes, ActivityTypes as Acts } from 'src/app/globals';
import { PreviewActivity, ScreenType } from 'src/app/services/backend/schema';
import { environment } from 'src/environments/environment';
import * as fromStore from '../store';

@Component({
  selector: 'benji-preview-panel',
  templateUrl: './preview-panel.component.html',
})
export class PreviewPanelComponent implements OnInit {
  previewTemplate = false;

  screenType: ScreenType = 'mainScreen';
  screenType$ = new BehaviorSubject<any>('mainScreen');

  activity$: Observable<any>;
  fields$: Observable<any>;
  content$: Observable<any>;
  possibleActivities$: Observable<any>;

  activityData: PreviewActivity;

  hostname = window.location.protocol + '//' + environment.host;
  imgSrc = '';
  showImage = false;

  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.activity$ = this.store.select(fromStore.getSelectedLessonActivity);
    this.possibleActivities$ = this.store.select(fromStore.getAllPossibleActivities);

    this.content$ = this.store.select(fromStore.getSelectedLessonActivityContent);

    combineLatest([this.activity$, this.possibleActivities$, this.content$, this.screenType$])
      .pipe(
        map(([a$, b$, c$, d$]) => ({
          activity: a$,
          possibleActivities: b$,
          content: c$,
          screenType: d$,
        }))
      )
      .subscribe((pair) => {
        if (pair.activity && pair.activity.empty === false && pair.possibleActivities.length) {
          const act_type = pair.activity.activity_type;
          if (
            act_type === Acts.title ||
            act_type === Acts.brainStorm ||
            act_type === Acts.mcq ||
            act_type === Acts.feedback ||
            act_type === Acts.buildAPitch ||
            act_type === Acts.caseStudy ||
            act_type === Acts.convoCards ||
            act_type === Acts.poll
          ) {
            this.previewTemplate = true;
            this.activityData = {
              activity_type: act_type,
              content: pair.content,
              screenType: pair.screenType,
            };
          } else {
            this.previewTemplate = false;
          }

          const s = pair.possibleActivities.filter((pa) => pa.id === act_type)[0].schema;
          this.imgSrc = this.hostname + s.preview_image;
          this.showImage = true;
        } else if (pair.activity && pair.activity.empty) {
          this.showImage = false;
          this.previewTemplate = false;
        }
      });
  }

  selectScreen(screenType: 'mainScreen' | 'participantScreen') {
    this.screenType$.next(screenType);
    this.screenType = screenType;
  }
}
