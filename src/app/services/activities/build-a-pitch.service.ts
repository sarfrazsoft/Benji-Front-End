import { Injectable } from '@angular/core';
import { BuildAPitchActivity } from '../backend/schema';

@Injectable()
export class BuildAPitchService {
  blanksArray;
  constructor() {}

  getBlanks(blanksString: string) {
    const json = JSON.parse(blanksString);
    this.blanksArray = [];
    this.populateBlanksArray(json);
    return this.blanksArray;
  }

  populateBlanksArray(json) {
    if (json.content) {
      for (let i = 0; i < json.content.length; i++) {
        this.populateBlanksArray(json.content[i]);
      }
    } else if (json.type === 'text') {
      if (json.marks) {
        let isUnderline = false;
        for (let i = 0; i < json.marks.length; i++) {
          if (json.marks[i].type === 'u') {
            isUnderline = true;
            this.blanksArray.push({ type: 'blank', temp_text: json.text });
          }
        }
        if (isUnderline) {
        } else {
          this.blanksArray.push({ type: 'label', label: json.text });
        }
      } else {
        this.blanksArray.push({ type: 'label', label: json.text });
      }
      return;
    }
  }

  getPitchText(participantCode: number, act: BuildAPitchActivity, sharingTool = false) {
    let parsedBlanks = this.getBlanks(act.blanks_string);
    parsedBlanks = parsedBlanks.filter((e) => e.type === 'label');
    const blanks = act.buildapitchblank_set;
    const buildAPitchPitchSet = act.buildapitchpitch_set.filter(
      (e) => e.participant.participant_code === participantCode
    );

    let statement = '';
    if (buildAPitchPitchSet[0]) {
      let buildAPitchEntrySet = buildAPitchPitchSet[0].buildapitchentry_set;
      buildAPitchEntrySet = buildAPitchEntrySet.sort((a, b) => a.order - b.order);
      parsedBlanks.forEach((b, i) => {
        const currentBlanksValue = buildAPitchEntrySet[i];

        let value = '';
        if (currentBlanksValue) {
          if (sharingTool) {
            value = ' <em class="primary-color">' + currentBlanksValue.value + '</em> ';
          } else {
            value = ' <em>' + currentBlanksValue.value + '</em> ';
          }
        } else {
          // value = ' <em class="warning-color">(' + b.temp_text ? b.temp_text : '' + ')</em> ';
        }
        statement = statement + b.label + value;
      });
    }
    return statement;
  }
}
