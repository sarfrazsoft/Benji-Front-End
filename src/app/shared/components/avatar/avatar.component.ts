import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html'
})
export class CcrAvatarComponent {
  @Input() imgSrc = '../../assets/img/avatar.png';
  @Input() size: string;
}
