import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-animated-checkmark-button',
  templateUrl: './animated-checkmark-button.component.html',
  styleUrls: ['./animated-checkmark-button.component.scss'],
  animations: []
})
export class AnimatedCheckmarkButtonComponent implements OnInit {
  @Input()
  loadingState: boolean;
  @Input()
  buttonStyle: string;
  @Input()
  innerHTML: string;
  @Input()
  loadingStateInnerHTML: string;

  @Output()
  clicked = new EventEmitter<boolean>();

  @Output()
  animationEnd = new EventEmitter<boolean>();

  @Input()
  set valid(isValid) {
    this._valid = isValid;
  }
  public _valid: boolean;
  public buttonClassList: string[];

  constructor() {}

  ngOnInit() {
    this.setButtonStyles();
  }

  public emitClicked() {
    // this.setButtonLoadingState();
    this.clicked.emit(true);
  }

  // if valid
  // animate button: change button to circle, innerHTML to checkmark
  // else if invalid
  // return button to default/original state

  private setButtonStyles() {
    if (this.buttonStyle === 'default') {
      this.buttonClassList = ['b-standard-button'];
    } else if (this.buttonStyle === 'white') {
      this.buttonClassList = [
        'b-standard-button',
        'b-standard-button--white',
        'animated'
      ];
    } else {
      console.error('Invalid button style...using "default" style.');
      this.buttonClassList = ['b-standard-button'];
    }
  }

  private setButtonLoadingState(): any {
    if (!this._valid) {
      if (this.buttonStyle === 'default') {
        // this.loadingState = true;
        this.buttonClassList = [
          'b-standard-button'
          // 'b-standard-button--inactive'
        ];
      } else if (this.buttonStyle === 'white') {
        // this.loadingState = true;
        this.buttonClassList = [
          'b-standard-button',
          'b-standard-button--white'
          // 'b-standard-button--white-inactive'
        ];
      } else {
        console.error('Invalid button style...using "default" style.');
        // this.loadingState = true;
        this.buttonClassList = [
          'b-standard-button'
          // 'b-standard-button--inactive'
        ];
      }
    }
  }

  public animationDone(e) {
    if (e.toState === 'checked') {
      setTimeout(() => {
        this.animationEnd.emit(true);
      }, e.totalTime);
    }
  }
}
