import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import {
  ParticipantOptInEvent,
  ParticipantOptOutEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { Participant } from 'src/app/services/backend/schema/course_details';

@Component({
  selector: 'benji-ps-grouping-tool',
  templateUrl: './Grouping-tool.component.html',
})
export class ParticipantGroupingToolComponent implements OnInit, OnChanges {
  selfGroupingAllowed = true;
  groups = [
    {
      id: 1,
      name: 'Getting to Yes',
      description: 'here is what we are going to do in this room.',
    },
    {
      id: 2,
      name: 'Pitch Practice Room',
      description: 'here is what we are going to do in this room.',
    },
    {
      id: 3,
      name: 'Building Rapport',
      description: 'here is what we are going to do in this room.',
    },
    {
      id: 4,
      name: 'Objection Handling',
      description: 'here is what we are going to do in this room.',
    },
    {
      id: 5,
      name: 'Getting to Yes',
      description: 'here is what we are going to do in this room.',
    },
    {
      id: 6,
      name: 'Pitch Practice',
      description: 'here is what we are going to do in this room.',
    },
    {
      id: 7,
      name: 'Building Rapport',
      description: 'here is what we are going to do in this room.',
    },
    {
      id: 7,
      name: 'Building Rapport',
      description: 'here is what we are going to do in this room.',
    },
    {
      id: 7,
      name: 'Building Rapport',
      description: 'here is what we are going to do in this room.',
    },
    {
      id: 7,
      name: 'Building Rapport',
      description: 'here is what we are going to do in this room.',
    },
  ];
  selectedChoice = {
    id: null,
    is_correct: null,
    choice_text: null,
    explanation: null,
    order: null,
  };
  @Input() activityState: UpdateMessage;
  @Output() sendMessage = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}

  ngOnChanges() {}

  amISharing() {
    const volunteers = this.activityState.running_tools.share.volunteers;
    return volunteers.includes(this.getParticipantCode());
  }

  getParticipantCode(): number {
    let details: Participant;
    if (localStorage.getItem('participant')) {
      details = JSON.parse(localStorage.getItem('participant'));
      return details.participant_code;
    }
  }

  selectOption(option) {
    this.selectedChoice = option;
  }
}
