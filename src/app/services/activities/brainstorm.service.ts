import { Injectable } from '@angular/core';
import { differenceBy, remove } from 'lodash';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { BrainstormActivity, Category, Idea } from '../backend/schema';

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

  addIdeaToCategory(act, existingCategories) {
    act.brainstormcategory_set.forEach((category, index) => {
      existingCategories.forEach((existingCategory) => {
        if (existingCategory.id === category.id) {
          const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
          if (BEIdeas.length === existingCategory.brainstormidea_set.length) {
          } else {
            const myDifferences = differenceBy(BEIdeas, existingCategory.brainstormidea_set, 'id');
            existingCategory.brainstormidea_set.push(myDifferences[0]);
          }
        }
      });
    });
    return existingCategories;
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

  ideaHearted(act, existingCategories) {
    act.brainstormcategory_set.forEach((category, categoryIndex) => {
      if (category.brainstormidea_set) {
        existingCategories.forEach((existingCategory) => {
          if (existingCategory.id === category.id) {
            const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
            BEIdeas.forEach((newIdea, ideaIndex) => {
              const existingIdeas: Array<Idea> = existingCategory.brainstormidea_set;
              let correspondingExistingIdea;
              for (const existingIdea of existingIdeas) {
                if (existingIdea.id === newIdea.id) {
                  correspondingExistingIdea = existingIdea;
                  break;
                }
              }

              const existingHearts = correspondingExistingIdea.hearts;
              const existingHeartsLength = existingHearts.length;
              const newHeartsLength = newIdea.hearts.length;
              if (existingHeartsLength < newHeartsLength) {
                const myDifferences = differenceBy(newIdea.hearts, existingHearts, 'id');
                existingHearts.push(myDifferences[0]);
              } else if (existingHeartsLength > newHeartsLength) {
                const myDifferences: Array<any> = differenceBy(existingHearts, newIdea.hearts, 'id');

                remove(existingHearts, (heart: any) => heart.id === myDifferences[0].id);
              }
            });
          }
        });
      }
    });
    return existingCategories;
  }

  ideaCommented(act: BrainstormActivity, existingCategories) {
    act.brainstormcategory_set.forEach((category, categoryIndex) => {
      if (category.brainstormidea_set) {
        existingCategories.forEach((existingCategory) => {
          if (existingCategory.id === category.id) {
            const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
            BEIdeas.forEach((newIdea, ideaIndex) => {
              const existingIdeas: Array<Idea> = existingCategory.brainstormidea_set;
              let correspondingExistingIdea;
              for (const existingIdea of existingIdeas) {
                if (existingIdea.id === newIdea.id) {
                  correspondingExistingIdea = existingIdea;
                  break;
                }
              }
              const existingHearts = correspondingExistingIdea.comments;
              const existingHeartsLength = existingHearts.length;
              const newHeartsLength = newIdea.comments.length;
              if (existingHeartsLength < newHeartsLength) {
                const myDifferences = differenceBy(newIdea.comments, existingHearts, 'id');
                existingHearts.push(myDifferences[0]);
              } else if (existingHeartsLength > newHeartsLength) {
                const myDifferences: Array<any> = differenceBy(existingHearts, newIdea.comments, 'id');

                remove(existingHearts, (heart: any) => heart.id === myDifferences[0].id);
              }
            });
          }
        });
      }
    });
    return existingCategories;
  }

  ideaRemoved(act: BrainstormActivity, existingCategories) {
    act.brainstormcategory_set.forEach((category, index) => {
      existingCategories.forEach((existingCategory) => {
        if (existingCategory.id === category.id) {
          const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
          if (BEIdeas.length === existingCategory.brainstormidea_set.length) {
          } else {
            const myDifferences: Array<any> = differenceBy(
              existingCategory.brainstormidea_set,
              BEIdeas,
              'id'
            );

            remove(existingCategory.brainstormidea_set, (idea: any) => idea.id === myDifferences[0].id);
          }
        }
      });
    });
    return existingCategories;
  }

  ideaEdited(act: BrainstormActivity, existingCategories) {
    act.brainstormcategory_set.forEach((category: Category, categoryIndex) => {
      if (category.brainstormidea_set) {
        const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
        existingCategories.forEach((existingCategory) => {
          if (existingCategory.id === category.id) {
            BEIdeas.forEach((newIdea, ideaIndex) => {
              const existingIdeas: Array<Idea> = existingCategory.brainstormidea_set;
              let correspondingExistingIdea;
              for (const existingIdea of existingIdeas) {
                if (existingIdea.id === newIdea.id) {
                  correspondingExistingIdea = existingIdea;
                  break;
                }
              }

              const existingVersionNo = correspondingExistingIdea.version;
              const newVersionNo = newIdea.version;
              if (existingVersionNo < newVersionNo) {
                existingCategory.brainstormidea_set.splice(ideaIndex, 1, newIdea);
              }
            });
          }
        });
      }
    });
    return existingCategories;
  }
}
