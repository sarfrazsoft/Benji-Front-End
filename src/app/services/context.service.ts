import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { find, forOwn, remove } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import {
  BrainstormBoardSortOrderResponse,
  BrainstormChangeBoardStatusResponse,
  BrainstormChangeModeResponse,
  BrainstormRemoveIdeaCommentResponse,
  BrainstormRemoveIdeaHeartResponse,
  BrainstormSubmitIdeaCommentResponse,
  BrainstormSubmitIdeaHeartResponse,
  BrainstormToggleAllowCommentResponse,
  BrainstormToggleAllowHeartResponse,
  BrainstormToggleParticipantNameResponse,
  HostChangeBoardEventResponse,
  ParticipantChangeBoardResponse,
} from 'src/app/services/backend/schema/event-responses';
import { Board, Category, TeamUser, Timer, UpdateMessage } from './backend/schema';
import { Participant } from './backend/schema/course_details';
import { PartnerInfo } from './backend/schema/whitelabel_info';

export type SideNavAction = 'opened' | 'closed';
@Injectable()
export class ContextService {
  constructor(private http: HttpClient, private router: Router) {}

  set user(user: TeamUser) {
    this.user$.next(user);
  }
  get user(): TeamUser {
    return this.user$.getValue();
  }

  set brandingInfo(brandingInfo: any) {
    this.brandingInfo$.next(brandingInfo);
  }
  get brandingInfo(): any {
    return this.brandingInfo$.getValue();
  }

  set lessons(lessons: any) {
    this.lessons$.next(lessons);
  }
  get lessons(): any {
    return this.lessons$.getValue();
  }

  set lesson(lesson: any) {
    this.lesson$.next(lesson);
  }
  get lesson(): any {
    return this.lesson$.getValue();
  }

  set partnerInfo(partnerInfo: PartnerInfo) {
    this.partnerInfo$.next(partnerInfo);
  }
  get partnerInfo(): PartnerInfo {
    return this.partnerInfo$.getValue();
  }

  set activityTimer(activityTimer: Timer) {
    this.activityTimer$.next(activityTimer);
  }
  get activityTimer(): Timer {
    return this.activityTimer$.getValue();
  }

  set showTimerSubject(activityTimer: boolean) {
    this.showTimerSubject$.next(activityTimer);
  }

  get showTimerSubject(): boolean {
    return this.showTimerSubject$.getValue();
  }

  set sideNavAction(v: SideNavAction) {
    this.sideNavAction$.next(v);
  }

  get sideNavAction(): SideNavAction {
    return this.sideNavAction$.getValue();
  }

  public set participant(v: Participant) {
    this.p = v;
  }

  public get particiapnt(): Participant {
    return this.p;
  }

  set folders(folders: any) {
    this.folders$.next(folders);
  }
  get folders(): any {
    return this.folders$.getValue();
  }

  set selectedFolder(folder: any) {
    this.selectedFolder$.next(folder);
  }
  get selectedFolder(): number {
    return this.selectedFolder$.getValue();
  }

  set newFolderAdded(value: boolean) {
    this.newFolderAdded$.next(value);
  }
  get newFolderAdded(): boolean {
    return this.newFolderAdded$.getValue();
  }

  /**
   * Current User
   */
  user$ = new BehaviorSubject<TeamUser>(null);

  /**
   * Branding Info
   */
  brandingInfo$ = new BehaviorSubject<any>(null);

  /**
   * Courses
   */
  lessons$ = new BehaviorSubject<any>(null);

  /**
   * Course
   */
  lesson$ = new BehaviorSubject<any>(null);

  /**
   * Current partner details
   */
  partnerInfo$ = new BehaviorSubject<PartnerInfo>(null);

  /**
   * Activity timer
   */
  activityTimer$ = new BehaviorSubject<Timer>(null);

  /**
   * Activity timer
   */
  showTimerSubject$ = new BehaviorSubject<boolean>(null);

  /**
   * Activity timer
   */
  sideNavAction$ = new BehaviorSubject<SideNavAction>(null);

  /**
   * participant
   */
  p: Participant;

  /**
   * folders
   */
  folders$ = new BehaviorSubject<any>(null);

  /**
   * Selected Folder
   */
  selectedFolder$ = new BehaviorSubject<any>(null);

  /**
   * Notify if new Folder added
   */
  newFolderAdded$ = new BehaviorSubject<any>(null);

  destroyActivityTimer() {
    this.activityTimer$.next(null);
  }

