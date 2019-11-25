import { Component, Input, OnInit } from '@angular/core';
import {
  ActivityReport,
  PitchoMaticBlank
} from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-pitch-details',
  templateUrl: './pitch-details.component.html',
  styleUrls: ['./pitch-details.component.scss']
})
export class PitchDetailsComponent implements OnInit {
  @Input() pomData: ActivityReport;
  pitchText = '';
  pitchNotes = '';
  userId = 2;
  constructor() {}

  ngOnInit() {
    this.pitchText = this.getUserPitchPrompt();
    this.pitchNotes = this.getUserPitchNotes();
  }

  getUserPitchPrompt() {
    const blank_set: Array<PitchoMaticBlank> = this.pomData.pom
      .pitchomaticblank_set;
    blank_set.sort((a, b) => a.order - b.order);

    const currentUserID = 2;
    let currentMember: any;

    this.pomData.pom.pitchomaticgroupmembers.forEach(member => {
      if (member.user.id === currentUserID) {
        currentMember = member;
      }
    });

    const pitch_set = [];

    blank_set.forEach(blank => {
      const choice = currentMember.pitch.pitchomaticgroupmemberpitchchoice_set.filter(
        el => {
          return el.pitchomaticblank === blank.id;
        }
      )[0].choice;

      const value = blank.pitchomaticblankchoice_set.filter(el => {
        return el.id === choice;
      })[0].value;

      pitch_set.push({
        id: blank.id,
        label: blank.label,
        order: blank.order,
        value: value
      });
    });

    let pitchText = '';
    const helpText = ['Pitch', 'to', 'using'];
    pitch_set.forEach((v, i) => {
      pitchText =
        pitchText +
        helpText[i] +
        ' <em class="primary-color">' +
        v.value +
        '</em> ';
    });
    return pitchText;
  }

  getUserPitchNotes() {
    const currentUserID = 2;
    let currentMember: any;

    this.pomData.pom.pitchomaticgroupmembers.forEach(member => {
      if (member.user.id === currentUserID) {
        currentMember = member;
      }
    });

    return currentMember.pitch_prep_text;
  }
}
