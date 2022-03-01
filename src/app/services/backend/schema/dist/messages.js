"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.GetUpdatedLessonDetailEvent = exports.BrainstormBoardSortOrderEvent = exports.BrainstormClearBoardIdeaEvent = exports.BrainstormChangeModeEvent = exports.BrainstormToggleMeetingMode = exports.BrainstormRemoveBoardEvent = exports.BrainstormChangeBoardStatusEvent = exports.BrainstormAddBoardEventBaseEvent = exports.BrainstormEditSubInstructionEvent = exports.ParticipantChangeBoardEvent = exports.HostChangeBoardEvent = exports.BrainstormEditInstructionEvent = exports.CardsRestartActivityEvent = exports.CardsParticipantReadyEvent = exports.CardsAddParticipantToCurrentlySharingEvent = exports.CardsSetParticipantSkipCardsPermissionEvent = exports.CardsSetSharingTime = exports.CardsStartSetupStageEvent = exports.CardsStartSharingStageEvent = exports.CardsShuffleEvent = exports.ResetGroupingEvent = exports.AssignGroupingToActivities = exports.StartBrainstormGroupEvent = exports.StartCaseStudyGroupEvent = exports.GroupingParticipantSelfJoinEvent = exports.RemoveParticipantFromGroupEvent = exports.GroupingAssignParticipantEvent = exports.DeleteGroupingGroupEvent = exports.DeleteGroupingEvent = exports.CreateGroupEvent = exports.AllowParticipantGroupingMidActivityEvent = exports.UpdateGroupingStyleEvent = exports.ViewGroupingEvent = exports.AllowParticipantGroupingEvent = exports.CreateGroupsEvent = exports.SelectGroupingEvent = exports.EditGroupingTitleEvent = exports.EditGroupTitleEvent = exports.CreateGroupingEvent = exports.JumpEvent = exports.LobbySetNicknameEvent = exports.MontyHallRepeatEvent = exports.MontyHallSelectDoorEvent = exports.GatherActivityContinueEvent = exports.CaseStudyTeamDoneEvent = exports.CaseStudyDefaultWorksheetApplied = exports.CaseStudySubmitAnswerEvent = exports.GenericRoleplayParticipantFeedbackEvent = exports.GenericRoleplayParticipantDiscussedEvent = exports.ExternalGroupingSubmitGroupEvent = exports.BrainstormSetCategoryEvent = exports.BrainstormVoteEvent = exports.BrainstormRemoveCategoryEvent = exports.BrainstormCreateCategoryEvent = exports.BrainstormRenameCategoryEvent = exports.BrainstormRemoveSubmissionEvent = exports.BrainstormRemoveIdeaHeartEvent = exports.BrainstormSubmitIdeaHeartEvent = exports.RemoveIdeaDocumentEvent = exports.BrainstormRemoveIdeaCommentEvent = exports.BrainstormSubmitIdeaCommentEvent = exports.BrainstormImageSubmitEvent = exports.BrainstormEditIdeaSubmitEvent = exports.BrainstormSubmitDocumentEvent = exports.BrainstormSubmitVideoEvent = exports.BrainstormSubmitEvent = exports.BrainstormVotingCompleteInternalEvent = exports.BrainstormSubmissionCompleteInternalEvent = exports.BrainstormToggleParticipantNameEvent = exports.BrainstormToggleCategoryModeEvent = exports.ParticipantSelectCardEvent = exports.SelectParticipantForShareEvent = exports.SubmitSharingParticipantReactionEvent = exports.SubmitSharingParticipantCommentEvent = exports.ParticipantOptOutEvent = exports.ParticipantOptInEvent = exports.EndShareEvent = exports.BeginShareEvent = exports.PitchoMaticSubmitFeedbackEvent = exports.PitchoMaticParticipantReadyEvent = exports.PitchoMaticParticipantInGroupEvent = exports.PitchoMaticParticipantGeneratedEvent = exports.BuildAPitchSubmitVoteEvent = exports.BuildAPitchSharingDoneEvent = exports.BuildAPitchSubmitPitchEvent = exports.BuildAPitchSubmitEventEntry = exports.FeedbackSubmitEvent = exports.FeedbackSubmitEventAnswer = exports.WhereDoYouStandSubmitPreferenceEvent = exports.WhereDoYouStandSubmitPredictionEvent = exports.DiscussionSharerDoneEvent = exports.DiscussionSharingVolunteerEvent = exports.PollSubmitAnswerEvent = exports.MCQSubmitAnswerEvent = exports.HintWordSubmitVoteEvent = exports.HintWordSubmitWordEvent = exports.RoleplayPairUserDiscussedEvent = exports.RoleplayPairUserFoundEvent = exports.GroupingParticipantReadyEvent = exports.TeleTriviaSharingDoneEvent = exports.TeleTriviaMessageReturnedEvent = exports.TeleTriviaSubmitAnswerEvent = exports.TeleTriviaStartGameEvent = exports.TeleTriviaUserInCircleEvent = exports.NextInternalEvent = exports.EndEvent = exports.LobbyStartButtonClickEvent = exports.BootParticipantEvent = exports.PreviousEvent = exports.ResetEvent = exports.FastForwardEvent = exports.ResumeActivityEvent = exports.PauseActivityEvent = exports.ActivityEvent = void 0;
// export class Ddatemessage implements UpdateMessage {
//   updateMessage;
//   activity_type;
//   base_activity;
//   lesson_run;
//   lesson;
//   getActivity() {
//     return this.updateMessage[this.activity_type.toLowerCase]
//   }
// }
var ActivityEvent = /** @class */ (function () {
    function ActivityEvent() {
        this.event_name = 'Event';
        this.extra_args = {};
    }
    ActivityEvent.prototype.toMessage = function () {
        return __assign({ event_type: this.event_name }, this.extra_args);
    };
    return ActivityEvent;
}());
exports.ActivityEvent = ActivityEvent;
var PauseActivityEvent = /** @class */ (function (_super) {
    __extends(PauseActivityEvent, _super);
    function PauseActivityEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'PauseActivityEvent';
        return _this;
    }
    return PauseActivityEvent;
}(ActivityEvent));
exports.PauseActivityEvent = PauseActivityEvent;
var ResumeActivityEvent = /** @class */ (function (_super) {
    __extends(ResumeActivityEvent, _super);
    function ResumeActivityEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'ResumeActivityEvent';
        return _this;
    }
    return ResumeActivityEvent;
}(ActivityEvent));
exports.ResumeActivityEvent = ResumeActivityEvent;
var FastForwardEvent = /** @class */ (function (_super) {
    __extends(FastForwardEvent, _super);
    function FastForwardEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'FastForwardEvent';
        return _this;
    }
    return FastForwardEvent;
}(ActivityEvent));
exports.FastForwardEvent = FastForwardEvent;
var ResetEvent = /** @class */ (function (_super) {
    __extends(ResetEvent, _super);
    function ResetEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'ResetEvent';
        return _this;
    }
    return ResetEvent;
}(ActivityEvent));
exports.ResetEvent = ResetEvent;
var PreviousEvent = /** @class */ (function (_super) {
    __extends(PreviousEvent, _super);
    function PreviousEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'PreviousEvent';
        return _this;
    }
    return PreviousEvent;
}(ActivityEvent));
exports.PreviousEvent = PreviousEvent;
var BootParticipantEvent = /** @class */ (function (_super) {
    __extends(BootParticipantEvent, _super);
    function BootParticipantEvent(participant_code) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BootParticipantEvent';
        _this.extra_args = { participant_code: participant_code };
        return _this;
    }
    return BootParticipantEvent;
}(ActivityEvent));
exports.BootParticipantEvent = BootParticipantEvent;
var LobbyStartButtonClickEvent = /** @class */ (function (_super) {
    __extends(LobbyStartButtonClickEvent, _super);
    function LobbyStartButtonClickEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'LobbyStartButtonClickEvent';
        return _this;
    }
    return LobbyStartButtonClickEvent;
}(ActivityEvent));
exports.LobbyStartButtonClickEvent = LobbyStartButtonClickEvent;
var EndEvent = /** @class */ (function (_super) {
    __extends(EndEvent, _super);
    function EndEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'EndEvent';
        return _this;
    }
    return EndEvent;
}(ActivityEvent));
exports.EndEvent = EndEvent;
var NextInternalEvent = /** @class */ (function (_super) {
    __extends(NextInternalEvent, _super);
    function NextInternalEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'NextInternalEvent';
        return _this;
    }
    return NextInternalEvent;
}(ActivityEvent));
exports.NextInternalEvent = NextInternalEvent;
var TeleTriviaUserInCircleEvent = /** @class */ (function (_super) {
    __extends(TeleTriviaUserInCircleEvent, _super);
    function TeleTriviaUserInCircleEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'TeleTriviaUserInCircleEvent';
        return _this;
    }
    return TeleTriviaUserInCircleEvent;
}(ActivityEvent));
exports.TeleTriviaUserInCircleEvent = TeleTriviaUserInCircleEvent;
var TeleTriviaStartGameEvent = /** @class */ (function (_super) {
    __extends(TeleTriviaStartGameEvent, _super);
    function TeleTriviaStartGameEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'TeleTriviaStartGameEvent';
        return _this;
    }
    return TeleTriviaStartGameEvent;
}(ActivityEvent));
exports.TeleTriviaStartGameEvent = TeleTriviaStartGameEvent;
var TeleTriviaSubmitAnswerEvent = /** @class */ (function (_super) {
    __extends(TeleTriviaSubmitAnswerEvent, _super);
    function TeleTriviaSubmitAnswerEvent(question, answer) {
        var _this = _super.call(this) || this;
        _this.event_name = 'TeleTriviaSubmitAnswerEvent';
        _this.extra_args = { question: question.id, answer: answer.id };
        return _this;
    }
    return TeleTriviaSubmitAnswerEvent;
}(ActivityEvent));
exports.TeleTriviaSubmitAnswerEvent = TeleTriviaSubmitAnswerEvent;
var TeleTriviaMessageReturnedEvent = /** @class */ (function (_super) {
    __extends(TeleTriviaMessageReturnedEvent, _super);
    function TeleTriviaMessageReturnedEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'TeleTriviaMessageReturnedEvent';
        return _this;
    }
    return TeleTriviaMessageReturnedEvent;
}(ActivityEvent));
exports.TeleTriviaMessageReturnedEvent = TeleTriviaMessageReturnedEvent;
var TeleTriviaSharingDoneEvent = /** @class */ (function (_super) {
    __extends(TeleTriviaSharingDoneEvent, _super);
    function TeleTriviaSharingDoneEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'TeleTriviaSharingDoneEvent';
        return _this;
    }
    return TeleTriviaSharingDoneEvent;
}(ActivityEvent));
exports.TeleTriviaSharingDoneEvent = TeleTriviaSharingDoneEvent;
var GroupingParticipantReadyEvent = /** @class */ (function (_super) {
    __extends(GroupingParticipantReadyEvent, _super);
    function GroupingParticipantReadyEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'GroupingParticipantReadyEvent';
        return _this;
    }
    return GroupingParticipantReadyEvent;
}(ActivityEvent));
exports.GroupingParticipantReadyEvent = GroupingParticipantReadyEvent;
var RoleplayPairUserFoundEvent = /** @class */ (function (_super) {
    __extends(RoleplayPairUserFoundEvent, _super);
    function RoleplayPairUserFoundEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'RoleplayPairUserFoundEvent';
        return _this;
    }
    return RoleplayPairUserFoundEvent;
}(ActivityEvent));
exports.RoleplayPairUserFoundEvent = RoleplayPairUserFoundEvent;
var RoleplayPairUserDiscussedEvent = /** @class */ (function (_super) {
    __extends(RoleplayPairUserDiscussedEvent, _super);
    function RoleplayPairUserDiscussedEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'RoleplayPairUserDiscussedEvent';
        return _this;
    }
    return RoleplayPairUserDiscussedEvent;
}(ActivityEvent));
exports.RoleplayPairUserDiscussedEvent = RoleplayPairUserDiscussedEvent;
var HintWordSubmitWordEvent = /** @class */ (function (_super) {
    __extends(HintWordSubmitWordEvent, _super);
    function HintWordSubmitWordEvent(word) {
        var _this = _super.call(this) || this;
        _this.event_name = 'HintWordSubmitWordEvent';
        _this.extra_args = { word: word };
        return _this;
    }
    return HintWordSubmitWordEvent;
}(ActivityEvent));
exports.HintWordSubmitWordEvent = HintWordSubmitWordEvent;
var HintWordSubmitVoteEvent = /** @class */ (function (_super) {
    __extends(HintWordSubmitVoteEvent, _super);
    function HintWordSubmitVoteEvent(word_id) {
        var _this = _super.call(this) || this;
        _this.event_name = 'HintWordSubmitVoteEvent';
        _this.extra_args = { hintwordword: word_id };
        return _this;
    }
    return HintWordSubmitVoteEvent;
}(ActivityEvent));
exports.HintWordSubmitVoteEvent = HintWordSubmitVoteEvent;
var MCQSubmitAnswerEvent = /** @class */ (function (_super) {
    __extends(MCQSubmitAnswerEvent, _super);
    function MCQSubmitAnswerEvent(answers) {
        var _this = _super.call(this) || this;
        _this.event_name = 'MCQSubmitAnswerEvent';
        _this.extra_args = { answers: answers };
        return _this;
    }
    return MCQSubmitAnswerEvent;
}(ActivityEvent));
exports.MCQSubmitAnswerEvent = MCQSubmitAnswerEvent;
var PollSubmitAnswerEvent = /** @class */ (function (_super) {
    __extends(PollSubmitAnswerEvent, _super);
    function PollSubmitAnswerEvent(answer) {
        var _this = _super.call(this) || this;
        _this.event_name = 'PollSubmitAnswerEvent';
        _this.extra_args = { answer: answer.id };
        return _this;
    }
    return PollSubmitAnswerEvent;
}(ActivityEvent));
exports.PollSubmitAnswerEvent = PollSubmitAnswerEvent;
var DiscussionSharingVolunteerEvent = /** @class */ (function (_super) {
    __extends(DiscussionSharingVolunteerEvent, _super);
    function DiscussionSharingVolunteerEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'DiscussionSharingVolunteerEvent';
        return _this;
    }
    return DiscussionSharingVolunteerEvent;
}(ActivityEvent));
exports.DiscussionSharingVolunteerEvent = DiscussionSharingVolunteerEvent;
var DiscussionSharerDoneEvent = /** @class */ (function (_super) {
    __extends(DiscussionSharerDoneEvent, _super);
    function DiscussionSharerDoneEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'DiscussionSharerDoneEvent';
        return _this;
    }
    return DiscussionSharerDoneEvent;
}(ActivityEvent));
exports.DiscussionSharerDoneEvent = DiscussionSharerDoneEvent;
var WhereDoYouStandSubmitPredictionEvent = /** @class */ (function (_super) {
    __extends(WhereDoYouStandSubmitPredictionEvent, _super);
    function WhereDoYouStandSubmitPredictionEvent(choice) {
        var _this = _super.call(this) || this;
        _this.event_name = 'WhereDoYouStandSubmitPredictionEvent';
        _this.extra_args = { choice: choice.id };
        return _this;
    }
    return WhereDoYouStandSubmitPredictionEvent;
}(ActivityEvent));
exports.WhereDoYouStandSubmitPredictionEvent = WhereDoYouStandSubmitPredictionEvent;
var WhereDoYouStandSubmitPreferenceEvent = /** @class */ (function (_super) {
    __extends(WhereDoYouStandSubmitPreferenceEvent, _super);
    function WhereDoYouStandSubmitPreferenceEvent(choice) {
        var _this = _super.call(this) || this;
        _this.event_name = 'WhereDoYouStandSubmitPreferenceEvent';
        _this.extra_args = { choice: choice.id };
        return _this;
    }
    return WhereDoYouStandSubmitPreferenceEvent;
}(ActivityEvent));
exports.WhereDoYouStandSubmitPreferenceEvent = WhereDoYouStandSubmitPreferenceEvent;
var FeedbackSubmitEventAnswer = /** @class */ (function () {
    function FeedbackSubmitEventAnswer(q, answer, text) {
        this.feedbackquestion = q.id;
        this.rating_answer = answer;
        this.text_answer = text ? text : null;
        this.mcq_answer = answer;
        this.scale_answer = answer;
    }
    return FeedbackSubmitEventAnswer;
}());
exports.FeedbackSubmitEventAnswer = FeedbackSubmitEventAnswer;
var FeedbackSubmitEvent = /** @class */ (function (_super) {
    __extends(FeedbackSubmitEvent, _super);
    function FeedbackSubmitEvent(feedbacksubmiteventanswer_set) {
        var _this = _super.call(this) || this;
        _this.event_name = 'FeedbackSubmitEvent';
        _this.extra_args = {
            feedbacksubmiteventanswer_set: feedbacksubmiteventanswer_set
        };
        return _this;
    }
    return FeedbackSubmitEvent;
}(ActivityEvent));
exports.FeedbackSubmitEvent = FeedbackSubmitEvent;
var BuildAPitchSubmitEventEntry = /** @class */ (function () {
    function BuildAPitchSubmitEventEntry(value, order) {
        this.value = value;
        this.order = order;
    }
    return BuildAPitchSubmitEventEntry;
}());
exports.BuildAPitchSubmitEventEntry = BuildAPitchSubmitEventEntry;
var BuildAPitchSubmitPitchEvent = /** @class */ (function (_super) {
    __extends(BuildAPitchSubmitPitchEvent, _super);
    function BuildAPitchSubmitPitchEvent(buildapitchsubmissionentry_set) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BuildAPitchSubmitPitchEvent';
        _this.extra_args = {
            buildapitchsubmissionentry_set: buildapitchsubmissionentry_set
        };
        return _this;
    }
    return BuildAPitchSubmitPitchEvent;
}(ActivityEvent));
exports.BuildAPitchSubmitPitchEvent = BuildAPitchSubmitPitchEvent;
var BuildAPitchSharingDoneEvent = /** @class */ (function (_super) {
    __extends(BuildAPitchSharingDoneEvent, _super);
    function BuildAPitchSharingDoneEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'BuildAPitchSharingDoneEvent';
        return _this;
    }
    return BuildAPitchSharingDoneEvent;
}(ActivityEvent));
exports.BuildAPitchSharingDoneEvent = BuildAPitchSharingDoneEvent;
var BuildAPitchSubmitVoteEvent = /** @class */ (function (_super) {
    __extends(BuildAPitchSubmitVoteEvent, _super);
    function BuildAPitchSubmitVoteEvent(choice) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BuildAPitchSubmitVoteEvent';
        _this.extra_args = { voted_participant: choice };
        return _this;
    }
    return BuildAPitchSubmitVoteEvent;
}(ActivityEvent));
exports.BuildAPitchSubmitVoteEvent = BuildAPitchSubmitVoteEvent;
var PitchoMaticParticipantGeneratedEvent = /** @class */ (function (_super) {
    __extends(PitchoMaticParticipantGeneratedEvent, _super);
    function PitchoMaticParticipantGeneratedEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'PitchoMaticParticipantGeneratedEvent';
        return _this;
    }
    return PitchoMaticParticipantGeneratedEvent;
}(ActivityEvent));
exports.PitchoMaticParticipantGeneratedEvent = PitchoMaticParticipantGeneratedEvent;
var PitchoMaticParticipantInGroupEvent = /** @class */ (function (_super) {
    __extends(PitchoMaticParticipantInGroupEvent, _super);
    function PitchoMaticParticipantInGroupEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'PitchoMaticParticipantInGroupEvent';
        return _this;
    }
    return PitchoMaticParticipantInGroupEvent;
}(ActivityEvent));
exports.PitchoMaticParticipantInGroupEvent = PitchoMaticParticipantInGroupEvent;
var PitchoMaticParticipantReadyEvent = /** @class */ (function (_super) {
    __extends(PitchoMaticParticipantReadyEvent, _super);
    function PitchoMaticParticipantReadyEvent(pitch_prep_text) {
        var _this = _super.call(this) || this;
        _this.event_name = 'PitchoMaticParticipantReadyEvent';
        _this.extra_args = { pitch_prep_text: pitch_prep_text };
        return _this;
    }
    return PitchoMaticParticipantReadyEvent;
}(ActivityEvent));
exports.PitchoMaticParticipantReadyEvent = PitchoMaticParticipantReadyEvent;
var PitchoMaticSubmitFeedbackEvent = /** @class */ (function (_super) {
    __extends(PitchoMaticSubmitFeedbackEvent, _super);
    function PitchoMaticSubmitFeedbackEvent(pitchfeedbacksubmiteventanswer_set) {
        var _this = _super.call(this) || this;
        _this.event_name = 'PitchoMaticSubmitFeedbackEvent';
        _this.extra_args = {
            pitchfeedbacksubmiteventanswer_set: pitchfeedbacksubmiteventanswer_set
        };
        return _this;
    }
    return PitchoMaticSubmitFeedbackEvent;
}(ActivityEvent));
exports.PitchoMaticSubmitFeedbackEvent = PitchoMaticSubmitFeedbackEvent;
var BeginShareEvent = /** @class */ (function (_super) {
    __extends(BeginShareEvent, _super);
    function BeginShareEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'BeginShareEvent';
        return _this;
    }
    return BeginShareEvent;
}(ActivityEvent));
exports.BeginShareEvent = BeginShareEvent;
var EndShareEvent = /** @class */ (function (_super) {
    __extends(EndShareEvent, _super);
    function EndShareEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'EndShareEvent';
        return _this;
    }
    return EndShareEvent;
}(ActivityEvent));
exports.EndShareEvent = EndShareEvent;
var ParticipantOptInEvent = /** @class */ (function (_super) {
    __extends(ParticipantOptInEvent, _super);
    function ParticipantOptInEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'ParticipantOptInEvent';
        return _this;
    }
    return ParticipantOptInEvent;
}(ActivityEvent));
exports.ParticipantOptInEvent = ParticipantOptInEvent;
var ParticipantOptOutEvent = /** @class */ (function (_super) {
    __extends(ParticipantOptOutEvent, _super);
    function ParticipantOptOutEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'ParticipantOptOutEvent';
        return _this;
    }
    return ParticipantOptOutEvent;
}(ActivityEvent));
exports.ParticipantOptOutEvent = ParticipantOptOutEvent;
var SubmitSharingParticipantCommentEvent = /** @class */ (function (_super) {
    __extends(SubmitSharingParticipantCommentEvent, _super);
    function SubmitSharingParticipantCommentEvent(comment) {
        var _this = _super.call(this) || this;
        _this.event_name = 'SubmitSharingParticipantCommentEvent';
        _this.extra_args = { text: comment };
        return _this;
    }
    return SubmitSharingParticipantCommentEvent;
}(ActivityEvent));
exports.SubmitSharingParticipantCommentEvent = SubmitSharingParticipantCommentEvent;
var SubmitSharingParticipantReactionEvent = /** @class */ (function (_super) {
    __extends(SubmitSharingParticipantReactionEvent, _super);
    function SubmitSharingParticipantReactionEvent(reaction) {
        var _this = _super.call(this) || this;
        _this.event_name = 'SubmitSharingParticipantReactionEvent';
        _this.extra_args = { reaction: reaction };
        return _this;
    }
    return SubmitSharingParticipantReactionEvent;
}(ActivityEvent));
exports.SubmitSharingParticipantReactionEvent = SubmitSharingParticipantReactionEvent;
var SelectParticipantForShareEvent = /** @class */ (function (_super) {
    __extends(SelectParticipantForShareEvent, _super);
    function SelectParticipantForShareEvent(userId) {
        var _this = _super.call(this) || this;
        _this.event_name = 'SelectParticipantForShareEvent';
        _this.extra_args = { participant_code: userId };
        return _this;
    }
    return SelectParticipantForShareEvent;
}(ActivityEvent));
exports.SelectParticipantForShareEvent = SelectParticipantForShareEvent;
var ParticipantSelectCardEvent = /** @class */ (function (_super) {
    __extends(ParticipantSelectCardEvent, _super);
    function ParticipantSelectCardEvent(cardNumber) {
        var _this = _super.call(this) || this;
        _this.event_name = 'ParticipantSelectCardEvent';
        _this.extra_args = { card_number: cardNumber };
        return _this;
    }
    return ParticipantSelectCardEvent;
}(ActivityEvent));
exports.ParticipantSelectCardEvent = ParticipantSelectCardEvent;
var BrainstormToggleCategoryModeEvent = /** @class */ (function (_super) {
    __extends(BrainstormToggleCategoryModeEvent, _super);
    function BrainstormToggleCategoryModeEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'BrainstormToggleCategoryModeEvent';
        return _this;
    }
    return BrainstormToggleCategoryModeEvent;
}(ActivityEvent));
exports.BrainstormToggleCategoryModeEvent = BrainstormToggleCategoryModeEvent;
var BrainstormToggleParticipantNameEvent = /** @class */ (function (_super) {
    __extends(BrainstormToggleParticipantNameEvent, _super);
    function BrainstormToggleParticipantNameEvent(board) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormToggleParticipantNameEvent';
        _this.extra_args = { board: board };
        return _this;
    }
    return BrainstormToggleParticipantNameEvent;
}(ActivityEvent));
exports.BrainstormToggleParticipantNameEvent = BrainstormToggleParticipantNameEvent;
var BrainstormSubmissionCompleteInternalEvent = /** @class */ (function (_super) {
    __extends(BrainstormSubmissionCompleteInternalEvent, _super);
    function BrainstormSubmissionCompleteInternalEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'BrainstormSubmissionCompleteInternalEvent';
        return _this;
    }
    return BrainstormSubmissionCompleteInternalEvent;
}(ActivityEvent));
exports.BrainstormSubmissionCompleteInternalEvent = BrainstormSubmissionCompleteInternalEvent;
var BrainstormVotingCompleteInternalEvent = /** @class */ (function (_super) {
    __extends(BrainstormVotingCompleteInternalEvent, _super);
    function BrainstormVotingCompleteInternalEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'BrainstormVotingCompleteInternalEvent';
        return _this;
    }
    return BrainstormVotingCompleteInternalEvent;
}(ActivityEvent));
exports.BrainstormVotingCompleteInternalEvent = BrainstormVotingCompleteInternalEvent;
var BrainstormSubmitEvent = /** @class */ (function (_super) {
    __extends(BrainstormSubmitEvent, _super);
    function BrainstormSubmitEvent(text, title, category, groupId, idea_image, image_path) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormSubmitEvent';
        _this.extra_args = { idea: text, title: title, category: category, group_id: groupId };
        if (idea_image) {
            _this.extra_args = __assign(__assign({}, _this.extra_args), { idea_image: idea_image, image_path: image_path });
        }
        return _this;
    }
    return BrainstormSubmitEvent;
}(ActivityEvent));
exports.BrainstormSubmitEvent = BrainstormSubmitEvent;
var BrainstormSubmitVideoEvent = /** @class */ (function (_super) {
    __extends(BrainstormSubmitVideoEvent, _super);
    function BrainstormSubmitVideoEvent(idea) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormSubmitEvent';
        _this.extra_args = {
            id: idea.id,
            idea: idea.text,
            title: idea.title,
            category: idea.category,
            idea_video: idea.idea_video
        };
        return _this;
    }
    return BrainstormSubmitVideoEvent;
}(ActivityEvent));
exports.BrainstormSubmitVideoEvent = BrainstormSubmitVideoEvent;
var BrainstormSubmitDocumentEvent = /** @class */ (function (_super) {
    __extends(BrainstormSubmitDocumentEvent, _super);
    function BrainstormSubmitDocumentEvent(text, title, category, groupId, documentId) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormSubmitEvent';
        _this.extra_args = {
            idea: text,
            title: title,
            category: category,
            group_id: groupId,
            idea_document: documentId
        };
        return _this;
    }
    return BrainstormSubmitDocumentEvent;
}(ActivityEvent));
exports.BrainstormSubmitDocumentEvent = BrainstormSubmitDocumentEvent;
var BrainstormEditIdeaSubmitEvent = /** @class */ (function (_super) {
    __extends(BrainstormEditIdeaSubmitEvent, _super);
    function BrainstormEditIdeaSubmitEvent(id, text, title, category, groupId, idea_image, image_path) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormEditIdeaSubmitEvent';
        _this.extra_args = {
            brainstormidea: id,
            idea: text,
            title: title,
            category: category,
            group_id: groupId,
            idea_image: idea_image,
            image_path: image_path
        };
        return _this;
        // if (idea_image) {
        //   this.extra_args = {
        //     ...this.extra_args,
        //     idea_image: idea_image,
        //   };
        // }
        // if (image_path) {
        //   this.extra_args = {
        //     ...this.extra_args,
        //     image_path: image_path,
        //   };
        // }
    }
    return BrainstormEditIdeaSubmitEvent;
}(ActivityEvent));
exports.BrainstormEditIdeaSubmitEvent = BrainstormEditIdeaSubmitEvent;
var BrainstormImageSubmitEvent = /** @class */ (function (_super) {
    __extends(BrainstormImageSubmitEvent, _super);
    function BrainstormImageSubmitEvent(text, title, category, groupId, image_path) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormSubmitEvent';
        _this.extra_args = {
            idea: text,
            title: title,
            category: category,
            group_id: groupId,
            image_path: image_path
        };
        return _this;
    }
    return BrainstormImageSubmitEvent;
}(ActivityEvent));
exports.BrainstormImageSubmitEvent = BrainstormImageSubmitEvent;
var BrainstormSubmitIdeaCommentEvent = /** @class */ (function (_super) {
    __extends(BrainstormSubmitIdeaCommentEvent, _super);
    function BrainstormSubmitIdeaCommentEvent(text, ideaId) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormSubmitIdeaCommentEvent';
        _this.extra_args = {
            comment: text,
            brainstormidea: ideaId
        };
        return _this;
    }
    return BrainstormSubmitIdeaCommentEvent;
}(ActivityEvent));
exports.BrainstormSubmitIdeaCommentEvent = BrainstormSubmitIdeaCommentEvent;
var BrainstormRemoveIdeaCommentEvent = /** @class */ (function (_super) {
    __extends(BrainstormRemoveIdeaCommentEvent, _super);
    function BrainstormRemoveIdeaCommentEvent(commentId, ideaId) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormRemoveIdeaCommentEvent';
        _this.extra_args = {
            comment_id: commentId,
            brainstormidea: ideaId
        };
        return _this;
    }
    return BrainstormRemoveIdeaCommentEvent;
}(ActivityEvent));
exports.BrainstormRemoveIdeaCommentEvent = BrainstormRemoveIdeaCommentEvent;
var RemoveIdeaDocumentEvent = /** @class */ (function (_super) {
    __extends(RemoveIdeaDocumentEvent, _super);
    function RemoveIdeaDocumentEvent(ideaId) {
        var _this = _super.call(this) || this;
        _this.event_name = 'RemoveIdeaDocumentEvent';
        _this.extra_args = {
            brainstormidea: ideaId
        };
        return _this;
    }
    return RemoveIdeaDocumentEvent;
}(ActivityEvent));
exports.RemoveIdeaDocumentEvent = RemoveIdeaDocumentEvent;
var BrainstormSubmitIdeaHeartEvent = /** @class */ (function (_super) {
    __extends(BrainstormSubmitIdeaHeartEvent, _super);
    function BrainstormSubmitIdeaHeartEvent(ideaId) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormSubmitIdeaHeartEvent';
        _this.extra_args = {
            brainstormidea: ideaId,
            heart: true
        };
        return _this;
    }
    return BrainstormSubmitIdeaHeartEvent;
}(ActivityEvent));
exports.BrainstormSubmitIdeaHeartEvent = BrainstormSubmitIdeaHeartEvent;
var BrainstormRemoveIdeaHeartEvent = /** @class */ (function (_super) {
    __extends(BrainstormRemoveIdeaHeartEvent, _super);
    function BrainstormRemoveIdeaHeartEvent(ideaId, comment_id) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormRemoveIdeaHeartEvent';
        _this.extra_args = {
            brainstormidea: ideaId,
            comment_id: comment_id
        };
        return _this;
    }
    return BrainstormRemoveIdeaHeartEvent;
}(ActivityEvent));
exports.BrainstormRemoveIdeaHeartEvent = BrainstormRemoveIdeaHeartEvent;
var BrainstormRemoveSubmissionEvent = /** @class */ (function (_super) {
    __extends(BrainstormRemoveSubmissionEvent, _super);
    function BrainstormRemoveSubmissionEvent(id) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormRemoveSubmissionEvent';
        _this.extra_args = { brainstormidea: id };
        return _this;
    }
    return BrainstormRemoveSubmissionEvent;
}(ActivityEvent));
exports.BrainstormRemoveSubmissionEvent = BrainstormRemoveSubmissionEvent;
var BrainstormRenameCategoryEvent = /** @class */ (function (_super) {
    __extends(BrainstormRenameCategoryEvent, _super);
    function BrainstormRenameCategoryEvent(category, name, board) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormRenameCategoryEvent';
        _this.extra_args = { category: category, category_name: name, board: board };
        return _this;
    }
    return BrainstormRenameCategoryEvent;
}(ActivityEvent));
exports.BrainstormRenameCategoryEvent = BrainstormRenameCategoryEvent;
var BrainstormCreateCategoryEvent = /** @class */ (function (_super) {
    __extends(BrainstormCreateCategoryEvent, _super);
    function BrainstormCreateCategoryEvent(category, board) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormCreateCategoryEvent';
        _this.extra_args = { category_name: category, board: board };
        return _this;
    }
    return BrainstormCreateCategoryEvent;
}(ActivityEvent));
exports.BrainstormCreateCategoryEvent = BrainstormCreateCategoryEvent;
var BrainstormRemoveCategoryEvent = /** @class */ (function (_super) {
    __extends(BrainstormRemoveCategoryEvent, _super);
    function BrainstormRemoveCategoryEvent(catId, deleteIdeas) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormRemoveCategoryEvent';
        _this.extra_args = { category: catId, delete_ideas: deleteIdeas };
        return _this;
    }
    return BrainstormRemoveCategoryEvent;
}(ActivityEvent));
exports.BrainstormRemoveCategoryEvent = BrainstormRemoveCategoryEvent;
var BrainstormVoteEvent = /** @class */ (function (_super) {
    __extends(BrainstormVoteEvent, _super);
    function BrainstormVoteEvent(id) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormVoteEvent';
        _this.extra_args = { brainstormidea: id };
        return _this;
    }
    return BrainstormVoteEvent;
}(ActivityEvent));
exports.BrainstormVoteEvent = BrainstormVoteEvent;
var BrainstormSetCategoryEvent = /** @class */ (function (_super) {
    __extends(BrainstormSetCategoryEvent, _super);
    function BrainstormSetCategoryEvent(id, category) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormSetCategoryEvent';
        _this.extra_args = { brainstormidea: id, category: category };
        return _this;
    }
    return BrainstormSetCategoryEvent;
}(ActivityEvent));
exports.BrainstormSetCategoryEvent = BrainstormSetCategoryEvent;
var ExternalGroupingSubmitGroupEvent = /** @class */ (function (_super) {
    __extends(ExternalGroupingSubmitGroupEvent, _super);
    function ExternalGroupingSubmitGroupEvent(group_num, userId) {
        var _this = _super.call(this) || this;
        _this.event_name = 'ExternalGroupingSubmitGroupEvent';
        _this.extra_args = { participant_code: userId, group_num: group_num };
        return _this;
    }
    return ExternalGroupingSubmitGroupEvent;
}(ActivityEvent));
exports.ExternalGroupingSubmitGroupEvent = ExternalGroupingSubmitGroupEvent;
var GenericRoleplayParticipantDiscussedEvent = /** @class */ (function (_super) {
    __extends(GenericRoleplayParticipantDiscussedEvent, _super);
    function GenericRoleplayParticipantDiscussedEvent() {
        var _this = _super.call(this) || this;
        _this.event_name = 'GenericRoleplayParticipantDiscussedEvent';
        return _this;
    }
    return GenericRoleplayParticipantDiscussedEvent;
}(ActivityEvent));
exports.GenericRoleplayParticipantDiscussedEvent = GenericRoleplayParticipantDiscussedEvent;
var GenericRoleplayParticipantFeedbackEvent = /** @class */ (function (_super) {
    __extends(GenericRoleplayParticipantFeedbackEvent, _super);
    function GenericRoleplayParticipantFeedbackEvent(genericroleplayparticipantfeedbackanswer_set) {
        var _this = _super.call(this) || this;
        _this.event_name = 'GenericRoleplayParticipantFeedbackEvent';
        _this.extra_args = {
            genericroleplayparticipantfeedbackanswer_set: genericroleplayparticipantfeedbackanswer_set
        };
        return _this;
    }
    return GenericRoleplayParticipantFeedbackEvent;
}(ActivityEvent));
exports.GenericRoleplayParticipantFeedbackEvent = GenericRoleplayParticipantFeedbackEvent;
// export class CaseStudySaveFormEvent extends ActivityEvent {
//   event_name = 'CaseStudySaveFormEvent';
//   constructor(caseStudySubmitEventAnswer_set: CaseStudySubmitEventAnswer[]) {
//     super();
//     this.extra_args = {
//       casestudyeventanswer_set: caseStudySubmitEventAnswer_set,
//     };
//   }
// }
var CaseStudySubmitAnswerEvent = /** @class */ (function (_super) {
    __extends(CaseStudySubmitAnswerEvent, _super);
    function CaseStudySubmitAnswerEvent(json, texts) {
        var _this = _super.call(this) || this;
        _this.event_name = 'CaseStudySubmitAnswerEvent';
        _this.extra_args = { answer: json, answer_text: texts };
        return _this;
    }
    return CaseStudySubmitAnswerEvent;
}(ActivityEvent));
exports.CaseStudySubmitAnswerEvent = CaseStudySubmitAnswerEvent;
var CaseStudyDefaultWorksheetApplied = /** @class */ (function (_super) {
    __extends(CaseStudyDefaultWorksheetApplied, _super);
    function CaseStudyDefaultWorksheetApplied(val) {
        var _this = _super.call(this) || this;
        _this.event_name = 'CaseStudyDefaultWorksheetApplied';
        _this.extra_args = { default_worksheet_applied: { val: val } };
        return _this;
    }
    return CaseStudyDefaultWorksheetApplied;
}(ActivityEvent));
exports.CaseStudyDefaultWorksheetApplied = CaseStudyDefaultWorksheetApplied;
var CaseStudyTeamDoneEvent = /** @class */ (function (_super) {
    __extends(CaseStudyTeamDoneEvent, _super);
    function CaseStudyTeamDoneEvent() {
        var _this = _super.call(this) || this;
        _this.event_name = 'CaseStudyTeamDoneEvent';
        return _this;
    }
    return CaseStudyTeamDoneEvent;
}(ActivityEvent));
exports.CaseStudyTeamDoneEvent = CaseStudyTeamDoneEvent;
var GatherActivityContinueEvent = /** @class */ (function (_super) {
    __extends(GatherActivityContinueEvent, _super);
    function GatherActivityContinueEvent() {
        var _this = _super.call(this) || this;
        _this.event_name = 'GatherActivityContinueEvent';
        return _this;
    }
    return GatherActivityContinueEvent;
}(ActivityEvent));
exports.GatherActivityContinueEvent = GatherActivityContinueEvent;
var MontyHallSelectDoorEvent = /** @class */ (function (_super) {
    __extends(MontyHallSelectDoorEvent, _super);
    function MontyHallSelectDoorEvent(door_choice) {
        var _this = _super.call(this) || this;
        _this.event_name = 'MontyHallSelectDoorEvent';
        _this.extra_args = { door_choice: door_choice };
        return _this;
    }
    return MontyHallSelectDoorEvent;
}(ActivityEvent));
exports.MontyHallSelectDoorEvent = MontyHallSelectDoorEvent;
var MontyHallRepeatEvent = /** @class */ (function (_super) {
    __extends(MontyHallRepeatEvent, _super);
    function MontyHallRepeatEvent() {
        var _this = _super.call(this) || this;
        _this.event_name = 'MontyHallRepeatEvent';
        return _this;
    }
    return MontyHallRepeatEvent;
}(ActivityEvent));
exports.MontyHallRepeatEvent = MontyHallRepeatEvent;
var LobbySetNicknameEvent = /** @class */ (function (_super) {
    __extends(LobbySetNicknameEvent, _super);
    function LobbySetNicknameEvent(nickname, user_id) {
        var _this = _super.call(this) || this;
        _this.extra_args = { nickname: nickname, user_id: user_id };
        return _this;
    }
    return LobbySetNicknameEvent;
}(ActivityEvent));
exports.LobbySetNicknameEvent = LobbySetNicknameEvent;
var JumpEvent = /** @class */ (function (_super) {
    __extends(JumpEvent, _super);
    function JumpEvent(nav_activity) {
        var _this = _super.call(this) || this;
        _this.event_name = 'JumpEvent';
        _this.extra_args = { nav_activity: nav_activity };
        return _this;
    }
    return JumpEvent;
}(ActivityEvent));
exports.JumpEvent = JumpEvent;
//
//
//
//
var CreateGroupingEvent = /** @class */ (function (_super) {
    __extends(CreateGroupingEvent, _super);
    function CreateGroupingEvent(title) {
        var _this = _super.call(this) || this;
        _this.event_name = 'CreateGroupingEvent';
        _this.extra_args = { title: title };
        return _this;
    }
    return CreateGroupingEvent;
}(ActivityEvent));
exports.CreateGroupingEvent = CreateGroupingEvent;
var EditGroupTitleEvent = /** @class */ (function (_super) {
    __extends(EditGroupTitleEvent, _super);
    function EditGroupTitleEvent(group, title) {
        var _this = _super.call(this) || this;
        _this.event_name = 'EditGroupTitleEvent';
        _this.extra_args = { group: group, title: title };
        return _this;
    }
    return EditGroupTitleEvent;
}(ActivityEvent));
exports.EditGroupTitleEvent = EditGroupTitleEvent;
var EditGroupingTitleEvent = /** @class */ (function (_super) {
    __extends(EditGroupingTitleEvent, _super);
    function EditGroupingTitleEvent(grouping, title) {
        var _this = _super.call(this) || this;
        _this.event_name = 'EditGroupingTitleEvent';
        _this.extra_args = { grouping: grouping, title: title };
        return _this;
    }
    return EditGroupingTitleEvent;
}(ActivityEvent));
exports.EditGroupingTitleEvent = EditGroupingTitleEvent;
var SelectGroupingEvent = /** @class */ (function (_super) {
    __extends(SelectGroupingEvent, _super);
    function SelectGroupingEvent(grouping) {
        var _this = _super.call(this) || this;
        _this.event_name = 'SelectGroupingEvent';
        _this.extra_args = { grouping: grouping };
        return _this;
    }
    return SelectGroupingEvent;
}(ActivityEvent));
exports.SelectGroupingEvent = SelectGroupingEvent;
var CreateGroupsEvent = /** @class */ (function (_super) {
    __extends(CreateGroupsEvent, _super);
    function CreateGroupsEvent(grouping, groups) {
        var _this = _super.call(this) || this;
        _this.event_name = 'CreateGroupsEvent';
        _this.extra_args = { grouping: grouping, groups: groups };
        return _this;
    }
    return CreateGroupsEvent;
}(ActivityEvent));
exports.CreateGroupsEvent = CreateGroupsEvent;
var AllowParticipantGroupingEvent = /** @class */ (function (_super) {
    __extends(AllowParticipantGroupingEvent, _super);
    function AllowParticipantGroupingEvent(permission) {
        var _this = _super.call(this) || this;
        _this.event_name = 'AllowParticipantGroupingEvent';
        _this.extra_args = { allow: permission };
        return _this;
    }
    return AllowParticipantGroupingEvent;
}(ActivityEvent));
exports.AllowParticipantGroupingEvent = AllowParticipantGroupingEvent;
var ViewGroupingEvent = /** @class */ (function (_super) {
    __extends(ViewGroupingEvent, _super);
    function ViewGroupingEvent(permission) {
        var _this = _super.call(this) || this;
        _this.event_name = 'ViewGroupingEvent';
        _this.extra_args = { view: permission };
        return _this;
    }
    return ViewGroupingEvent;
}(ActivityEvent));
exports.ViewGroupingEvent = ViewGroupingEvent;
var UpdateGroupingStyleEvent = /** @class */ (function (_super) {
    __extends(UpdateGroupingStyleEvent, _super);
    function UpdateGroupingStyleEvent(grouping, permission) {
        var _this = _super.call(this) || this;
        _this.event_name = 'UpdateGroupingStyleEvent';
        _this.extra_args = { grouping: grouping, style: permission };
        return _this;
    }
    return UpdateGroupingStyleEvent;
}(ActivityEvent));
exports.UpdateGroupingStyleEvent = UpdateGroupingStyleEvent;
var AllowParticipantGroupingMidActivityEvent = /** @class */ (function (_super) {
    __extends(AllowParticipantGroupingMidActivityEvent, _super);
    function AllowParticipantGroupingMidActivityEvent(permission) {
        var _this = _super.call(this) || this;
        _this.event_name = 'AllowParticipantGroupingMidActivityEvent';
        _this.extra_args = { allow: permission };
        return _this;
    }
    return AllowParticipantGroupingMidActivityEvent;
}(ActivityEvent));
exports.AllowParticipantGroupingMidActivityEvent = AllowParticipantGroupingMidActivityEvent;
var CreateGroupEvent = /** @class */ (function (_super) {
    __extends(CreateGroupEvent, _super);
    function CreateGroupEvent(grouping, title) {
        var _this = _super.call(this) || this;
        _this.event_name = 'CreateGroupEvent';
        _this.extra_args = { grouping: grouping, title: title };
        return _this;
    }
    return CreateGroupEvent;
}(ActivityEvent));
exports.CreateGroupEvent = CreateGroupEvent;
var DeleteGroupingEvent = /** @class */ (function (_super) {
    __extends(DeleteGroupingEvent, _super);
    function DeleteGroupingEvent(grouping) {
        var _this = _super.call(this) || this;
        _this.event_name = 'DeleteGroupingEvent';
        _this.extra_args = { grouping: grouping };
        return _this;
    }
    return DeleteGroupingEvent;
}(ActivityEvent));
exports.DeleteGroupingEvent = DeleteGroupingEvent;
var DeleteGroupingGroupEvent = /** @class */ (function (_super) {
    __extends(DeleteGroupingGroupEvent, _super);
    function DeleteGroupingGroupEvent(group) {
        var _this = _super.call(this) || this;
        _this.event_name = 'DeleteGroupingGroupEvent';
        _this.extra_args = { group: group };
        return _this;
    }
    return DeleteGroupingGroupEvent;
}(ActivityEvent));
exports.DeleteGroupingGroupEvent = DeleteGroupingGroupEvent;
var GroupingAssignParticipantEvent = /** @class */ (function (_super) {
    __extends(GroupingAssignParticipantEvent, _super);
    function GroupingAssignParticipantEvent(grouping, group, participant_code) {
        var _this = _super.call(this) || this;
        _this.event_name = 'GroupingAssignParticipantEvent';
        _this.extra_args = { grouping: grouping, group: group, participant_code: participant_code };
        return _this;
    }
    return GroupingAssignParticipantEvent;
}(ActivityEvent));
exports.GroupingAssignParticipantEvent = GroupingAssignParticipantEvent;
var RemoveParticipantFromGroupEvent = /** @class */ (function (_super) {
    __extends(RemoveParticipantFromGroupEvent, _super);
    function RemoveParticipantFromGroupEvent(grouping, group, participant_code) {
        var _this = _super.call(this) || this;
        _this.event_name = 'RemoveParticipantFromGroupEvent';
        _this.extra_args = { grouping: grouping, group: group, participant_code: participant_code };
        return _this;
    }
    return RemoveParticipantFromGroupEvent;
}(ActivityEvent));
exports.RemoveParticipantFromGroupEvent = RemoveParticipantFromGroupEvent;
var GroupingParticipantSelfJoinEvent = /** @class */ (function (_super) {
    __extends(GroupingParticipantSelfJoinEvent, _super);
    function GroupingParticipantSelfJoinEvent(grouping, group) {
        var _this = _super.call(this) || this;
        _this.event_name = 'GroupingParticipantSelfJoinEvent';
        _this.extra_args = { grouping: grouping, group: group };
        return _this;
    }
    return GroupingParticipantSelfJoinEvent;
}(ActivityEvent));
exports.GroupingParticipantSelfJoinEvent = GroupingParticipantSelfJoinEvent;
var StartCaseStudyGroupEvent = /** @class */ (function (_super) {
    __extends(StartCaseStudyGroupEvent, _super);
    function StartCaseStudyGroupEvent(id) {
        var _this = _super.call(this) || this;
        _this.event_name = 'StartCaseStudyGroupEvent';
        _this.extra_args = { grouping: id };
        return _this;
    }
    return StartCaseStudyGroupEvent;
}(ActivityEvent));
exports.StartCaseStudyGroupEvent = StartCaseStudyGroupEvent;
var StartBrainstormGroupEvent = /** @class */ (function (_super) {
    __extends(StartBrainstormGroupEvent, _super);
    function StartBrainstormGroupEvent(id, board) {
        var _this = _super.call(this) || this;
        _this.event_name = 'StartBrainstormGroupEvent';
        _this.extra_args = { grouping: id, board: id };
        return _this;
    }
    return StartBrainstormGroupEvent;
}(ActivityEvent));
exports.StartBrainstormGroupEvent = StartBrainstormGroupEvent;
var AssignGroupingToActivities = /** @class */ (function (_super) {
    __extends(AssignGroupingToActivities, _super);
    function AssignGroupingToActivities(id, activityIDs) {
        var _this = _super.call(this) || this;
        _this.event_name = 'AssignGroupingToActivities';
        _this.extra_args = { grouping: id, activity_ids: activityIDs };
        return _this;
    }
    return AssignGroupingToActivities;
}(ActivityEvent));
exports.AssignGroupingToActivities = AssignGroupingToActivities;
var ResetGroupingEvent = /** @class */ (function (_super) {
    __extends(ResetGroupingEvent, _super);
    function ResetGroupingEvent(id) {
        var _this = _super.call(this) || this;
        _this.event_name = 'ResetGroupingEvent';
        _this.extra_args = { grouping: id };
        return _this;
    }
    return ResetGroupingEvent;
}(ActivityEvent));
exports.ResetGroupingEvent = ResetGroupingEvent;
var CardsShuffleEvent = /** @class */ (function (_super) {
    __extends(CardsShuffleEvent, _super);
    function CardsShuffleEvent(deal_number) {
        var _this = _super.call(this) || this;
        _this.event_name = 'CardsShuffleEvent';
        _this.extra_args = { deal_number: deal_number };
        return _this;
    }
    return CardsShuffleEvent;
}(ActivityEvent));
exports.CardsShuffleEvent = CardsShuffleEvent;
var CardsStartSharingStageEvent = /** @class */ (function (_super) {
    __extends(CardsStartSharingStageEvent, _super);
    function CardsStartSharingStageEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'CardsStartSharingStageEvent';
        return _this;
    }
    return CardsStartSharingStageEvent;
}(ActivityEvent));
exports.CardsStartSharingStageEvent = CardsStartSharingStageEvent;
var CardsStartSetupStageEvent = /** @class */ (function (_super) {
    __extends(CardsStartSetupStageEvent, _super);
    function CardsStartSetupStageEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'CardsStartSetupStageEvent';
        return _this;
    }
    return CardsStartSetupStageEvent;
}(ActivityEvent));
exports.CardsStartSetupStageEvent = CardsStartSetupStageEvent;
var CardsSetSharingTime = /** @class */ (function (_super) {
    __extends(CardsSetSharingTime, _super);
    function CardsSetSharingTime(sharing_time) {
        var _this = _super.call(this) || this;
        _this.event_name = 'CardsSetSharingTime';
        _this.extra_args = { sharing_time: sharing_time };
        return _this;
    }
    return CardsSetSharingTime;
}(ActivityEvent));
exports.CardsSetSharingTime = CardsSetSharingTime;
var CardsSetParticipantSkipCardsPermissionEvent = /** @class */ (function (_super) {
    __extends(CardsSetParticipantSkipCardsPermissionEvent, _super);
    function CardsSetParticipantSkipCardsPermissionEvent(val) {
        var _this = _super.call(this) || this;
        _this.event_name = 'CardsSetParticipantSkipCardsPermissionEvent';
        _this.extra_args = { val: val };
        return _this;
    }
    return CardsSetParticipantSkipCardsPermissionEvent;
}(ActivityEvent));
exports.CardsSetParticipantSkipCardsPermissionEvent = CardsSetParticipantSkipCardsPermissionEvent;
var CardsAddParticipantToCurrentlySharingEvent = /** @class */ (function (_super) {
    __extends(CardsAddParticipantToCurrentlySharingEvent, _super);
    function CardsAddParticipantToCurrentlySharingEvent(val) {
        var _this = _super.call(this) || this;
        _this.event_name = 'CardsAddParticipantToCurrentlySharingEvent';
        _this.extra_args = { val: val };
        return _this;
    }
    return CardsAddParticipantToCurrentlySharingEvent;
}(ActivityEvent));
exports.CardsAddParticipantToCurrentlySharingEvent = CardsAddParticipantToCurrentlySharingEvent;
var CardsParticipantReadyEvent = /** @class */ (function (_super) {
    __extends(CardsParticipantReadyEvent, _super);
    function CardsParticipantReadyEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'CardsParticipantReadyEvent';
        return _this;
    }
    return CardsParticipantReadyEvent;
}(ActivityEvent));
exports.CardsParticipantReadyEvent = CardsParticipantReadyEvent;
var CardsRestartActivityEvent = /** @class */ (function (_super) {
    __extends(CardsRestartActivityEvent, _super);
    function CardsRestartActivityEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'CardsRestartActivityEvent';
        return _this;
    }
    return CardsRestartActivityEvent;
}(ActivityEvent));
exports.CardsRestartActivityEvent = CardsRestartActivityEvent;
var BrainstormEditInstructionEvent = /** @class */ (function (_super) {
    __extends(BrainstormEditInstructionEvent, _super);
    function BrainstormEditInstructionEvent(title, board) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormEditBoardInstruction';
        _this.extra_args = { instructions: title, board: board };
        return _this;
    }
    return BrainstormEditInstructionEvent;
}(ActivityEvent));
exports.BrainstormEditInstructionEvent = BrainstormEditInstructionEvent;
var HostChangeBoardEvent = /** @class */ (function (_super) {
    __extends(HostChangeBoardEvent, _super);
    function HostChangeBoardEvent(board) {
        var _this = _super.call(this) || this;
        _this.event_name = 'HostChangeBoardEvent';
        _this.extra_args = { host_board: board };
        return _this;
    }
    return HostChangeBoardEvent;
}(ActivityEvent));
exports.HostChangeBoardEvent = HostChangeBoardEvent;
var ParticipantChangeBoardEvent = /** @class */ (function (_super) {
    __extends(ParticipantChangeBoardEvent, _super);
    function ParticipantChangeBoardEvent(board) {
        var _this = _super.call(this) || this;
        _this.event_name = 'ParticipantChangeBoardEvent';
        _this.extra_args = { board: board };
        return _this;
    }
    return ParticipantChangeBoardEvent;
}(ActivityEvent));
exports.ParticipantChangeBoardEvent = ParticipantChangeBoardEvent;
var BrainstormEditSubInstructionEvent = /** @class */ (function (_super) {
    __extends(BrainstormEditSubInstructionEvent, _super);
    function BrainstormEditSubInstructionEvent(instructions, board) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormEditSubInstruction';
        _this.extra_args = { sub_instructions: instructions, board: board };
        return _this;
    }
    return BrainstormEditSubInstructionEvent;
}(ActivityEvent));
exports.BrainstormEditSubInstructionEvent = BrainstormEditSubInstructionEvent;
var BrainstormAddBoardEventBaseEvent = /** @class */ (function (_super) {
    __extends(BrainstormAddBoardEventBaseEvent, _super);
    function BrainstormAddBoardEventBaseEvent(name, order, instructions, sub_instructions) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormAddBoardEventBaseEvent';
        _this.extra_args = {
            name: name,
            order: order,
            instructions: instructions,
            sub_instructions: sub_instructions
        };
        return _this;
    }
    return BrainstormAddBoardEventBaseEvent;
}(ActivityEvent));
exports.BrainstormAddBoardEventBaseEvent = BrainstormAddBoardEventBaseEvent;
var BrainstormChangeBoardStatusEvent = /** @class */ (function (_super) {
    __extends(BrainstormChangeBoardStatusEvent, _super);
    function BrainstormChangeBoardStatusEvent(status, board) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormChangeBoardStatusEvent';
        _this.extra_args = { status: status, board: board };
        return _this;
    }
    return BrainstormChangeBoardStatusEvent;
}(ActivityEvent));
exports.BrainstormChangeBoardStatusEvent = BrainstormChangeBoardStatusEvent;
var BrainstormRemoveBoardEvent = /** @class */ (function (_super) {
    __extends(BrainstormRemoveBoardEvent, _super);
    function BrainstormRemoveBoardEvent(id) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormRemoveBoardEvent';
        _this.extra_args = { board: id };
        return _this;
    }
    return BrainstormRemoveBoardEvent;
}(ActivityEvent));
exports.BrainstormRemoveBoardEvent = BrainstormRemoveBoardEvent;
var BrainstormToggleMeetingMode = /** @class */ (function (_super) {
    __extends(BrainstormToggleMeetingMode, _super);
    function BrainstormToggleMeetingMode(val) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormToggleMeetingMode';
        _this.extra_args = { meeting_mode: val };
        return _this;
    }
    return BrainstormToggleMeetingMode;
}(ActivityEvent));
exports.BrainstormToggleMeetingMode = BrainstormToggleMeetingMode;
var BrainstormChangeModeEvent = /** @class */ (function (_super) {
    __extends(BrainstormChangeModeEvent, _super);
    function BrainstormChangeModeEvent(val, id) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormChangeModeEvent';
        _this.extra_args = { mode: val, board: id };
        return _this;
    }
    return BrainstormChangeModeEvent;
}(ActivityEvent));
exports.BrainstormChangeModeEvent = BrainstormChangeModeEvent;
var BrainstormClearBoardIdeaEvent = /** @class */ (function (_super) {
    __extends(BrainstormClearBoardIdeaEvent, _super);
    function BrainstormClearBoardIdeaEvent(id) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormClearBoardIdeaEvent';
        _this.extra_args = { board: id };
        return _this;
    }
    return BrainstormClearBoardIdeaEvent;
}(ActivityEvent));
exports.BrainstormClearBoardIdeaEvent = BrainstormClearBoardIdeaEvent;
var BrainstormBoardSortOrderEvent = /** @class */ (function (_super) {
    __extends(BrainstormBoardSortOrderEvent, _super);
    function BrainstormBoardSortOrderEvent(sort, board) {
        var _this = _super.call(this) || this;
        _this.event_name = 'BrainstormBoardSortOrderEvent';
        _this.extra_args = { sort: sort, board: board };
        return _this;
    }
    return BrainstormBoardSortOrderEvent;
}(ActivityEvent));
exports.BrainstormBoardSortOrderEvent = BrainstormBoardSortOrderEvent;
var GetUpdatedLessonDetailEvent = /** @class */ (function (_super) {
    __extends(GetUpdatedLessonDetailEvent, _super);
    function GetUpdatedLessonDetailEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event_name = 'GetUpdatedLessonDetailEvent';
        return _this;
    }
    return GetUpdatedLessonDetailEvent;
}(ActivityEvent));
exports.GetUpdatedLessonDetailEvent = GetUpdatedLessonDetailEvent;
