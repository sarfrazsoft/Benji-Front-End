import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'benji-multi-user-lobby',
  templateUrl: './multi-user.component.html',
  styleUrls: ['./multi-user.component.scss']
})
export class MultiUserComponent {
  @Input() lessonName;
  @Output() startClicked = new EventEmitter();

  kickOffLesson() {
    this.startClicked.emit();
  }
}
