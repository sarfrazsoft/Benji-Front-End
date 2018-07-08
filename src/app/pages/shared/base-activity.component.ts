import {OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';

export abstract class BaseActivityComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activityDetails;
  @Input() activityRun;
  @Input() sessionDetails;
  @Input() clientIdentity;

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
