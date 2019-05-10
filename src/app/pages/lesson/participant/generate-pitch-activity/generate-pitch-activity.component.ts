import { Component, OnInit } from '@angular/core';
import * as odoo from 'src/assets/js/odoo.js';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ps-generate-pitch-activity',
  templateUrl: './generate-pitch-activity.component.html',
  styleUrls: ['./generate-pitch-activity.component.scss']
})
export class ParticipantGeneratePitchActivityComponent
  extends BaseActivityComponent
  implements OnInit {
  generatePitchSection = true;
  shareFeedback = false;

  generatePitch_set = [
    { id: 1, label: 'The company you are pitching is', value: 'IKEA' },
    { id: 2, label: 'You are pitching to:', value: 'a five year old child' },
    { id: 3, label: 'And the technique you need to use is:', value: 'analogy' }
  ];
  constructor() {
    super();
  }

  ngOnInit() {}

  generatePitch() {
    this.generatePitch_set[0].value.split(' ').forEach((el, index) => {
      odoo.default({
        el: '.odoo_' + index + '_' + el,
        from: '',
        letterSpacing: 1,
        to: 'IKEA',
        animationDelay: 1000
      });
    });

    this.generatePitch_set[1].value.split(' ').forEach((el, index) => {
      odoo.default({
        el: '.odoo_' + index + '_' + el,
        from: '',
        letterSpacing: 0.5,
        to: el,
        animationDelay: 1000
      });
    });

    this.generatePitch_set[2].value.split(' ').forEach((el, index) => {
      odoo.default({
        el: '.odoo_' + index + '_' + el,
        from: '',
        letterSpacing: 1,
        to: 'analogy',
        animationDelay: 1000
      });
    });
  }
}
