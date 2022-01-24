import { Injectable } from '@angular/core';
import { differenceBy, find, findIndex, includes, remove } from 'lodash';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Board, BrainstormActivity, Category, Idea } from '../backend/schema';

@Injectable()
export class BrainstormService {
  saveIdea$ = new BehaviorSubject<any>(null);

  set saveIdea(l: any) {
    this.saveIdea$.next(l);
  }
  get saveIdea(): any {
    return this.saveIdea$.getValue();
  }

  selectedBoard$ = new BehaviorSubject<any>(null);

  set selectedBoard(l: any) {
    this.selectedBoard$.next(l);
  }
  get selectedBoard(): any {
    return this.selectedBoard$.getValue();
  }
  constructor() {}

  getMyGroup(userId, groups) {
    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];
      const groupParticipants = group.participants;
      if (groupParticipants.includes(userId)) {
        return group;
      }
    }
    return null;
  }

  getUserIdeas(userID: number, act: Board): Array<Idea> {
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

  addIdeaToCategory(act: Board, existingCategories) {
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

  ideaHearted(act: Board, existingCategories) {
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

  ideaCommented(act: Board, existingCategories) {
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

  ideasRemoved(act: Board, existingCategories) {
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
            for (let i = 0; i < myDifferences.length; i++) {
              const element = myDifferences[i];
              remove(existingCategory.brainstormidea_set, (idea: any) => idea.id === element.id);
            }
          }
        }
      });
    });
    return existingCategories;
  }

  ideaEdited(act: Board, existingCategories) {
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

  // Uncategorized

  uncategorizedIdeasRemoved(board, existingIdeas) {
    const newIdeas = this.uncategorizedPopulateIdeas(board);
    if (newIdeas.length === existingIdeas.length) {
    } else {
      const myDifferences: any = differenceBy(existingIdeas, newIdeas, 'id');
      for (let i = 0; i < myDifferences.length; i++) {
        const element = myDifferences[i];
        remove(existingIdeas, (idea: any) => idea.id === element.id);
      }
    }
  }

  uncategorizedPopulateIdeas(board) {
    const ideas = [];
    board.brainstormcategory_set.forEach((category) => {
      if (!category.removed && category.brainstormidea_set) {
        category.brainstormidea_set.forEach((idea: Idea) => {
          if (!idea.removed) {
            ideas.push({ ...idea, showClose: false });
          }
        });
      }
    });
    return ideas;
  }

  uncategorizedAddIdea(board, existingIdeas) {
    const newIdeas = this.uncategorizedPopulateIdeas(board);
    if (newIdeas.length === existingIdeas.length) {
    } else {
      const myDifferences = differenceBy(newIdeas, existingIdeas, 'id');
      existingIdeas.push(myDifferences[0]);
    }
  }

  uncategorizedIdeaCommented(board, existingIdeas: Array<Idea>) {
    const newIdeas = this.uncategorizedPopulateIdeas(board);
    newIdeas.forEach((newIdea: Idea) => {
      const existingIdea = find(existingIdeas, { id: newIdea.id });
      if (existingIdea.comments.length < newIdea.comments.length) {
        const myDifferences = differenceBy(newIdea.comments, existingIdea.comments, 'id');
        existingIdea.comments.push(myDifferences[0]);
      } else if (existingIdea.comments.length > newIdea.comments.length) {
        const myDifferences: Array<any> = differenceBy(existingIdea.comments, newIdea.comments, 'id');
        remove(existingIdea.comments, (idea: any) => idea.id === myDifferences[0].id);
      }
    });
  }

  uncategorizedIdeaHearted(board, existingIdeas: Array<Idea>) {
    const newIdeas = this.uncategorizedPopulateIdeas(board);
    newIdeas.forEach((newIdea: Idea) => {
      const existingIdea = find(existingIdeas, { id: newIdea.id });
      if (existingIdea.hearts.length < newIdea.hearts.length) {
        const myDifferences = differenceBy(newIdea.hearts, existingIdea.hearts, 'id');
        existingIdea.hearts.push(myDifferences[0]);
      } else if (existingIdea.hearts.length > newIdea.hearts.length) {
        const myDifferences: Array<any> = differenceBy(existingIdea.hearts, newIdea.hearts, 'id');
        remove(existingIdea.hearts, (idea: any) => idea.id === myDifferences[0].id);
      }
    });
  }

  uncategorizedIdeaEdited(board, existingIdeas: Array<Idea>) {
    const newIdeas = this.uncategorizedPopulateIdeas(board);
    newIdeas.forEach((newIdea: Idea, index) => {
      const existingIdeaIndex = findIndex(existingIdeas, { id: newIdea.id });
      if (existingIdeas[existingIdeaIndex].version < newIdea.version) {
        existingIdeas.splice(existingIdeaIndex, 1, newIdea);
      }
    });
  }
}
