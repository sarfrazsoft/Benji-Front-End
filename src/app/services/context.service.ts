import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { find, findIndex, forOwn, remove } from 'lodash';
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
  BrainstormRemoveBoardResponse,
  BrainstormRemoveCategoryResponse,
  BrainstormRemoveIdeaCommentResponse,
  BrainstormRemoveIdeaHeartResponse,
  BrainstormRemoveSubmitResponse,
  BrainstormRenameCategoryResponse,
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
import { BoardsNavigationService } from './activities/boards-navigation.service';
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
    private boardsNavigationService: BoardsNavigationService
  ) {}
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

            const idea: Idea = {
              ...res,
              submitting_participant: {
                participant_code: res.participant,
                display_name: find(
                  oldActivityState?.lesson_run?.participant_set,
                  (p) => p.participant_code === res.participant
                )?.display_name,
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

  addBoard(res: BrainstormAddBoardResponse, oldActivityState: UpdateMessage) {
    // find the board previous to the added board
    // and set this board as the next_board
    const previousBoard = this.boardsNavigationService.getBoard(
      res.previous_board,
      oldActivityState.brainstormactivity.boards
    );
    previousBoard.next_board = res.id;
    oldActivityState.brainstormactivity.boards.push({
      board_activity: { instructions: res.instructions, sub_instructions: res.sub_instructions } as BoardInfo,
      id: res.id,
      meta: res.meta,
      name: res.name,
      removed: false,
      next_board: res.next_board,
      previous_board: res.previous_board,
    } as Board);
  }

  duplicateBoard(res: Board, oldActivityState: UpdateMessage) {
    // set next_board of the duplicated board to the new board
    const duplicatedBoardId = res.previous_board;
    const board = this.boardsNavigationService.getBoard(
      duplicatedBoardId,
      oldActivityState.brainstormactivity.boards
    );
    board.next_board = res.id;

    // push the new board in boards
    oldActivityState.brainstormactivity.boards.push(res);
  }

  removeBoard(res: BrainstormRemoveBoardResponse, oldActivityState: UpdateMessage) {
    const deletedBoard = this.boardsNavigationService.getBoard(
      res.id,
      oldActivityState.brainstormactivity.boards
    );
    if (deletedBoard.next_board) {
      // find the board that was next to the deleted board
      // and set previous_board value as the previous of deleted board
      const nextBoard = this.boardsNavigationService.getBoard(
        deletedBoard.next_board,
        oldActivityState.brainstormactivity.boards
      );

      nextBoard.previous_board = deletedBoard.previous_board;
    } else {
      const previousBoard = this.boardsNavigationService.getBoard(
        deletedBoard.previous_board,
        oldActivityState.brainstormactivity.boards
      );
      previousBoard.next_board = null;
    }

    if (deletedBoard.previous_board) {
      // find the board that was previous to the deleted board
      // and set the next_board value as the next of deleted board
      const previousBoard = this.boardsNavigationService.getBoard(
        deletedBoard.previous_board,
        oldActivityState.brainstormactivity.boards
      );

      previousBoard.next_board = deletedBoard.next_board;
    } else {
      // we're deleting the first board
      const nextBoard = this.boardsNavigationService.getBoard(
        deletedBoard.next_board,
        oldActivityState.brainstormactivity.boards
      );

      nextBoard.previous_board = null;
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
    remove(oldActivityState.brainstormactivity.boards, { id: res.id });
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
      board.board_activity = {
        ...board.board_activity,
        background_type: res.background_type,
      };
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
}
