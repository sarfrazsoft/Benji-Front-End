import { Injectable } from '@angular/core';
import { differenceBy, remove } from 'lodash';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BrainstormActivity, Idea } from '../backend/schema';

@Injectable()
export class BrainstormService {
  saveIdea$ = new BehaviorSubject<any>(null);

  set saveIdea(l: any) {
    this.saveIdea$.next(l);
  }
  get saveIdea(): any {
    return this.saveIdea$.getValue();
  }
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

  addIdeaToCategory(act, columns) {
    act.brainstormcategory_set.forEach((category, index) => {
      const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
      if (BEIdeas.length === columns[index].brainstormidea_set.length) {
      } else {
        const myDifferences = differenceBy(BEIdeas, columns[index].brainstormidea_set, 'id');
        columns[index].brainstormidea_set.push(myDifferences[0]);
      }
    });
    return columns;
  }

  populateCategories(act, columns) {
    columns = [];
    act.brainstormcategory_set.forEach((category) => {
      if (category.brainstormidea_set) {
        category.brainstormidea_set.forEach((idea) => {
          idea = { ...idea, showClose: false, editing: false, addingIdea: false };
        });
      } else {
        // Editor preview panel
      }
    });
    columns = act.brainstormcategory_set;
    return columns;
  }

  ideaHearted(act, columns) {
    act.brainstormcategory_set.forEach((category, categoryIndex) => {
      if (category.brainstormidea_set) {
        const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
        BEIdeas.forEach((idea, ideaIndex) => {
          const existingHearts = columns[categoryIndex].brainstormidea_set[ideaIndex].hearts;
          const existingHeartsLength = existingHearts.length;
          const newHeartsLength = idea.hearts.length;
          if (existingHeartsLength < newHeartsLength) {
            const myDifferences = differenceBy(idea.hearts, existingHearts, 'id');
            existingHearts.push(myDifferences[0]);
          } else if (existingHeartsLength > newHeartsLength) {
            const myDifferences: Array<any> = differenceBy(existingHearts, idea.hearts, 'id');

            remove(existingHearts, (heart: any) => heart.id === myDifferences[0].id);
          }
        });
      }
    });
    return columns;
  }

  ideaCommented(act, columns) {
    act.brainstormcategory_set.forEach((category, categoryIndex) => {
      if (category.brainstormidea_set) {
        const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
        BEIdeas.forEach((idea, ideaIndex) => {
          const existingHearts = columns[categoryIndex].brainstormidea_set[ideaIndex].comments;
          const existingHeartsLength = existingHearts.length;
          const newHeartsLength = idea.comments.length;
          if (existingHeartsLength < newHeartsLength) {
            const myDifferences = differenceBy(idea.comments, existingHearts, 'id');
            existingHearts.push(myDifferences[0]);
          } else if (existingHeartsLength > newHeartsLength) {
            const myDifferences: Array<any> = differenceBy(existingHearts, idea.comments, 'id');

            remove(existingHearts, (heart: any) => heart.id === myDifferences[0].id);
          }
        });
      }
    });
    return columns;
  }

  ideaRemoved(act, columns) {
    act.brainstormcategory_set.forEach((category, index) => {
      const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
      if (BEIdeas.length === columns[index].brainstormidea_set.length) {
      } else {
        const myDifferences: Array<any> = differenceBy(columns[index].brainstormidea_set, BEIdeas, 'id');

        remove(columns[index].brainstormidea_set, (idea: any) => idea.id === myDifferences[0].id);
      }
    });
    return columns;
  }
}
