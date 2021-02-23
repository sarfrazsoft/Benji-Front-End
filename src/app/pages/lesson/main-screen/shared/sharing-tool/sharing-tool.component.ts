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
  speakers: Array<{ displayName: string; id: number }> = [];
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
      participantSet.forEach((val) => {
        this.speakers.push({ displayName: val.display_name, id: val.participant_code });
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
        this.speakers.push({ displayName: 'Room ' + val.group_num, id: val.id });
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
      //     overflow-y: auto;
      //     min-width: 400px;
      //     position: absolute;
      //     height: calc(100% - 70px);
      // }
      // https://www.on.mycarecompass.lifelabs.com/appointmentbooking?siteId=101&searchedAddress=mississauga&province=ON&openEarly=false&openSundays=false&wheelChairAccessible=false&doesECG=false&holterMonitoring=false&bloodPressureMonitoring=false&serveAutism=false&getCheckedOnline=false&openSaturdays=false&isCovid19TestingSite=false&glf=true
      const b = this.cfr.resolveComponentFactory(SharingCaseStudyComponent);
      this.component = this.entry.createComponent(b);
      this.currentSpeakerIndex = 0;
      this.component.instance.data = this.data;
      this.component.instance.currentSpeaker = this.speakers[this.currentSpeakerIndex];
      this.component.instance.update();
    }
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
