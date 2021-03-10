import { Injectable } from '@angular/core';
import { WhereDoYouStandActivity, WhereDoYouStandChoice } from '../backend/schema/activities/activities';

@Injectable()
export class EitherOrActivityService {
  constructor() {}

  getGroupChoice(state: WhereDoYouStandActivity, type: string): WhereDoYouStandChoice {
    const stats = state.choice_stats;
    const res = Math.max.apply(
      Math,
      stats.map(function (o) {
        return o[type];
      })
    );

    const pref = stats.find(function (o) {
      return o[type] === res;
    });

    if (state.left_choice.id === pref.id) {
      return state.left_choice;
    } else {
      return state.right_choice;
    }
  }
}
