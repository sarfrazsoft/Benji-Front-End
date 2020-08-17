import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import * as fromStore from '../store';

@Component({
  selector: 'benji-preview-panel',
  templateUrl: './preview-panel.component.html',
  styleUrls: ['./preview-panel.component.scss'],
})
export class PreviewPanelComponent implements OnInit {
  lessonActivities$: Observable<any[]>;
  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    // this.possibleActivities$ = this.store.select(
    //   fromStore.getAllPossibleActivities
    // );
  }
}
