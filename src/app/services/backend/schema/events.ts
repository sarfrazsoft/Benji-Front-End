export type EventType =
  | 'NotificationEvent'
  | 'JoinEvent'
  | 'BrainstormSubmitIdeaCommentEvent'
  | 'ParticipantChangeBoardEvent'
  | 'HostChangeBoardEvent'
  | 'BrainstormToggleMeetingMode'
  | 'BrainstormBoardPostSizeEvent'
  | 'GetUpdatedLessonDetailEvent'
  | 'BootParticipantEvent'
  | 'BrainstormChangeModeEvent'
  | 'BrainstormChangeBoardStatusEvent'
  | string;

export enum EventTypes {
  brainstormSubmitIdeaCommentEvent = 'BrainstormSubmitIdeaCommentEvent',
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
}
