export type EventType =
  | 'NotificationEvent'
  | 'JoinEvent'
  | 'BrainstormSubmitIdeaCommentEvent'
  | 'ParticipantChangeBoardEvent'
  | 'HostChangeBoardEvent'
  | 'BrainstormToggleMeetingMode'
  | string;

export enum EventTypes {
  brainstormSubmitIdeaCommentEvent = 'BrainstormSubmitIdeaCommentEvent',
  notificationEvent = 'NotificationEvent',
  joinEvent = 'JoinEvent',
  brainstormToggleParticipantNameEvent = 'BrainstormToggleParticipantNameEvent',
  participantChangeBoardEvent = 'ParticipantChangeBoardEvent',
  hostChangeBoardEvent = 'HostChangeBoardEvent',
  brainstormToggleMeetingMode = 'BrainstormToggleMeetingMode',
}
