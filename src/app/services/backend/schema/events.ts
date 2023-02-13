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
  | 'ChangeBoardBackgroundTypeEvent'
  | 'BrainstormBoardBackgroudEvent'
  | 'ToggleBlurBackgroundImageEvent'
  | 'BrainstormBoardPostSizeEvent'
  | 'GetUpdatedLessonDetailEvent'
  | 'BootParticipantEvent'
  | 'BrainstormChangeModeEvent'
  | 'BrainstormChangeBoardStatusEvent'
  | 'BrainstormBoardSortOrderEvent'
  | 'BrainstormToggleAllowCommentEvent'
  | 'BrainstormToggleAllowHeartEvent'
  | 'BrainstormSubmitEvent'
  | 'BrainstormEditIdeaSubmitEvent'
  | 'RemoveIdeaDocumentEvent'
  | 'BrainstormRemoveSubmissionEvent'
  | 'BrainstormCreateCategoryEvent'
  | 'BrainstormRemoveCategoryEvent'
  | 'BrainstormRenameCategoryEvent'
  | 'BrainstormAddBoardEventBaseEvent'
  | 'DuplicateBoardEvent'
  | 'BrainstormRemoveBoardEvent'
  | 'BrainstormAddIdeaPinEvent'
  | 'BrainstormRemoveIdeaPinEvent'
  | 'BrainstormRearrangeBoardEvent'
  | 'BrainstormMoveIdeaBoardEvent'
  | 'MoveBrainstormIdeaEvent'
  | 'BrainstormSubmitReplyReviewCommentEvent'
  | 'BrainstormSubmitCommentHeartEvent'
  | 'BrainstormRemoveReplyReviewCommentEvent'
  | 'BrainstormRemoveCommentHeartEvent'
  | 'BrainstormSetCategoryEvent'
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

  brainstormSubmitEvent = 'BrainstormSubmitEvent',
  brainstormEditIdeaSubmitEvent = 'BrainstormEditIdeaSubmitEvent',
  removeIdeaDocumentEvent = 'RemoveIdeaDocumentEvent',
  brainstormRemoveSubmissionEvent = 'BrainstormRemoveSubmissionEvent',

  brainstormCreateCategoryEvent = 'BrainstormCreateCategoryEvent',
  brainstormRemoveCategoryEvent = 'BrainstormRemoveCategoryEvent',
  brainstormRenameCategoryEvent = 'BrainstormRenameCategoryEvent',
  brainstormAddBoardEventBaseEvent = 'BrainstormAddBoardEventBaseEvent',
  duplicateBoardEvent = 'DuplicateBoardEvent',
  brainstormRemoveBoardEvent = 'BrainstormRemoveBoardEvent',
  brainstormAddIdeaPinEvent = 'BrainstormAddIdeaPinEvent',
  brainstormRemoveIdeaPinEvent = 'BrainstormRemoveIdeaPinEvent',
  brainstormRearrangeBoardEvent = 'BrainstormRearrangeBoardEvent',
  brainstormMoveIdeaBoardEvent = 'BrainstormMoveIdeaBoardEvent',
  moveBrainstormIdeaEvent = 'MoveBrainstormIdeaEvent',
  changeBoardBackgroundTypeEvent = 'ChangeBoardBackgroundTypeEvent',
  brainstormBoardBackgroudEvent = 'BrainstormBoardBackgroudEvent',
  toggleBlurBackgroundImageEvent = 'ToggleBlurBackgroundImageEvent',

  brainstormSubmitReplyReviewCommentEvent = 'BrainstormSubmitReplyReviewCommentEvent',
  brainstormSubmitCommentHeartEvent = 'BrainstormSubmitCommentHeartEvent',
  brainstormRemoveReplyReviewCommentEvent = 'BrainstormRemoveReplyReviewCommentEvent',
  brainstormRemoveCommentHeartEvent = 'BrainstormRemoveCommentHeartEvent',

  brainstormSetCategoryEvent = 'BrainstormSetCategoryEvent',
  brainstormIdeaRearrangeEvent = 'BrainstormIdeaRearrangeEvent',
}
