import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ActivityTypes as Acts } from 'src/app/globals';
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
  previewUrl$: Observable<string>;

  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    this.previewUrl$ = this.store.select(fromStore.getCurrentPreviewImage);
    this.activity$ = this.store.select(fromStore.getSelectedLessonActivity);
    this.possibleActivities$ = this.store.select(fromStore.getAllPossibleActivities);
    this.content$ = this.store.select(fromStore.getSelectedLessonActivityContent);

    combineLatest([
      this.activity$,
      this.possibleActivities$,
      this.content$,
      this.screenType$,
      this.previewUrl$,
    ])
      .pipe(
        map(([a$, b$, c$, d$, e$]) => ({
          activity: a$,
          possibleActivities: b$,
          content: c$,
          screenType: d$,
          previewImage: e$,
        }))
      )
      .subscribe((pair) => {
        if (pair.activity) {
          if (pair.activity.empty === false && pair.possibleActivities.length) {
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
          } else if (pair.activity.empty) {
            this.showImage = true;
            this.previewTemplate = false;
            this.imgSrc = this.hostname + '/static/activityflow/previews/placeholder.png';
          }

          if (pair.previewImage) {
            // If activity is empty
            if (pair.activity.empty) {
              // we'll show previewImage
              this.showImage = true;
              this.previewTemplate = false;
              this.imgSrc = this.hostname + pair.previewImage;
            } else {
              // If activity is not empty
              // and previewImage has 'placeholder' in it then we'll show template
              if (pair.previewImage.includes('placeholder')) {
                this.showImage = false;
                this.previewTemplate = true;
              }
              // If activity is not empty
              // and previewImage does not have 'placeholder' in it then
              // PreviewImage will be shown
              if (!pair.previewImage.includes('placeholder')) {
                this.showImage = true;
                this.previewTemplate = false;
                this.imgSrc = this.hostname + pair.previewImage;
              }
            }
          } else {
            this.showImage = false;
            this.previewTemplate = true;
          }
        }
      });
  }

  selectScreen(screenType: 'mainScreen' | 'participantScreen') {
    this.screenType$.next(screenType);
    this.screenType = screenType;
  }
}
