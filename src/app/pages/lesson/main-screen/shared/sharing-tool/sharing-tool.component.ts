import {
  Component,
  ComponentFactoryResolver,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { cloneDeep } from 'lodash';
import { ActivityTypes } from 'src/app/globals';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { SharingBuildAPitchComponent, SharingCaseStudyComponent } from './index';

@Component({
  selector: 'benji-sharing-tool',
  templateUrl: './sharing-tool.component.html',
  styleUrls: ['./sharing-tool.component.scss'],
})
export class SharingToolComponent implements OnInit {
  at: typeof ActivityTypes = ActivityTypes;
  // speakers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
  speakers: Array<{ displayName: string; id: number; optedIn: boolean }> = [];
  groups = [];
  currentSpeakerIndex = 0;
  component;
  @Input() data: UpdateMessage;
  @ViewChild('activityEntry', { read: ViewContainerRef, static: true }) entry: ViewContainerRef;
  constructor(private cfr: ComponentFactoryResolver) {}

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.activity_type === this.at.buildAPitch) {
      const participantSet = cloneDeep(this.data.lesson_run.participant_set);
      participantSet.forEach((val, index) => {
        if (index === 1) {
          this.speakers.push({ displayName: val.display_name, id: val.participant_code, optedIn: true });
        } else {
          this.speakers.push({ displayName: val.display_name, id: val.participant_code, optedIn: false });
        }
      });

      const b = this.cfr.resolveComponentFactory(SharingBuildAPitchComponent);
      this.component = this.entry.createComponent(b);
      this.currentSpeakerIndex = 0;
      this.component.instance.data = this.data;
      this.component.instance.currentSpeaker = this.speakers[this.currentSpeakerIndex];
      this.component.instance.update();
    } else if (this.data.activity_type === this.at.caseStudy) {
      const groups = cloneDeep(this.data.casestudyactivity.groups);
      groups.forEach((val) => {
        this.speakers.push({ displayName: 'Room ' + val.group_num, id: val.id, optedIn: false });
      });
      this.data.casestudyactivity.groups.forEach((val, index) => {
        val['caseStudyGroupText'] =
          index +
          '' +
          'we wrote this text on Friday we wrote this text on Friday we wrote this text on Friday ' +
          'we wrote this text on Friday we wrote this text on Friday we wrote this text on Friday ' +
          'we wrote this text on Friday we wrote this text on Friday we wrote this text on Friday ' +
          'we wrote this text on Friday we wrote this text on Friday we wrote this text on Friday ' +
          'we wrote this text on Fridaywe wrote this text on Fridaywe wrote this text on Friday ';
      });

      const b = this.cfr.resolveComponentFactory(SharingCaseStudyComponent);
      this.component = this.entry.createComponent(b);
      this.currentSpeakerIndex = 0;
      this.component.instance.data = this.data;
      this.component.instance.currentSpeaker = this.speakers[this.currentSpeakerIndex];
      this.component.instance.update();
    }
    this.speakers.sort(function (obj1, obj2) {
      return Number(obj2.optedIn) - Number(obj1.optedIn);
    });
  }

  update() {
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
    console.log('select speaker');
    this.currentSpeakerIndex = index;
    this.update();
  }
}
