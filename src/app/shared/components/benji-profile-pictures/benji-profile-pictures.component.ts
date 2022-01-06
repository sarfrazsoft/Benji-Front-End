import { Component, Input } from '@angular/core';

@Component({
  selector: 'benji-profile-pictures',
  templateUrl: './benji-profile-pictures.component.html',
})
export class BenjiProfilePicturesComponent {

  @Input() participant_codes;
  constructor(
  ) {
  }

}