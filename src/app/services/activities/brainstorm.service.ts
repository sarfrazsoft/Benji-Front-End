import { Injectable } from '@angular/core';
import { BrainstormActivity, Idea } from '../backend/schema';

@Injectable()
export class BrainstormService {
  constructor() {}

  getUserIdeas(userID: number, act: BrainstormActivity): Array<Idea> {
    const arr: Array<Idea> = [];
    act.brainstormcategory_set.forEach((category) => {
      if (!category.removed) {
        category.brainstormidea_set.forEach((idea) => {
          if (!idea.removed) {
            if (
              idea &&
              idea.submitting_participant &&
              idea.submitting_participant.participant_code === userID
            ) {
              arr.push(idea);
            }
          }
        });
      }
    });
    return arr;
  }
}
