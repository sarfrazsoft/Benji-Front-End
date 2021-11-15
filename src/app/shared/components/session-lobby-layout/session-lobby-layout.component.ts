import { Component, Input, OnInit, } from "@angular/core";
import { BeforeLessonRunDetails } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-session-lobby-layout',
  templateUrl: './session-lobby-layout.component.html',
})
export class SessionLobbyLayoutComponent {

  @Input() beforeLessonRunDetails: BeforeLessonRunDetails;

  getInitials(nameString: string) {
    const fullName = nameString.split(' ');
    let inits = '';
    fullName.forEach(name => {
      inits = inits + name.charAt(0);
    });
    return inits.toUpperCase();
  }
}