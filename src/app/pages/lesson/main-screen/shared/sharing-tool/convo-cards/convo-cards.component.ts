import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BuildAPitchService } from 'src/app/services/activities';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { Participant } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-convo-cards',
  templateUrl: './convo-cards.component.html',
})
export class ConvoCardsComponent implements OnInit, OnChanges {
  @Input() data: UpdateMessage;
  @Input() currentSpeaker: { displayName: string; id: number };
  text = '';
  constructor(private buildAPitchService: BuildAPitchService) {}

  ngOnInit(): void {}

  ngOnChanges() {}

  update() {
    // this.text = '';
    // this.data.casestudyactivity.groups.forEach((group) => {
    //   if (group.id === this.currentSpeaker.id) {
    //     this.text = group['caseStudyGroupText'];
    //   }
    // });
  }
}
