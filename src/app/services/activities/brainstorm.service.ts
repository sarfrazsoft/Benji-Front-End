import { Injectable } from '@angular/core';
import { differenceBy, find, findIndex, includes, orderBy, remove, sortBy } from 'lodash';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Board, BrainstormActivity, Category, Idea } from '../backend/schema';

@Injectable()
export class BrainstormService {
  set saveIdea(l: any) {
    this.saveIdea$.next(l);
  }
  get saveIdea(): any {
    return this.saveIdea$.getValue();
  }

  set selectedBoard(l: any) {
    this.selectedBoard$.next(l);
  }
  get selectedBoard(): any {
    return this.selectedBoard$.getValue();
  }
  constructor() {}
  uncategorizedIdeas;

  saveIdea$ = new BehaviorSubject<any>(null);

  selectedBoard$ = new BehaviorSubject<any>(null);

  getDraftC;

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

  populateCategories(board: Board, columns) {
    columns = [];
    board.brainstormcategory_set.sort((a, b) => {
      return a.id - b.id;
      // return b.id - a.id;
    });
    board.brainstormcategory_set.forEach((category) => {
      if (category.brainstormidea_set) {
        category.brainstormidea_set.forEach((idea) => {
          idea = { ...idea, showClose: false, editing: false, addingIdea: false };
        });
      } else {
        // Editor preview panel
      }
    });

    columns = board.brainstormcategory_set;

    return this.sortIdeas(board, columns);
  }

  sortIdeas(board: Board, columns) {
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      col.brainstormidea_set = col.brainstormidea_set.sort((a, b) => {
        if (board.sort === 'newest_to_oldest') {
          return Number(moment(b.time)) - Number(moment(a.time));
        } else if (board.sort === 'oldest_to_newest') {
          return Number(moment(a.time)) - Number(moment(b.time));
        } else if (board.sort === 'likes') {
          return b.hearts.length - a.hearts.length;
        } else {
          return Number(moment(a.time)) - Number(moment(b.time));
        }
      });

      col.brainstormidea_set = col.brainstormidea_set.sort((a: Idea, b: Idea) => {
        return a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1;
      });
    }
    return columns;
  }

  categoryChangedForIdea(board: Board, existingCategories) {
    for (let i = 0; i < board.brainstormcategory_set.length; i++) {
      const BECategory = board.brainstormcategory_set[i];
      for (let j = 0; j < existingCategories.length; j++) {
        const existingCategory = existingCategories[j];
        if (BECategory.id === existingCategory.id) {
          if (BECategory.brainstormidea_set.length > existingCategory.brainstormidea_set.length) {
            // if the number of ideas are  greater in the BE category
            // then the idea was added here
            const diff = differenceBy(
              BECategory.brainstormidea_set,
              existingCategory.brainstormidea_set,
              'id'
            );
            existingCategory.brainstormidea_set.push(diff[0]);
          } else if (BECategory.brainstormidea_set.length < existingCategory.brainstormidea_set.length) {
            const diff: any = differenceBy(
              existingCategory.brainstormidea_set,
              BECategory.brainstormidea_set,
              'id'
            );
            const ideaIndex = findIndex(existingCategory.brainstormidea_set, { id: diff[0].id });
            existingCategory.brainstormidea_set.splice(ideaIndex, 1);
          }
        }
      }
    }
    return existingCategories;
  }

  ideaHearted(act: Board, existingCategories, callback) {
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
    callback(existingCategories);
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
                correspondingExistingIdea.version = newIdea.version;
                correspondingExistingIdea.title = newIdea.title;
                correspondingExistingIdea.idea = newIdea.idea;
                correspondingExistingIdea.idea_document = newIdea.idea_document;
                correspondingExistingIdea.idea_image = newIdea.idea_image;
                correspondingExistingIdea.idea_video = newIdea.idea_video;
              }
            });
          }
        });
      }
    });
    return existingCategories;
  }

  updateIdeasPin(act: Board, existingCategories) {
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

              if (newIdea.pinned) {
                if (!correspondingExistingIdea.pinned) {
                  correspondingExistingIdea.pinned = true;
                }
              } else if (!newIdea.pinned) {
                if (correspondingExistingIdea.pinned) {
                  correspondingExistingIdea.pinned = false;
                }
              }
            });
          }
        });
      }
    });
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
    return this.uncategorizedSortIdeas(board, ideas);
  }

  uncategorizedAddIdea(board, existingIdeas, callback) {
    const newIdeas = this.uncategorizedPopulateIdeas(board);
    if (newIdeas.length === existingIdeas.length) {
    } else {
      const myDifferences = differenceBy(newIdeas, existingIdeas, 'id');
      existingIdeas.push(myDifferences[0]);
      callback();
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

  uncategorizedIdeaHearted(board, existingIdeas: Array<Idea>, callback) {
    const newIdeas = this.uncategorizedPopulateIdeas(board);
    // return newIdeas;
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
    // callback(newIdeas);
  }

  uncategorizedIdeaEdited(board, existingIdeas: Array<Idea>) {
    const newIdeas = this.uncategorizedPopulateIdeas(board);
    newIdeas.forEach((newIdea: Idea, index) => {
      const existingIdeaIndex = findIndex(existingIdeas, { id: newIdea.id });
      if (existingIdeas[existingIdeaIndex].version < newIdea.version) {
        existingIdeas[existingIdeaIndex].version = newIdea.version;
        existingIdeas[existingIdeaIndex].title = newIdea.title;
        existingIdeas[existingIdeaIndex].idea = newIdea.idea;
        existingIdeas[existingIdeaIndex].idea_document = newIdea.idea_document;
        existingIdeas[existingIdeaIndex].idea_image = newIdea.idea_image;
        existingIdeas[existingIdeaIndex].idea_video = newIdea.idea_video;
      }
    });
  }

  uncategorizedSortIdeas(board: Board, existingIdeas: Array<Idea>) {
    existingIdeas = existingIdeas.sort((a: Idea, b: Idea) => {
      if (board.sort === 'newest_to_oldest') {
        return Number(moment(b.time)) - Number(moment(a.time));
      } else if (board.sort === 'oldest_to_newest') {
        return Number(moment(a.time)) - Number(moment(b.time));
      } else if (board.sort === 'likes') {
        return b.hearts.length - a.hearts.length;
      } else {
        return Number(moment(a.time)) - Number(moment(b.time));
      }
    });
    existingIdeas = existingIdeas.sort((a: Idea, b: Idea) => {
      return a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1;
    });
    return existingIdeas;
  }

  uncategorizedUpdateIdeasPin(board: Board, existingIdeas: Array<Idea>) {
    const newIdeas = this.uncategorizedPopulateIdeas(board);
    newIdeas.forEach((newIdea: Idea) => {
      const existingIdea = find(existingIdeas, { id: newIdea.id });
      if (newIdea.pinned) {
        if (!existingIdea.pinned) {
          existingIdea.pinned = true;
        }
      } else if (!newIdea.pinned) {
        if (existingIdea.pinned) {
          existingIdea.pinned = false;
        }
      }
    });
  }

  saveDraftComment(commentKey: string, commentText: string) {
    localStorage.setItem(commentKey, commentText);
  }

  getDraftComment(commentKey: string) {
    if (localStorage.getItem(commentKey)) {
      return localStorage.getItem(commentKey);
    }
  }

  removeDraftComment(commentKey) {
    if (localStorage.getItem(commentKey)) {
      return localStorage.removeItem(commentKey);
    }
  }
}
