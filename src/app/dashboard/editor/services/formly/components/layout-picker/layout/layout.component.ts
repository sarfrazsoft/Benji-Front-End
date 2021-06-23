import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
//import * as fromStore from '../../../store';

@Component({
  selector: 'benji-selector-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  @Input() layout;
  hover = false;
  imgSrc = '';
  hostname = window.location.protocol + '//' + environment.host;
  selectedPossibleLayout = '';
  sub: Subscription;
 // constructor(private store: Store<fromStore.EditorState>) {}

  ngOnInit() {
    // this.activities$ = this.store.select(fromStore.getAllPossibleActivities);
    // this.sub = this.store.select(fromStore.getSelectedPossibleLayout).subscribe((val) => {
    //   this.selectedPossibleLayout = val;
    // });
  }
  getThumbnailSrc(layout) {
    if (layout.thumbnail) {
      return this.hostname + layout.thumbnail;
    }
  }

  selectlayout(layoutId) {
    if (this.selectedPossibleLayout === layoutId) {
      return;
    }
    //this.store.dispatch(new fromStore.SelectLayoutType(layoutId));
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
