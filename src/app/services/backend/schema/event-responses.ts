import {
  Board,
  BoardInfo,
  BoardMode,
  BoardSort,
  BoardStatus,
  Idea,
  IdeaComment,
  IdeaDocument,
  IdeaDocumentType,
  IdeaHeart,
  PostSize,
} from './activities';

export interface BrainstormSubmitIdeaCommentResponse {
  id: number;
  board_id: number;
  brainstormidea_id: number;
  comment: string;
  parent_comment?: number;
  participant: number;
  parent?: number;
}

export interface BrainstormSubmitIdeaHeartResponse {
  board_id: number;
  brainstormidea_id: number;
  heart: boolean;
  id: number;
  participant: number;

  parent_comment: number;
  parent: number;
}

export interface BrainstormRemoveIdeaHeartResponse {
  board_id: number;
  brainstormidea_id: number;
  heart_id: number;
  participant: number;
}

export interface BrainstormRemoveCommentHeartResponse {
  board_id: number;
  brainstormidea_id: number;
  heart_id: number;
  participant: number;
}

export interface BrainstormRemoveIdeaCommentResponse {
  board_id: number;
  brainstormidea_id: number;
  comment_id: number;
  id: number;
  participant: number;

  parent_comment: number;
  parent: number;
}

export interface ParticipantChangeBoardResponse {
  board_id: number;
  participant_code: number;
}

export interface HostChangeBoardEventResponse {
  host_board: number;
}

export interface BrainstormToggleParticipantNameResponse {
  board_id: number;
  show_participant_name_flag: boolean;
}

export interface BrainstormChangeBoardStatusResponse {
  board_id: number;
  status: BoardStatus;
}

export interface BrainstormSubmitResponse {
  id: number;
  idea: string;
  category_id: number;
  board_id: number;
  participant: number;
  title: string;
  version: number;
  meta: any;
  time: string;
  idea_image: IdeaDocument;
  idea_document: IdeaDocument;
  idea_video: IdeaDocument;

  next_idea: number;
  previous_idea: number;
}

export interface BrainstormEditResponse {
  id: number;
  idea: string;
  category_id: number;
  board_id: number;
  participant: number;
  title: string;
  comments: Array<IdeaComment>;
  hearts: Array<IdeaHeart>;
  version: number;
  meta: any;
  time: string;
  idea_image: IdeaDocument;
  idea_document: IdeaDocument;
  idea_video: IdeaDocument;
}

export interface BrainstormRemoveSubmitResponse {
  brainstormidea_id: number;
  board_id: number;
  participant: number;
}

export interface RemoveIdeaDocumentResponse {
  document_id: number;
  brainstormidea_id: number;
  board_id: number;
  participant: number;
}

export interface BrainstormChangeModeResponse {
  board_id: number;
  mode: BoardMode;
}

export interface BrainstormBoardSortOrderResponse {
  board_id: number;
  sort: BoardSort;
}

export interface BrainstormToggleAllowCommentResponse {
  board_id: number;
  allow_comment: boolean;
}

export interface BrainstormToggleAllowHeartResponse {
  board_id: number;
  allow_heart: boolean;
}

export interface BrainstormCreateCategoryResponse {
  category_name: string;
  board: number;
  id: number;
  removed: boolean;
}

export interface BrainstormRemoveCategoryResponse {
  board: number;
  id: number;
}

export interface BrainstormRenameCategoryResponse {
  id: number;
  board: number;
  name: string;
}

export interface BrainstormAddBoardResponse {
  id: number;
  instructions: string;
  meta: any;
  name: string;
  next_board: number;
  previous_board: number;
  sub_instructions: string;
}

export interface BrainstormRemoveBoardResponse {
  id: number;
}

export interface BrainstormAddRemoveIdeaPinResponse {
  brainstormidea_id: number;
  board_id: number;
  participant: number;
}

export interface BrainstormBoardPostSizeResponse {
  board_id: number;
  post_size: PostSize;
}

export interface BrainstormRearrangeBoardResponse {
  board_id: number;
  previous_board: number;
  next_board: number;
}
export interface MoveBrainstormIdeaResponse {
  board_id: number;
  brainstormidea_id: number;
  category_id: number;
}
// BrainstormMoveIdeaBoardEvent;
export interface BrainstormBoardBackgroundResponse {
  board_id: number;
  color: string;
  image_upload: string;
  image_url: string;
}

export interface ChangeBoardBackgroundTypeResponse {
  background_type: 'none' | 'color' | 'image';
  board_id: number;
}

export interface ToggleBlurBackgroundImageResponse {
  blur_image: boolean;
  board_id: number;
}

export interface BrainstormSetCategoryResponse {
  board: number;
  category: number;
  brainstormidea_id: number;
  participant: number;
  next_idea: number;
  previous_idea: number;
}
export interface BrainstormIdeaRearrangeResponse {
  brainstormidea_id: number;
  previous_idea: number;
  next_idea: number;
  category: number;
}
