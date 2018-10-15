import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-animated-checkmark-button',
  templateUrl: './animated-checkmark-button.component.html',
  styleUrls: ['./animated-checkmark-button.component.scss'],
  animations: [
    trigger('validCheck', [
      state('checked', style({
        width: '50px',
        // color: '#6c6c6c',
        fontSize: '20px'
      })),
      transition('* => checked', [
        animate('0.4s')
      ])
    ])
  ]
})
export class AnimatedCheckmarkButtonComponent implements OnInit {

  @Input() loadingState: boolean;
  @Input() buttonStyle: string;
  public buttonClassList: string[];

  @Output() clicked = new EventEmitter<boolean>();
  @Input() innerHTML: string;
  @Input() loadingStateInnerHTML: string;
  public  valid = false;

  constructor() {
  }

  ngOnInit() {
    this.setButtonStyles();
  }

  public emitClicked() {
    // change button state to inactive/loading state
    if (!this.valid) {
      this.setButtonLoadingState();
      // notify parent that button was clicked
      this.clicked.emit(true);
      // parent to preform checks/validation
      setTimeout(() => {
        this.loadingState = false;
        this.setButtonStyles();
        this.valid = !this.valid;
      }, 1000);
    }
  }

  // if valid
  // animate button: change button to circle, innerHTML to checkmark
  // else if invalid
  // return button to default/original state


  private setButtonStyles() {
    if (this.buttonStyle === 'default') {
      this.buttonClassList = ['b-standard-button'];
    } else if (this.buttonStyle === 'white') {
      this.buttonClassList = ['b-standard-button', 'b-standard-button--white', 'animated'];
    } else {
      console.error('Invalid button style...using "default" style.');
      this.buttonClassList = ['b-standard-button'];
    }
  }


  private setButtonLoadingState(): any {
    if(!this.valid) {
      if (this.buttonStyle === 'default') {
        this.loadingState = true;
        this.buttonClassList = ['b-standard-button', 'b-standard-button--inactive'];
      } else if (this.buttonStyle === 'white') {
        this.loadingState = true;
        this.buttonClassList = ['b-standard-button', 'b-standard-button--white', 'b-standard-button--white-inactive'];
      } else {
        console.error('Invalid button style...using "default" style.');
        this.loadingState = true;
        this.buttonClassList = ['b-standard-button', 'b-standard-button--inactive'];
      }
    }
  }
}
