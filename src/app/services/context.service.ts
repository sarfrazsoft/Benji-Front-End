import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { cloneDeep, find, findIndex, forOwn, remove } from 'lodash';
import { BehaviorSubject } from 'rxjs';
import {
  BrainstormAddBoardResponse,
  BrainstormAddRemoveIdeaPinResponse,
  BrainstormBoardPostSizeResponse,
  BrainstormBoardSortOrderResponse,
  BrainstormChangeBoardStatusResponse,
  BrainstormChangeModeResponse,
  BrainstormCreateCategoryResponse,
  BrainstormEditResponse,
  BrainstormRearrangeBoardResponse,
  BrainstormRemoveBoardResponse,
  BrainstormRemoveCategoryResponse,
  BrainstormRemoveCommentHeartResponse,
  BrainstormRemoveIdeaCommentResponse,
  BrainstormRemoveIdeaHeartResponse,
  BrainstormRemoveSubmitResponse,
  BrainstormRenameCategoryResponse,
  BrainstormSetCategoryResponse,
  BrainstormSubmitIdeaCommentResponse,
  BrainstormSubmitIdeaHeartResponse,
  BrainstormSubmitResponse,
  BrainstormToggleAllowCommentResponse,
  BrainstormToggleAllowHeartResponse,
  BrainstormToggleParticipantNameResponse,
  HostChangeBoardEventResponse,
  ParticipantChangeBoardResponse,
  RemoveIdeaDocumentResponse,
} from 'src/app/services/backend/schema/event-responses';
import { getFirstBoard } from './activities/board-list-functions/get-first-board/get-first-board';
import { getLastBoard } from './activities/board-list-functions/get-last-board/get-last-board';
import { insertBoard } from './activities/board-list-functions/insert-board/insert-board';
import { moveBoard } from './activities/board-list-functions/move-board/move-board';
import { removeBoard } from './activities/board-list-functions/remove-board/remove-board';
import { BoardsNavigationService } from './activities/boards-navigation.service';
import { BrainstormEventService } from './activities/brainstorm-event.service';
import {
  Board,
  BoardInfo,
  Category,
  Idea,
  IdeaDocument,
  TeamUser,
  Timer,
  UpdateMessage,
} from './backend/schema';
import { Participant } from './backend/schema/course_details';
import {
  BrainstormBoardBackgroundResponse,
  ChangeBoardBackgroundTypeResponse,
  ToggleBlurBackgroundImageResponse,
} from './backend/schema/event-responses';
import { PartnerInfo } from './backend/schema/whitelabel_info';

