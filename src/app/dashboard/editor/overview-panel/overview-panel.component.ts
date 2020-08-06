import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Activity } from '../models';
import * as fromStore from '../store';

@Component({
  selector: 'benji-overview-panel',
  templateUrl: './overview-panel.component.html',
  styleUrls: ['./overview-panel.component.scss'],
})
export class OverviewPanelComponent implements OnInit {
  @Input() activities$: Observable<Activity[]>;
  constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {}
}
