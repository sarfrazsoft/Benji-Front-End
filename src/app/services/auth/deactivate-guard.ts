import { CanDeactivate } from '@angular/router';
import { ParticipantLessonComponent } from '../../pages/lesson/participant/participant-lesson.component';
import { Injectable } from "@angular/core";

@Injectable()
export class DeactivateGuard implements CanDeactivate<ParticipantLessonComponent> {
  canDeactivate(component: ParticipantLessonComponent) {
    return component.canDeactivate();
  }
}