export type SideNavAction = 'opened' | 'closed';
@Injectable()
export class ContextService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private boardsNavigationService: BoardsNavigationService,
    private brainstormEventService: BrainstormEventService
  ) {}

  set hostLessonsCount(count: number) {
    this.hostLessonsCount$.next(count);
  }
  get hostLessonsCount(): number {
    return this.hostLessonsCount$.getValue();
  }

  set boardsCount(count: number) {
    this.boardsCount$.next(count);
  }
  get boardsCount(): number {
    return this.boardsCount$.getValue();
  }

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
   * Boards Count
   */
  boardsCount$ = new BehaviorSubject<number>(null);

  /**
   * Boards Count
   */
  hostLessonsCount$ = new BehaviorSubject<number>(null);

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
    try {
      // Iterate over the participants property of the oldActivityState object
      for (const key in oldActivityState?.brainstormactivity?.participants) {
        if (oldActivityState?.brainstormactivity?.participants.hasOwnProperty(key)) {
          // Get the participantsArray associated with the current key, and check if it is an array
          const participantsArray = oldActivityState?.brainstormactivity?.participants[key];
          if (!participantsArray || !Array.isArray(participantsArray)) {
            throw new Error(`Unexpected participantsArray for key ${key}: ${participantsArray}`);
          }

          // Check if the participantsArray array contains the participantBoard.participant_code
          if (participantsArray.includes(participantBoard.participant_code)) {
            // If it does, remove the participantBoard.participant_code from the array
            remove(participantsArray, (code) => code === participantBoard.participant_code);
          }

          // Check if the current key matches the participantBoard.board_id
          if (key === participantBoard.board_id.toString()) {
            // If it does, add the participantCode to the participantsArray array
            participantsArray.push(participantCode);
          }
        }
      }
    } catch (err) {
      // Log any errors that occur
      console.error(err);
    }

    // forOwn(oldActivityState.brainstormactivity.participants, function (value, key) {
    //   remove(value, (code) => code === participantBoard.participant_code);
    //   if (key === participantBoard.board_id.toString()) {
    //     value.push(participantCode);
    //   }
    // });
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

  addIdea(res: BrainstormSubmitResponse, oldActivityState: UpdateMessage) {
    // we have existing categories and we have id of the idea
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const board: Board = oldBoards[i];
      if (board.id === res.board_id) {
        for (let j = 0; j < board.brainstormcategory_set.length; j++) {
          const category = board.brainstormcategory_set[j];
          if (category.id === res.category_id) {
            const idea_document: IdeaDocument = {
              ...res.idea_document,
              id: res.idea_document?.id,
            };

            const name = find(
              oldActivityState?.lesson_run?.participant_set,
              (p) => p.participant_code === res.participant
            )?.display_name;

            const idea: Idea = {
              ...res,
              submitting_participant: {
                participant_code: res.participant,
                display_name: name,
              },
              pinned: false,
              comments: [],
              hearts: [],
              num_votes: 0,
              removed: false,
              version: 0,
              idea_document: res.idea_document ?? null,
              idea_video: res.idea_video ?? null,
              idea_image: res.idea_image ?? null,
            };
            category.brainstormidea_set.push(idea);
          }
        }
        break;
      }
    }
  }

  editIdea(res: BrainstormEditResponse, oldActivityState: UpdateMessage) {
    // we have existing categories and we have id of the idea
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const board: Board = oldBoards[i];
      if (board.id === res.board_id) {
        for (let j = 0; j < board.brainstormcategory_set.length; j++) {
          const category = board.brainstormcategory_set[j];
          if (category.id === res.category_id) {
            const existingIdeaIndex = findIndex(category.brainstormidea_set, { id: res.id });

            const editedIdea: Idea = {
              ...category.brainstormidea_set[existingIdeaIndex],
              ...res,
            };
            category.brainstormidea_set[existingIdeaIndex] = editedIdea;
          }
        }
        break;
      }
    }
  }

  removeIdea(res: BrainstormRemoveSubmitResponse, oldActivityState: UpdateMessage) {
    // we have existing categories and we have id of the idea
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const board: Board = oldBoards[i];
      if (board.id === res.board_id) {
        for (let j = 0; j < board.brainstormcategory_set.length; j++) {
          const category = board.brainstormcategory_set[j];
          const existingIdea = find(category.brainstormidea_set, { id: res.brainstormidea_id });
          if (existingIdea) {
            remove(category.brainstormidea_set, { id: res.brainstormidea_id });
            break;
          }
        }
        break;
      }
    }
  }

  removeIdeaDocument(res: RemoveIdeaDocumentResponse, oldActivityState: UpdateMessage) {
    // we have existing categories and we have id of the idea
    const oldBoards = oldActivityState.brainstormactivity.boards;
    for (let i = 0; i < oldBoards.length; i++) {
      const board: Board = oldBoards[i];
      if (board.id === res.board_id) {
        for (let j = 0; j < board.brainstormcategory_set.length; j++) {
          const category = board.brainstormcategory_set[j];
          const existingIdea = find(category.brainstormidea_set, { id: res.brainstormidea_id });
          if (existingIdea?.idea_document?.id === res.document_id) {
            existingIdea.idea_document = null;
            break;
          } else if (existingIdea?.idea_image?.id === res.document_id) {
            existingIdea.idea_image = null;
            break;
          } else if (existingIdea?.idea_video?.id === res.document_id) {
            existingIdea.idea_video = null;
            break;
          }
        }
        break;
      }
    }
  }

  createCategory(res: BrainstormCreateCategoryResponse, oldActivityState: UpdateMessage) {
    const board = this.boardsNavigationService.getBoard(
      res.board,
      oldActivityState.brainstormactivity.boards
    );

    board.brainstormcategory_set.push({
      category_name: res.category_name,
      id: res.id,
      brainstormidea_set: [],
      removed: false,
    });
  }

  removeCategory(res: BrainstormRemoveCategoryResponse, oldActivityState: UpdateMessage) {
    const board = this.boardsNavigationService.getBoard(
      res.board,
      oldActivityState.brainstormactivity.boards
    );
    remove(board.brainstormcategory_set, { id: res.id });
  }

  renameCategory(res: BrainstormRenameCategoryResponse, oldActivityState: UpdateMessage) {
    const board = this.boardsNavigationService.getBoard(
      res.board,
      oldActivityState.brainstormactivity.boards
    );

    board.brainstormcategory_set.forEach((category) => {
      if (category.id === res.id) {
        category.category_name = res.name;
      }
    });
  }

  addPinIdea(res: BrainstormAddRemoveIdeaPinResponse, oldActivityState: UpdateMessage) {
    const board = this.boardsNavigationService.getBoard(
      res.board_id,
      oldActivityState.brainstormactivity.boards
    );

    const idea = this.getIdea(res.brainstormidea_id, board.brainstormcategory_set);
    idea.pinned = true;
  }

  removePinIdea(res: BrainstormAddRemoveIdeaPinResponse, oldActivityState: UpdateMessage) {
    const board = this.boardsNavigationService.getBoard(
      res.board_id,
      oldActivityState.brainstormactivity.boards
    );

    const idea = this.getIdea(res.brainstormidea_id, board.brainstormcategory_set);
    idea.pinned = false;
  }

  changePostSize(res: BrainstormBoardPostSizeResponse, oldActivityState: UpdateMessage) {
    const board = this.boardsNavigationService.getBoard(
      res.board_id,
      oldActivityState.brainstormactivity.boards
    );

    board.post_size = res.post_size;
  }

  toggleBlurBackgroundImage(res: ToggleBlurBackgroundImageResponse, oldActivityState: UpdateMessage) {
    const board = this.boardsNavigationService.getBoard(
      res.board_id,
      oldActivityState.brainstormactivity.boards
    );

    if (board) {
      board.board_activity = {
        ...board.board_activity,
        blur_image: res.blur_image,
      };
    }
  }

  changeBoardBackgroundType(res: ChangeBoardBackgroundTypeResponse, oldActivityState: UpdateMessage) {
    const board = this.boardsNavigationService.getBoard(
      res.board_id,
      oldActivityState.brainstormactivity.boards
    );
    board.board_activity.background_type = res.background_type;
    if (board) {
      if (res.background_type === 'none') {
        board.board_activity = {
          ...board.board_activity,
          background_type: res.background_type,
          color: null,
          image_upload: null,
          image_url: null,
        };
      } else if (res.background_type === 'color') {
        board.board_activity = {
          ...board.board_activity,
          background_type: res.background_type,
          image_upload: null,
          image_url: null,
        };
      } else if (res.background_type === 'image') {
        board.board_activity = {
          ...board.board_activity,
          background_type: res.background_type,
          color: null,
        };
      }
    }
  }

  brainstormBoardBackground(res: BrainstormBoardBackgroundResponse, oldActivityState: UpdateMessage) {
    const board = this.boardsNavigationService.getBoard(
      res.board_id,
      oldActivityState.brainstormactivity.boards
    );
    if (board) {
      board.board_activity = {
        ...board.board_activity,
        color: res.color,
        image_upload: res.image_upload,
        image_url: res.image_url,
      };
    }
  }

  getIdea(id: number, categorySet: Array<Category>): Idea {
    for (let j = 0; j < categorySet.length; j++) {
      const existingCategory = categorySet[j];
      const existingIdea = find(existingCategory.brainstormidea_set, { id: id });
      if (existingIdea) {
        return existingIdea;
      }
    }
  }

  brainstormSubmitReplyReviewComment(
    res: BrainstormSubmitIdeaCommentResponse,
    oldActivityState: UpdateMessage
  ) {
    const board = this.boardsNavigationService.getBoard(
      res.board_id,
      oldActivityState.brainstormactivity.boards
    );

    if (board) {
      const existingIdea = this.getIdea(res.brainstormidea_id, board.brainstormcategory_set);
      if (existingIdea) {
        const existingComment = find(existingIdea.comments, { id: res.parent_comment });
        if (existingComment) {
          existingComment.reply_comments.push({
            id: res.id,
            comment: res.comment,
            comment_hearts: [],
            parent_comment: res.parent_comment,
            participant: res.participant,
          });
        }
      }
    }
    // notify the service that a comment has a reply
    this.brainstormEventService.ideaCommentReplyEvent = res as BrainstormSubmitIdeaCommentResponse;
    this.brainstormEventService.activityState = oldActivityState;
  }

  brainstormAddCommentHeart(res: BrainstormSubmitIdeaHeartResponse, oldActivityState: UpdateMessage) {
    try {
      if (!res) {
        throw new Error('BE response not valid for event Add Comment heart');
      }
      const board = this.boardsNavigationService.getBoard(
        res.board_id,
        oldActivityState.brainstormactivity.boards
      );

      // liking a comment
      // brainstormidea_id: 6106
      // heart: true
      // id: 55
      // parent: null
      // parent_comment: 2395
      // participant: null

      if (!board) {
        throw new Error('Board not found');
      }
      const existingIdea = this.getIdea(res.brainstormidea_id, board.brainstormcategory_set);
      if (!existingIdea) {
        throw new Error('Idea not found');
      }
      if (res.parent_comment && res.parent) {
        // child comment was liked
        const existingComment = find(existingIdea.comments, { id: res.parent_comment });

        if (!existingComment) {
          throw new Error('Parent comment not found');
        }
        const childComment = find(existingComment?.reply_comments, { id: res.parent });
        if (!childComment) {
          throw new Error('Child comment not found');
        }
        childComment.comment_hearts.push({
          id: res.id,
          participant: res.participant,
        });
      } else if (res.parent_comment) {
        const existingComment = find(existingIdea.comments, { id: res.parent_comment });
        if (!existingComment) {
          throw new Error('Comment not found');
        }
        existingComment.comment_hearts.push({
          id: res.id,
          participant: res.participant,
        });
      }

      // notify the service that a comment has a heart
      this.brainstormEventService.ideaCommentAddHeartEvent = res as BrainstormSubmitIdeaHeartResponse;
      this.brainstormEventService.activityState = oldActivityState;
    } catch (error) {
      console.error(error);
    }
  }

  brainstormRemoveCommentHeart(res: BrainstormRemoveCommentHeartResponse, oldActivityState: UpdateMessage) {
    const board = this.boardsNavigationService.getBoard(
      res.board_id,
      oldActivityState.brainstormactivity.boards
    );

    // liking a comment
    // brainstormidea_id: 6106
    // heart: true
    // id: 55
    // parent: null
    // parent_comment: 2395
    // participant: null

    if (board) {
      const existingIdea = this.getIdea(res.brainstormidea_id, board.brainstormcategory_set);
      if (existingIdea) {
        let h;
        for (let i = 0; i < existingIdea.comments.length && !h; i++) {
          const comment = existingIdea.comments[i];
          h = find(comment.comment_hearts, { id: res.heart_id });
          if (h) {
            remove(comment.comment_hearts, { id: res.heart_id });
          }
        }
      }
    }

    // notify the service that a comment has a heart
    this.brainstormEventService.ideaCommentRemoveHeartEvent = res as BrainstormRemoveCommentHeartResponse;
    this.brainstormEventService.activityState = oldActivityState;
  }

  brainstormRemoveReplyReviewComment(
    res: BrainstormRemoveIdeaCommentResponse,
    oldActivityState: UpdateMessage
  ) {
    const board = this.boardsNavigationService.getBoard(
      res.board_id,
      oldActivityState.brainstormactivity.boards
    );

    if (board) {
      const existingIdea = this.getIdea(res.brainstormidea_id, board.brainstormcategory_set);
      if (existingIdea) {
        const existingComment = find(existingIdea.comments, { id: res.parent_comment });
        if (existingComment) {
          remove(existingComment.reply_comments, { id: res.comment_id });
        }
      }
    }

    // notify the service that a comment has a reply
    this.brainstormEventService.ideaRemoveCommentReplyEvent = res as BrainstormRemoveIdeaCommentResponse;
    this.brainstormEventService.activityState = oldActivityState;
  }

  setPostCategory(res: BrainstormSetCategoryResponse, oldActivityState: UpdateMessage) {
    const board = this.boardsNavigationService.getBoard(
      res.board,
      oldActivityState.brainstormactivity.boards
    );

    let idea: Idea;
    for (let j = 0; j < board.brainstormcategory_set.length; j++) {
      const categoryIdeas = board.brainstormcategory_set[j].brainstormidea_set;
      const tempIdea = find(categoryIdeas, { id: res.brainstormidea_id });
      if (tempIdea) {
        idea = tempIdea;
        remove(categoryIdeas, { id: res.brainstormidea_id });
      }
    }
    for (let j = 0; j < board.brainstormcategory_set.length; j++) {
      const categoryIdeas = board.brainstormcategory_set[j].brainstormidea_set;
      if (board.brainstormcategory_set[j].id === res.category) {
        categoryIdeas.push(idea);
      }
    }
  }

  //
  // Boards
  //

  addBoard(res: BrainstormAddBoardResponse, oldActivityState: UpdateMessage) {
    // find the board previous to the added board
    // and set this board as the next_board

    const newBoard = {
      board_activity: {
        instructions: res.instructions,
        sub_instructions: res.sub_instructions,
        background_type: 'none',
        blur_image: false,
        color: null,
        image_upload: null,
        image_url: null,
      } as BoardInfo,
      id: res.id,
      meta: res.meta,
      name: res.name,
      removed: false,
      next_board: res.next_board,
      previous_board: res.previous_board,
    } as Board;

    insertBoard(newBoard, oldActivityState?.brainstormactivity?.boards);

    try {
      // verify the integrity of the list
      const lastBoard = getLastBoard(oldActivityState?.brainstormactivity?.boards);
      const firstBoard = getFirstBoard(oldActivityState?.brainstormactivity?.boards);
    } catch (error) {
      console.error(error);
    }
  }

  duplicateBoard(res: Board, oldActivityState: UpdateMessage) {
    insertBoard(res, oldActivityState?.brainstormactivity?.boards);

    try {
      // verify the integrity of the list
      const lastBoard = getLastBoard(oldActivityState?.brainstormactivity?.boards);
      const firstBoard = getFirstBoard(oldActivityState?.brainstormactivity?.boards);
    } catch (error) {
      console.error(error);
    }
  }

  removeBoard(res: BrainstormRemoveBoardResponse, oldActivityState: UpdateMessage) {
    try {
      if (
        !res ||
        !oldActivityState ||
        !oldActivityState.brainstormactivity ||
        !oldActivityState.brainstormactivity.boards
      ) {
        throw new Error('Input is undefined/null');
      }

      const deletedBoardIndex = oldActivityState.brainstormactivity.boards.findIndex(
        (board) => board.id === res.id
      );
      if (deletedBoardIndex === -1) {
        throw new Error(`Board with id '${res.id}' not found`);
      }

      const [deletedBoard] = oldActivityState.brainstormactivity.boards.splice(deletedBoardIndex, 1);
      const { previous_board: previousBoardId, next_board: nextBoardId } = deletedBoard;

      if (previousBoardId !== null) {
        const previousBoardIndex = oldActivityState.brainstormactivity.boards.findIndex(
          (board) => board.id === previousBoardId
        );
        if (previousBoardIndex === -1) {
          throw new Error(`Previous board with id '${previousBoardId}' not found`);
        }
        oldActivityState.brainstormactivity.boards[previousBoardIndex].next_board = nextBoardId;
      }

      if (nextBoardId !== null) {
        const nextBoardIndex = oldActivityState.brainstormactivity.boards.findIndex(
          (board) => board.id === nextBoardId
        );
        if (nextBoardIndex === -1) {
          throw new Error(`Next board with id '${nextBoardId}' not found`);
        }
        oldActivityState.brainstormactivity.boards[nextBoardIndex].previous_board = previousBoardId;
      }

      // if host board is deleted
      // change host board to previous board
      if (oldActivityState.brainstormactivity.host_board === res.id) {
        if (deletedBoard.previous_board) {
          oldActivityState.brainstormactivity.host_board = deletedBoard.previous_board;
        } else if (deletedBoard.next_board) {
          oldActivityState.brainstormactivity.host_board = deletedBoard.next_board;
        }
      }

      try {
        // verify the integrity of the list
        const lastBoard = getLastBoard(oldActivityState?.brainstormactivity?.boards);
        const firstBoard = getFirstBoard(oldActivityState?.brainstormactivity?.boards);
      } catch (error) {
        console.error(error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  brainstormRearrangeBoard(res: BrainstormRearrangeBoardResponse, oldActivityState: UpdateMessage) {
    const board = this.boardsNavigationService.getBoard(
      res.board_id,
      oldActivityState.brainstormactivity.boards
    );
    if (board) {
      const b = cloneDeep(board);
      b.next_board = res.next_board;
      b.previous_board = res.previous_board;

      moveBoard(b, oldActivityState?.brainstormactivity?.boards);
      try {
        // verify the integrity of the list
        const lastBoard = getLastBoard(oldActivityState?.brainstormactivity?.boards);
        const firstBoard = getFirstBoard(oldActivityState?.brainstormactivity?.boards);
      } catch (error) {
        console.error(error);
      }
    }
  }
}
