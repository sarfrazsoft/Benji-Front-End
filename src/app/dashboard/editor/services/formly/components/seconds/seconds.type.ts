import { Component, OnInit } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'benji-seconds-type',
  templateUrl: './seconds.type.html',
})
export class SecondsTypeComponent extends FieldType implements OnInit {
  timeInSeconds = 0;
  mins = 0;
  secs = 0;

  minEntered($event) {
    this.calculateTime();
  }

  secEntered($event) {
    this.calculateTime();
  }

  calculateTime() {
    const mins = this.mins;
    const convertedSeconds = mins * 60;
    const seconds = this.secs;
    const totalSeconds = convertedSeconds + seconds;
    this.formControl.setValue(totalSeconds);
    console.log(totalSeconds);
  }

  ngOnInit() {
    console.log(this.formControl.value);
  }
}
