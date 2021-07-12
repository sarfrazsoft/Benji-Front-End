import { Injectable } from '@angular/core';
import { BuildAPitchActivity } from '../backend/schema';

@Injectable()
export class BuildAPitchService {
  constructor() {}

  getPitchText(participantCode: number, act: BuildAPitchActivity, sharingTool = false) {
    act.buildapitchblank_set.sort((a, b) => a.order - b.order);
    const blanks = act.buildapitchblank_set;
    const buildAPitchPitchSet = act.buildapitchpitch_set.filter(
      (e) => e.participant.participant_code === participantCode
    );

    let statement = '';
    if (buildAPitchPitchSet[0]) {
      const buildAPitchEntrySet = buildAPitchPitchSet[0].buildapitchentry_set;
      blanks.forEach((b, i) => {
        const currentBlanksValue = buildAPitchEntrySet.filter((v) => v.buildapitchblank === b.id);

        let value = '';
        if (currentBlanksValue.length === 1) {
          if (sharingTool) {
            value = ' <em class="primary-color">' + currentBlanksValue[0].value + '</em> ';
          } else {
            value = ' <em>' + currentBlanksValue[0].value + '</em> ';
          }
        } else {
          value = ' <em class="warning-color">(' + b.temp_text + ')</em> ';
        }
        statement = statement + b.label + value;
      });
    }
    return statement;
  }
}
