import {Component, OnInit, ViewEncapsulation, Input, Output, OnDestroy, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import {CurrentActivityStatus, Activity} from '../../../models/benji_models';

export abstract class DesktopBaseActivityComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activityDetails;
  @Input() sessionDetails;

  abstract ngOnInit(): void;
  abstract ngOnDestroy(): void;

  ngOnChanges(changes: SimpleChanges) {
    if (changes.activityDetails && changes.activityDetails.previousValue &&
      (changes.activityDetails.currentValue.id !== changes.activityDetails.previousValue.id)) {
      this.ngOnDestroy();
      this.ngOnInit();
    }
  }
}
