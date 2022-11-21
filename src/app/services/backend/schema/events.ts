export type EventType =
  | 'BrainstormSubmitIdeaCommentEvent'
  | 'BrainstormRemoveIdeaCommentEvent'
  | 'BrainstormSubmitIdeaHeartEvent '
  | 'BrainstormRemoveIdeaHeartEvent'
  | 'NotificationEvent'
  | 'JoinEvent'
  | 'ParticipantChangeBoardEvent'
  | 'HostChangeBoardEvent'
  | 'BrainstormToggleMeetingMode'
  | 'BrainstormBoardPostSizeEvent'
  | 'GetUpdatedLessonDetailEvent'
  | 'BootParticipantEvent'
  | 'BrainstormChangeModeEvent'
  | 'BrainstormChangeBoardStatusEvent'
  | 'BrainstormBoardSortOrderEvent'
  | 'BrainstormToggleAllowCommentEvent'
  | 'BrainstormToggleAllowHeartEvent'
  | string;

export enum EventTypes {
  brainstormSubmitIdeaCommentEvent = 'BrainstormSubmitIdeaCommentEvent',
  brainstormRemoveIdeaCommentEvent = 'BrainstormRemoveIdeaCommentEvent',
  brainstormSubmitIdeaHeartEvent = 'BrainstormSubmitIdeaHeartEvent',
  brainstormRemoveIdeaHeartEvent = 'BrainstormRemoveIdeaHeartEvent',
  notificationEvent = 'NotificationEvent',
  joinEvent = 'JoinEvent',
  brainstormToggleParticipantNameEvent = 'BrainstormToggleParticipantNameEvent',
  participantChangeBoardEvent = 'ParticipantChangeBoardEvent',
  hostChangeBoardEvent = 'HostChangeBoardEvent',
  brainstormToggleMeetingMode = 'BrainstormToggleMeetingMode',
  brainstormBoardPostSizeEvent = 'BrainstormBoardPostSizeEvent',
  getUpdatedLessonDetailEvent = 'GetUpdatedLessonDetailEvent',
  bootParticipantEvent = 'BootParticipantEvent',
  brainstormChangeModeEvent = 'BrainstormChangeModeEvent',
  brainstormChangeBoardStatusEvent = 'BrainstormChangeBoardStatusEvent',
  brainstormBoardSortOrderEvent = 'BrainstormBoardSortOrderEvent',
  brainstormToggleAllowCommentEvent = 'BrainstormToggleAllowCommentEvent',
  brainstormToggleAllowHeartEvent = 'BrainstormToggleAllowHeartEvent',
}
