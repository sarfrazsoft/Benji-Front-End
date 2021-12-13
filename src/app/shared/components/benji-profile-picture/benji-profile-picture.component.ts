import { Component, Input } from '@angular/core';

@Component({
  selector: 'benji-profile-picture',
  templateUrl: './benji-profile-picture.component.html',
})
export class BenjiProfilePictureComponent {

  @Input() imageUrl;
  @Input() name;
  @Input() colorIndex;
  constructor(
  ) {
  }

}