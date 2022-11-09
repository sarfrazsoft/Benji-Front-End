import { Injectable } from '@angular/core';
import { cloneDeep, differenceBy, find, findIndex, forOwn, includes, orderBy, remove, sortBy } from 'lodash';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { IdeaUserRole } from 'src/app/shared/components/idea-detailed/idea-detailed';
import {
  Board,
  BoardStatus,
  BrainstormActivity,
  BrainstormSubmitIdeaCommentResponse,
  Category,
  ColsCategoryChangeIdeaOrderInfo,
  Idea,
  PostOrder,
} from '../backend/schema';

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

  get meetingMode(): boolean {
    return this.meetingMode$.getValue();
  }
  set meetingMode(mode: boolean) {
    this.meetingMode$.next(mode);
  }

  get hostBoard(): number {
    return this.hostBoard$.getValue();
  }
  set hostBoard(h: number) {
    this.hostBoard$.next(h);
  }

  get lessonName(): string {
    return this.lessonName$.getValue();
  }
  set lessonName(mode: string) {
    this.lessonName$.next(mode);
  }

  get lessonDescription(): string {
    return this.lessonDescription$.getValue();
  }
  set lessonDescription(h: string) {
    this.lessonDescription$.next(h);
  }

  get lessonImage(): string {
    return this.lessonImage$.getValue();
  }
  set lessonImage(i: string) {
    this.lessonImage$.next(i);
  }

  get boardMode(): string {
    return this.boardMode$.getValue();
  }
  set boardMode(h: string) {
    this.boardMode$.next(h);
  }
  set boardTitle(l: string) {
    this.boardTitle$.next(l);
  }
  get boardTitle(): string {
    return this.boardTitle$.getValue();
  }

  constructor() {}
  uncategorizedIdeas;
  saveIdea$ = new BehaviorSubject<any>(null);
  selectedBoard$ = new BehaviorSubject<any>(null);
  meetingMode$ = new BehaviorSubject<boolean>(false);
  hostBoard$ = new BehaviorSubject<number>(null);
  lessonName$ = new BehaviorSubject<string>(null);
  lessonDescription$ = new BehaviorSubject<string>(null);
  lessonImage$ = new BehaviorSubject<string>(null);
  boardMode$ = new BehaviorSubject<string>(null);
  boardTitle$ = new BehaviorSubject<string>(null);

  boardInstructions$ = new BehaviorSubject<string>(null);
  set boardInstructions(l: string) {
    this.boardInstructions$.next(l);
  }
  get boardInstructions(): string {
    return this.boardInstructions$.getValue();
  }

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

  addIdeaToCategory(act: Board, existingCategories, callback) {
    let changedCategory: Category;
    act.brainstormcategory_set.forEach((category: Category, index) => {
      existingCategories.forEach((existingCategory) => {
        if (existingCategory.id === category.id) {
          const BEIdeas = category.brainstormidea_set.filter((idea) => !idea.removed);
          if (BEIdeas.length === existingCategory.brainstormidea_set.length) {
          } else {
            const myDifferences = differenceBy(BEIdeas, existingCategory.brainstormidea_set, 'id');
            existingCategory.brainstormidea_set.push(myDifferences[0]);
            changedCategory = cloneDeep(existingCategory);
          }
        }
      });
    });
    callback(changedCategory);
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
        category.brainstormidea_set = category.brainstormidea_set.filter((idea) => !idea.removed);
      } else {
        // Editor preview panel
      }
    });

    columns = board.brainstormcategory_set.filter((cat) => !cat.removed);

    return this.sortIdeas(board, columns);
  }

  sortIdeas(board: Board, columns) {
    if (board.sort === 'unsorted') {
      // do nothing
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        col.brainstormidea_set = col.brainstormidea_set.sort((a: Idea, b: Idea) => {
          return a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1;
        });
      }
      return columns;
    } else {
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
  }

  categoryChangedForIdea(board: Board, existingCategories, callback) {
    for (let i = 0; i < board.brainstormcategory_set.length; i++) {
      const BECategory = board.brainstormcategory_set[i];
      for (let j = 0; j < existingCategories.length; j++) {
        const existingCategory = existingCategories[j];
        if (BECategory.id === existingCategory.id) {
          BECategory.brainstormidea_set = BECategory.brainstormidea_set.filter(
            (idea) => idea && !idea.removed
          );
          existingCategory.brainstormidea_set = existingCategory.brainstormidea_set.filter(
            (idea) => idea && !idea.removed
          );
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
            diff.forEach((diffItem) => {
              if (diffItem) {
                const ideaIndex = findIndex(existingCategory.brainstormidea_set, { id: diffItem.id });
                existingCategory.brainstormidea_set.splice(ideaIndex, 1);
              }
            });
          }
        }
      }
    }
    // existingCategories = this.sortIdeas(board, existingCategories);
    callback(existingCategories);
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

  categorizedIdeaCommentAdded(
    newComment: BrainstormSubmitIdeaCommentResponse,
    existingCategories: Array<Category>
  ) {
    // we have existing categories and we have id of the idea
    for (let i = 0; i < existingCategories.length; i++) {
      const existingCategory: Category = existingCategories[i];
      const existingIdea = find(existingCategory.brainstormidea_set, { id: newComment.brainstormidea_id });
      if (existingIdea) {
        existingIdea.comments.push({
          comment: newComment.comment,
          id: newComment.id,
          participant: newComment.participant,
          comment_hearts: [],
          reply_comments: [],
        });
        break;
      }
    }
  }

  ideaCommented(act: Board, existingCategories: Array<Category>, callback?) {
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
    callback();
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
              if (element) {
                remove(existingCategory.brainstormidea_set, (idea: any) => idea.id === element.id);
              }
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

  updateIdeasPin(act: Board, existingCategories, callback?) {
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
    if (callback) {
      callback();
    }
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
      existingIdeas.push({ ...myDifferences[0], state: 'active' });
      callback();
    }
  }

  uncategorizedIdeaCommentAdded(existingIdeas: Array<Idea>, newComment: BrainstormSubmitIdeaCommentResponse) {
    const existingIdea = find(existingIdeas, { id: newComment.brainstormidea_id });
    existingIdea.comments.push({
      comment: newComment.comment,
      id: newComment.id,
      participant: newComment.participant,
      comment_hearts: [],
      reply_comments: [],
    });
  }

  uncategorizedIdeaCommented(newboard, existingIdeas: Array<Idea>) {
    const newIdeas = this.uncategorizedPopulateIdeas(newboard);
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
    // callback(existingIdeas);
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
        existingIdeas[existingIdeaIndex].meta = newIdea.meta;
      }
    });
  }

  uncategorizedSortIdeas(board: Board, existingIdeas: Array<Idea>) {
    // sort based on time first and then by the selected filter
    existingIdeas.sort((a: Idea, b: Idea) => {
      return Number(moment(b.time)) - Number(moment(a.time));
    });
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

  sortIdeasOnRank(board: Board, existingIdeas: Array<Idea>, ranks: Array<PostOrder>) {
    // sort based on time first and then by the selected filter
    existingIdeas.sort((a: Idea, b: Idea) => {
      const rankA = ranks.find((x) => a.id.toString() === x.ideaId);
      const rankB = ranks.find((x) => b.id.toString() === x.ideaId);
      return Number(rankA.order) - Number(rankB.order);
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

  getUserRole(
    participantCode,
    item,
    boardStatus: BoardStatus
  ): { userRole: IdeaUserRole; submittingUser: number } {
    let userRole: IdeaUserRole;
    let submittingUser: any;
    if (participantCode) {
      userRole = 'viewer';
    } else {
      // viewing user is the host
      userRole = 'owner';
    }

    if (item && item.submitting_participant && userRole !== 'owner') {
      submittingUser = item.submitting_participant.participant_code;
      if (submittingUser === participantCode) {
        userRole = 'owner';
      } else {
        userRole = 'viewer';
      }
    }

    return { userRole: userRole, submittingUser: submittingUser };
  }

  canViewIdea(boardStatus: BoardStatus, userRole: IdeaUserRole, isHost: boolean) {
    if (boardStatus === 'private' && userRole === 'owner') {
      return true;
    } else if (boardStatus === 'open' || boardStatus === 'view_only') {
      return true;
    } else if (boardStatus === 'closed' && isHost) {
      return true;
    }
    return false;
  }

  getParticipantBoard(act: BrainstormActivity, participantCode: number): Board | null {
    let selectedBoard: Board;
    const boardParticipants = act.participants;
    if (boardParticipants) {
      forOwn(boardParticipants, (boardParticipantArray, participantsBoardId) => {
        for (let i = 0; i < boardParticipantArray.length; i++) {
          const pCode = boardParticipantArray[i];
          if (pCode === participantCode) {
            act.boards.forEach((board) => {
              if (Number(participantsBoardId) === board.id) {
                selectedBoard = board;
              }
            });
          }
        }
      });
    }
    if (selectedBoard) {
      return selectedBoard;
    } else {
      return null;
    }
  }

  getParticipantBoardFromList(boards: Array<Board>, participantsBoardId: number): Board {
    let selectedBoard: Board;
    boards.forEach((board) => {
      if (participantsBoardId === board.id) {
        selectedBoard = board;
      }
    });
    return selectedBoard;
  }
}
