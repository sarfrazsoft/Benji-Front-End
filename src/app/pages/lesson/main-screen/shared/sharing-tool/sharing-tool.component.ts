import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { cloneDeep } from 'lodash';
import { ActivityTypes } from 'src/app/globals';
import { Group, SelectParticipantForShareEvent, UpdateMessage } from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import {
  SharingBrainstormComponent,
  SharingBuildAPitchComponent,
  SharingCaseStudyComponent,
  SharingConvoCardsComponent,
} from './index';

@Component({
  selector: 'benji-ms-sharing-tool',
  templateUrl: './sharing-tool.component.html',
})
export class MainScreenSharingToolComponent implements OnInit, OnChanges {
  at: typeof ActivityTypes = ActivityTypes;
  // speakers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  speakers: Array<{ displayName: string; id: number; optedIn: boolean; group?: Group }> = [];
  feedbackArray: Array<{ participant: number; text: string; reaction: string; }> = [];
  volunteers: Array<number>;
  groups = [];
  panelOpen: boolean;
  panelOpenState: boolean;
  currentSpeakerIndex = 0;
  component;
  activityDataAvailable = true;
  // showSharingTool;
  @Input() activityState: UpdateMessage;
  // @Input() activityState: UpdateMessage;
  @ViewChild('activityEntry', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;

  @Output() sendMessage = new EventEmitter<any>();
  constructor(private cfr: ComponentFactoryResolver, private utilsService: UtilsService) {
    // if (this.activityState && this.activityState.running_tools.share) {
    //   this.showSharingTool = true;
    // } else {
    //   this.showSharingTool = false;
    // }
  }

  ngOnChanges() {
    const newVolunteers = this.activityState.running_tools.share.volunteers;
    if (this.component && this.component.instance) {
      this.component.instance.activityState = this.activityState;
      this.component.instance.data = this.activityState;
      this.component.instance.update();
    }
    if (this.volunteers && this.volunteers.length !== newVolunteers.length) {
      // this.initializeActivity();
      this.volunteers = this.activityState.running_tools.share.volunteers;
      this.changeOptedInUsers();
    }
    this.populateFeedback();
  }

  ngOnInit(): void {
    if (this.activityDataAvailable) {
      this.initializeActivity();
    } else {
      const participantSet = cloneDeep(this.activityState.lesson_run.participant_set);
      this.speakers = [];
      this.volunteers = this.activityState.running_tools.share.volunteers;
      participantSet.forEach((val, index) => {
        const optedIn = this.volunteers.includes(val.participant_code);
        this.speakers.push({ displayName: val.display_name, id: val.participant_code, optedIn: optedIn });
      });
      this.speakers.sort(function (obj1, obj2) {
        return Number(obj2.optedIn) - Number(obj1.optedIn);
      });
    }
  }

  initializeActivity() {
    this.volunteers = this.activityState.running_tools.share.volunteers;

    if (this.activityState.activity_type === this.at.buildAPitch) {
      const participantSet = cloneDeep(this.activityState.lesson_run.participant_set);
      participantSet.forEach((val, index) => {
        const optedIn = this.volunteers.includes(val.participant_code);
        this.speakers.push({ displayName: val.display_name, id: val.participant_code, optedIn: optedIn });
      });

      this.speakers.sort(function (obj1, obj2) {
        return Number(obj2.optedIn) - Number(obj1.optedIn);
      });

      const b = this.cfr.resolveComponentFactory(SharingBuildAPitchComponent);
      this.component = this.entry.createComponent(b);
      this.currentSpeakerIndex = 0;
      this.component.instance.data = this.activityState;
      this.component.instance.currentSpeaker = this.speakers[this.currentSpeakerIndex];
      this.component.instance.update();
    } else if (this.activityState.activity_type === this.at.caseStudy) {
      const groups = cloneDeep(this.activityState.casestudyactivity.groups);
      groups.forEach((val) => {
        // get all participants of this group and
        // figure out if anyone has opted in

        let optedIn = false;
        this.volunteers.forEach((volunteer) => {
          if (val.participants.includes(volunteer)) {
            optedIn = true;
          }
        });
        this.speakers.push({ displayName: val.title, id: val.id, optedIn: optedIn, group: val });
      });

      this.speakers.sort(function (obj1, obj2) {
        return Number(obj2.optedIn) - Number(obj1.optedIn);
      });

      const b = this.cfr.resolveComponentFactory(SharingCaseStudyComponent);
      this.component = this.entry.createComponent(b);
      this.currentSpeakerIndex = 0;
      this.component.instance.activityState = this.activityState;
      this.component.instance.currentSpeaker = this.speakers[this.currentSpeakerIndex];
      this.component.instance.update();
    } else if (this.activityState.activity_type === this.at.convoCards) {
      const participantSet = cloneDeep(this.activityState.lesson_run.participant_set);
      participantSet.forEach((val, index) => {
        const optedIn = this.volunteers.includes(val.participant_code);
        this.speakers.push({ displayName: val.display_name, id: val.participant_code, optedIn: optedIn });
      });
      this.speakers.sort(function (obj1, obj2) {
        return Number(obj2.optedIn) - Number(obj1.optedIn);
      });

      const b = this.cfr.resolveComponentFactory(SharingConvoCardsComponent);
      this.component = this.entry.createComponent(b);
      this.currentSpeakerIndex = 0;
      this.component.instance.activityState = this.activityState;
      this.component.instance.currentSpeaker = this.speakers[this.currentSpeakerIndex];
      this.sendMessage.emit(new SelectParticipantForShareEvent(this.speakers[this.currentSpeakerIndex].id));
      this.component.instance.update();
    } else if (this.activityState.activity_type === this.at.brainStorm) {
      const participantSet = cloneDeep(this.activityState.lesson_run.participant_set);
      this.speakers = [];

      participantSet.forEach((val, index) => {
        const optedIn = this.volunteers.includes(val.participant_code);
        this.speakers.push({ displayName: val.display_name, id: val.participant_code, optedIn: optedIn });
      });
      this.speakers.sort(function (obj1, obj2) {
        return Number(obj2.optedIn) - Number(obj1.optedIn);
      });

      const b = this.cfr.resolveComponentFactory(SharingBrainstormComponent);
      this.component = this.entry.createComponent(b);
      this.currentSpeakerIndex = 0;
      this.component.instance.data = this.activityState;
      this.component.instance.currentSpeaker = this.speakers[this.currentSpeakerIndex];
      this.component.instance.update();
    }
  }

  update() {
    if (this.activityState.activity_type !== this.at.caseStudy) {
      this.sendMessage.emit(new SelectParticipantForShareEvent(this.speakers[this.currentSpeakerIndex].id));
    } else {
      const selectedGroup = this.speakers[this.currentSpeakerIndex];
      const selectedParticipant = selectedGroup.group.participants[0];
      if (selectedParticipant) {
        this.sendMessage.emit(new SelectParticipantForShareEvent(selectedParticipant));
      } else {
        this.utilsService.openWarningNotification(`This group does not have any participants`, '');
      }
    }
    this.component.instance.currentSpeaker = this.speakers[this.currentSpeakerIndex];
    this.component.instance.update();
  }

  nextSpeaker() {
    if (this.currentSpeakerIndex < this.speakers.length - 1) {
      this.currentSpeakerIndex = this.currentSpeakerIndex + 1;
    } else {
      this.currentSpeakerIndex = 0;
    }
    this.update();
  }

  removeSpeaker(index: number) {
    console.log('remove speaker');
    if (index === this.currentSpeakerIndex) {
      this.nextSpeaker();
    }
    if (index > -1) {
      this.speakers.splice(index, 1);
    }
    this.update();
  }

  selectSpeaker(index: number) {
    // this.sendMessage.emit(new SelectParticipantForShareEvent(this.speakers[index].id));
    this.currentSpeakerIndex = index;
    this.populateFeedback();
    this.update();
  }

  populateFeedback() {
    this.feedbackArray = [];
    const participants = this.activityState.running_tools.share.feedback.participants;
    if (participants) {
      participants.forEach((participant) => {
        this.feedbackArray.push({ participant: participant.participant, 
          text: participant.text,  
          reaction: participant.reaction });
      });
    }
  }

  generateRandom() {
    this.currentSpeakerIndex = this.utilsService.randomIntFromInterval(0, this.speakers.length - 1);
  }

  changeOptedInUsers() {
    // const participantSet = cloneDeep(this.activityState.lesson_run.participant_set);
    if (this.activityState.activity_type === this.at.caseStudy) {
      this.speakers.forEach((speaker) => {
        const groups = cloneDeep(this.activityState.casestudyactivity.groups);
        groups.forEach((group) => {
          if (group.id === speaker.id) {
            let optedIn = false;
            this.volunteers.forEach((volunteer) => {
              if (group.participants.includes(volunteer)) {
                optedIn = true;
              }
            });
            speaker.optedIn = optedIn;
          }
        });
      });
    } else {
      this.speakers.forEach((speaker) => {
        if (this.volunteers.includes(speaker.id)) {
          speaker.optedIn = true;
        } else {
          speaker.optedIn = false;
        }
      });
    }
    this.speakers.sort(function (obj1, obj2) {
      return Number(obj2.optedIn) - Number(obj1.optedIn);
    });

    console.log(this.speakers);

    // this.speakers.push({ displayName: val.display_name, id: val.participant_code, optedIn: optedIn });
    // participantSet.forEach((val, index) => {
    //   const optedIn = this.volunteers.includes(val.participant_code);
    // });
  }
}
