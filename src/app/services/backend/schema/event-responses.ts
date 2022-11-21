import { BoardMode, BoardSort, BoardStatus } from './activities';

export interface BrainstormSubmitIdeaCommentResponse {
  board_id: number;
  brainstormidea_id: number;
  comment: string;
  id: number;
  participant: any;
}

export interface BrainstormSubmitIdeaHeartResponse {
  board_id: number;
  brainstormidea_id: number;
  heart: boolean;
  id: number;
  participant: any;
}

export interface BrainstormRemoveIdeaHeartResponse {
  board_id: number;
  brainstormidea_id: number;
  heart_id: number;
  participant: any;
}

export interface BrainstormRemoveIdeaCommentResponse {
  board_id: number;
  brainstormidea_id: number;
  comment_id: string;
  id: number;
  participant: any;
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