  removeCommentFromActivityState(
    removedComment: BrainstormRemoveIdeaCommentResponse,
    oldActivityState: UpdateMessage
  ) {
    // we have existing categories and we have id of the idea
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const board: Board = oldBoards[i];
      if (board.id === removedComment.board_id) {
        for (let j = 0; j < board.brainstormcategory_set.length; j++) {
          const oldCategory = board.brainstormcategory_set[j];
          const existingIdea = find(oldCategory.brainstormidea_set, {
            id: removedComment.brainstormidea_id,
          });
          if (existingIdea) {
            remove(existingIdea.comments, (comment) => comment.id === Number(removedComment.comment_id));
            break;
          }
        }
      }
    }
  }

  addCommentToActivityState(
    newComment: BrainstormSubmitIdeaCommentResponse,
    oldActivityState: UpdateMessage
  ) {
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const categorySet: Array<Category> = oldBoards[i].brainstormcategory_set;
      for (let j = 0; j < categorySet.length; j++) {
        const existingCategory = categorySet[j];
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
  }

  brainstormSubmitIdeaHeart(res: BrainstormSubmitIdeaHeartResponse, oldActivityState: UpdateMessage) {
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const categorySet: Array<Category> = oldBoards[i].brainstormcategory_set;
      for (let j = 0; j < categorySet.length; j++) {
        const existingCategory = categorySet[j];
        const existingIdea = find(existingCategory.brainstormidea_set, { id: res.brainstormidea_id });
        if (existingIdea) {
          existingIdea.hearts.push({
            id: res.id,
            participant: res.participant,
          });
          break;
        }
      }
    }
  }

  brainstormRemovedIdeaHeart(res: BrainstormRemoveIdeaHeartResponse, oldActivityState: UpdateMessage) {
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const categorySet: Array<Category> = oldBoards[i].brainstormcategory_set;
      for (let j = 0; j < categorySet.length; j++) {
        const existingCategory = categorySet[j];
        const existingIdea = find(existingCategory.brainstormidea_set, { id: res.brainstormidea_id });
        if (existingIdea) {
          remove(existingIdea.hearts, (heart) => heart.id === res.heart_id);
          break;
        }
      }
    }
  }

  changeHostBoardInActivityState(hostBoard: HostChangeBoardEventResponse, oldActivityState: UpdateMessage) {
    oldActivityState.brainstormactivity.host_board = hostBoard.host_board;
  }

  changeParticipantBoardInActivityState(
    participantBoard: ParticipantChangeBoardResponse,
    oldActivityState: UpdateMessage,
    participantCode: number
  ) {
    forOwn(oldActivityState.brainstormactivity.participants, function (value, key) {
      remove(value, (code) => code === participantCode);
      if (key === participantBoard.board_id.toString()) {
        value.push(participantCode);
      }
    });
  }

  changeBoardStatus(statusChange: BrainstormChangeBoardStatusResponse, oldActivityState: UpdateMessage) {
    // we have existing categories and we have id of the idea
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const board: Board = oldBoards[i];
      if (board.id === statusChange.board_id) {
        board.status = statusChange.status;
        break;
      }
    }
  }

  changeBoardToggleParticipantName(
    res: BrainstormToggleParticipantNameResponse,
    oldActivityState: UpdateMessage
  ) {
    // we have existing categories and we have id of the idea
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const board: Board = oldBoards[i];
      if (board.id === res.board_id) {
        board.board_activity.show_participant_name_flag = res.show_participant_name_flag;
        break;
      }
    }
  }

  changeBoardSortOrder(sortOrder: BrainstormBoardSortOrderResponse, oldActivityState: UpdateMessage) {
    // we have existing categories and we have id of the idea
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const board: Board = oldBoards[i];
      if (board.id === sortOrder.board_id) {
        board.sort = sortOrder.sort;
        break;
      }
    }
  }

  brainstormToggleAllowComment(
    allowComment: BrainstormToggleAllowCommentResponse,
    oldActivityState: UpdateMessage
  ) {
    // we have existing categories and we have id of the idea
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const board: Board = oldBoards[i];
      if (board.id === allowComment.board_id) {
        board.allow_comment = allowComment.allow_comment;
        break;
      }
    }
  }

  brainstormToggleAllowHeart(
    allowHeart: BrainstormToggleAllowHeartResponse,
    oldActivityState: UpdateMessage
  ) {
    // we have existing categories and we have id of the idea
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const board: Board = oldBoards[i];
      if (board.id === allowHeart.board_id) {
        board.allow_heart = allowHeart.allow_heart;
        break;
      }
    }
  }

  brainstormChangeMode(res: BrainstormChangeModeResponse, oldActivityState: UpdateMessage) {
    // we have existing categories and we have id of the idea
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const board: Board = oldBoards[i];
      if (board.id === res.board_id) {
        board.board_activity.mode = res.mode;
        break;
      }
    }
  }
}
