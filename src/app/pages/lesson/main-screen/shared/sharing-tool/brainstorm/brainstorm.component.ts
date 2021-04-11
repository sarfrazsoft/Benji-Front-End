import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BrainstormService } from 'src/app/services/activities';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { Participant } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-brainstorm',
  templateUrl: './brainstorm.component.html',
})
export class BrainstormComponent implements OnInit, OnChanges {
  @Input() data: UpdateMessage;
  @Input() currentSpeaker: { displayName: string; id: number };
  ideas = [];
  constructor(private brainstormService: BrainstormService) {}

  ngOnInit(): void {}

  ngOnChanges() {}

  update() {
    this.ideas = this.brainstormService.getUserIdeas(this.currentSpeaker.id, this.data.brainstormactivity);
    // console.log(this.currentSpeaker)
    // console.log(this.data)
  }
}
