"use strict";
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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BoardComponent = void 0;
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var lodash_1 = require("lodash");
var global = require("src/app/globals");
var image_view_dialog_1 = require("src/app/pages/lesson/shared/dialogs/image-view/image-view.dialog");
var schema_1 = require("src/app/services/backend/schema");
var idea_creation_dialog_1 = require("src/app/shared/dialogs/idea-creation-dialog/idea-creation.dialog");
var BoardComponent = /** @class */ (function () {
    function BoardComponent(contextService, matDialog, utilsService, activitySettingsService, httpClient, permissionsService, sharingToolService, brainstormService) {
        this.contextService = contextService;
        this.matDialog = matDialog;
        this.utilsService = utilsService;
        this.activitySettingsService = activitySettingsService;
        this.httpClient = httpClient;
        this.permissionsService = permissionsService;
        this.sharingToolService = sharingToolService;
        this.brainstormService = brainstormService;
        this.showParticipantsGroupsDropdown = false;
        this.instructions = '';
        this.sub_instructions = '';
        this.voteScreen = false;
        this.VnSComplete = false;
        this.showUserName = true;
        this.minWidth = 'small';
        this.colDeleted = 0;
        this.joinedUsers = [];
        this.answeredParticipants = [];
        this.unansweredParticipants = [];
        this.ideaSubmittedUsersCount = 0;
        this.voteSubmittedUsersCount = 0;
        this.shownSubmissionCompleteNofitication = false;
        this.imagesURLs = [
            'localhost/media/Capture_LGXPk9s.JPG',
            'localhost/media/Capture_LGXPk9s.JPG',
            '../../../../../assets//img/Desk_lightblue2.jpg',
        ];
        this.sendMessage = new core_1.EventEmitter();
    }
    BoardComponent.prototype.ngOnInit = function () {
        var _this = this;
        // super.ngOnInit();
        this.act = this.activityState.brainstormactivity;
        this.permissionsService.hasPermission('PARTICIPANT').then(function (val) {
            if (val) {
                _this.participantCode = _this.participantCode;
                if (_this.board.board_activity.grouping && _this.board.board_activity.grouping.groups.length) {
                    _this.initParticipantGrouping(_this.act);
                }
            }
        });
        this.permissionsService.hasPermission('ADMIN').then(function (val) {
            if (val) {
                if (_this.eventType === 'AssignGroupingToActivities') {
                }
                _this.applyGroupingOnActivity(_this.activityState);
                _this.classificationTypes = [
                    {
                        type: 'everyone',
                        title: 'Everyone',
                        description: "Display everyone's work",
                        imgUrl: '/assets/img/brainstorm/everyone.svg'
                    },
                    {
                        type: 'groups',
                        title: 'Groups',
                        description: "Display group's work",
                        imgUrl: '/assets/img/brainstorm/groups.svg'
                    },
                ];
            }
        });
        this.onChanges();
        this.settingsSubscription = this.activitySettingsService.settingChange$.subscribe(function (val) {
            if (val && val.controlName === 'participantNames') {
                // this.showUserName = val.state;
                // this.sendMessage.emit(new BrainstormToggleParticipantNameEvent());
            }
            if (val && val.controlName === 'categorize') {
                _this.sendMessage.emit(new schema_1.BrainstormToggleCategoryModeEvent());
            }
            if (val && val.controlName === 'resetGrouping') {
                if (_this.board.board_activity.grouping) {
                    var groupingID = _this.board.board_activity.grouping.id;
                    _this.sendMessage.emit(new schema_1.ResetGroupingEvent(groupingID));
                }
            }
            if (val && val.controlName === 'cardSize') {
                _this.minWidth = val.state.name;
            }
        });
        this.saveIdeaSubscription = this.brainstormService.saveIdea$.subscribe(function (val) {
            if (val) {
                _this.saveIdea(val);
            }
        });
    };
    BoardComponent.prototype.applyGroupingOnActivity = function (state) {
        // const activityType = this.getActivityType().toLowerCase();
        if (this.board.board_activity.grouping !== null) {
            // if grouping is already applied return
            return;
        }
        // if grouping is not applied check if grouping tool has
        // information if grouping should be applied on this activity or not
        var sm = state;
        if (sm && sm.running_tools && sm.running_tools.grouping_tool) {
            var gt = sm.running_tools.grouping_tool;
            for (var _i = 0, _a = gt.groupings; _i < _a.length; _i++) {
                var grouping = _a[_i];
                // if (
                //   grouping.assignedActivities &&
                //   grouping.assignedActivities.includes(state[activityType].activity_id)
                // ) {
                // const assignedActivities = ['1637726964645'];
                // if (assignedActivities.includes(state[activityType].activity_id)) {
                // if (activityType === 'brainstormactivity') {
                this.sendMessage.emit(new schema_1.StartBrainstormGroupEvent(grouping.id, this.board.id));
                // } else if (activityType === 'casestudyactivity') {
                //   this.sendMessage.emit(new StartCaseStudyGroupEvent(grouping.id));
                // }
                break;
                // }
            }
        }
    };
    BoardComponent.prototype.ngOnChanges = function () {
        this.onChanges();
    };
    BoardComponent.prototype.onChanges = function () {
        var _this = this;
        var act = this.activityState.brainstormactivity;
        this.act = lodash_1.cloneDeep(this.activityState.brainstormactivity);
        // populate groupings dropdown
        if (this.board &&
            this.board.board_activity.grouping &&
            this.board.board_activity.grouping.groups.length) {
            this.permissionsService.hasPermission('PARTICIPANT').then(function (val) {
                if (val) {
                    _this.initParticipantGrouping(_this.act);
                }
            });
            this.permissionsService.hasPermission('ADMIN').then(function (val) {
                if (val) {
                    _this.participantGroups = _this.board.board_activity.grouping.groups;
                }
            });
        }
        else {
            // grouping is null in activity
            if (this.eventType === 'AssignGroupingToActivities') {
                this.applyGroupingOnActivity(this.activityState);
            }
        }
        var sm = this.activityState;
        if (sm && sm.running_tools && sm.running_tools.grouping_tool) {
            var gt = sm.running_tools.grouping_tool;
            this.sharingToolService.updateParticipantGroupingToolDialog(gt);
        }
        this.joinedUsers = this.activityState.lesson_run.participant_set;
        this.instructions = this.board.board_activity.instructions;
        this.sub_instructions = this.board.board_activity.sub_instructions;
        this.boardMode = this.board.board_activity.mode;
        this.showUserName = this.board.board_activity.show_participant_name_flag;
    };
    BoardComponent.prototype.ngOnDestroy = function () {
        this.contextService.destroyActivityTimer();
        if (this.settingsSubscription) {
            this.settingsSubscription.unsubscribe();
        }
        if (this.saveIdeaSubscription) {
            this.saveIdeaSubscription.unsubscribe();
        }
        if (this.dialogRef) {
            this.dialogRef.close();
        }
    };
    BoardComponent.prototype.getParticipantGroup = function (participantCode, participantGroups) {
        return this.brainstormService.getMyGroup(participantCode, participantGroups);
    };
    BoardComponent.prototype.initParticipantGrouping = function (act) {
        var _this = this;
        // Check if groups are created
        // if groups are present then check if participant is in the group
        // if participant is not present in the group then open grouping info dialog
        this.participantGroups = this.board.board_activity.grouping.groups;
        if (this.participantGroups.length > 0) {
            this.myGroup = this.getParticipantGroup(this.participantCode, this.participantGroups);
            if (this.myGroup === null) {
                // There are groups in the activity but this participant is not in any groups
                if (this.dialogRef) {
                    this.sharingToolService.updateParticipantGroupingInfoDialog(this.activityState.running_tools.grouping_tool);
                    // this.dialogRef.close();
                    // this.dialogRef = null;
                }
                else if (!this.dialogRef || !this.dialogRef.componentInstance) {
                    this.dialogRef = this.sharingToolService.openParticipantGroupingInfoDialog(this.activityState, this.participantCode);
                    // this.dialogRef =
                    // this.sharingToolService.openParticipantGroupingToolDialog(this.activityState);
                    this.sharingToolService.sendMessage$.subscribe(function (v) {
                        if (v) {
                            _this.sendMessage.emit(v);
                        }
                    });
                }
            }
            else {
                // filter ideas on participant screen by the group they are in.
                this.filterIdeasBasedOnGroup(this.myGroup);
                if (this.dialogRef) {
                    this.dialogRef.close();
                }
            }
        }
    };
    BoardComponent.prototype.resetGrouping = function () {
        this.sendMessage.emit(new schema_1.ResetGroupingEvent(this.board.board_activity.grouping.id));
    };
    BoardComponent.prototype.getPersonName = function (idea) {
        if (idea && idea.submitting_participant) {
            var user = this.joinedUsers.find(function (u) { return u.participant_code === idea.submitting_participant.participant_code; });
            return user.display_name;
        }
    };
    BoardComponent.prototype.getMinWidth = function () {
        return this.minWidth === 'small' ? 288 : this.minWidth === 'medium' ? 360 : 480;
    };
    BoardComponent.prototype.classificationTypeChanged = function (selectedClassificationType) {
        // console.log(selectedClassificationType);
        var sct = selectedClassificationType;
        if (sct.type === 'everyone') {
            // this.participantGroups = null;
            this.selectedParticipantGroup = null;
            this.showParticipantsGroupsDropdown = false;
            this.act = lodash_1.cloneDeep(this.activityState.brainstormactivity);
        }
        else if (sct.type === 'groups') {
            this.participantGroups = this.board.board_activity.grouping.groups;
            this.showParticipantsGroupsDropdown = true;
        }
        else if (sct.type === 'individuals') {
            this.participantGroups = null;
        }
    };
    BoardComponent.prototype.ParticipantGroupChanged = function (selectedParticipantGroup) {
        this.filterIdeasBasedOnGroup(selectedParticipantGroup);
    };
    BoardComponent.prototype.filterIdeasBasedOnGroup = function (selectedParticipantGroup) {
        // console.log(selectedParticipantGroup);
        // console.log(this.act);
        var board = lodash_1.cloneDeep(this.board);
        for (var i = 0; i < board.brainstormcategory_set.length; i++) {
            var category = board.brainstormcategory_set[i];
            if (!category.removed) {
                for (var j = 0; j < category.brainstormidea_set.length; j++) {
                    var idea = category.brainstormidea_set[j];
                    if (idea.submitting_participant) {
                        if (!selectedParticipantGroup.participants.includes(idea.submitting_participant.participant_code)) {
                            category.brainstormidea_set.splice(j, 1);
                            j--;
                        }
                    }
                }
            }
        }
        this.board = board;
        this.eventType = 'filtered';
    };
    // loadUsersCounts() {
    //   this.joinedUsers = [];
    //   this.answeredParticipants = [];
    //   this.unansweredParticipants = [];
    //   this.joinedUsers = this.getActiveParticipants();
    //   // participant_vote_counts
    //   if (!this.voteScreen) {
    //     this.activityState.brainstormactivity.submitted_participants.forEach((code) => {
    //       this.answeredParticipants.push(this.getParticipantName(code.participant_code));
    //     });
    //   } else if (this.voteScreen) {
    //     this.activityState.brainstormactivity.participant_vote_counts.forEach((code) => {
    //       this.answeredParticipants.push(this.getParticipantName(code.participant_code));
    //     });
    //   }
    //   this.unansweredParticipants = this.getUnAnsweredUsers();
    // }
    // getUnAnsweredUsers() {
    //   const answered = this.answeredParticipants;
    //   const active = [];
    //   for (let index = 0; index < this.joinedUsers.length; index++) {
    //     active.push(this.joinedUsers[index].display_name);
    //   }
    //   return active.filter((name) => !answered.includes(name));
    // }
    // isAllSubmissionsComplete(act: BrainstormActivity): boolean {
    //   const maxSubmissions = act.max_participant_submissions;
    //   let submissions = 0;
    //   act.participant_submission_counts.forEach((element) => {
    //     submissions = submissions + element.count;
    //   });
    //   let activeParticipants = 0;
    //   this.activityState.lesson_run.participant_set.forEach((element) => {
    //     if (element.is_active) {
    //       activeParticipants = activeParticipants + 1;
    //     }
    //   });
    //   const totalMaxSubmissions = activeParticipants * maxSubmissions;
    //   const totalCurrentSubmissions = this.getUsersIdeas(act).length;
    //   if (totalMaxSubmissions === totalCurrentSubmissions) {
    //     return true;
    //   }
    //   return false;
    // }
    BoardComponent.prototype.getUsersIdeas = function (act) {
        var arr = [];
        this.board.brainstormcategory_set.forEach(function (category) {
            if (!category.removed) {
                category.brainstormidea_set.forEach(function (idea) {
                    if (!idea.removed) {
                        arr.push(idea);
                    }
                });
            }
        });
        arr = arr.filter(function (v, i, s) { return i === s.findIndex(function (t) { return t.submitting_participant === v.submitting_participant; }); });
        return arr;
    };
    // getVoteSubmittedUsersCount(act: BrainstormActivity) {
    //   return act.participant_vote_counts.length;
    // }
    BoardComponent.prototype.deleteIdea = function (id) {
        this.sendMessage.emit(new schema_1.BrainstormRemoveSubmissionEvent(id));
    };
    BoardComponent.prototype.sendSocketMessage = function ($event) {
        this.sendMessage.emit($event);
    };
    BoardComponent.prototype.viewImage = function (imageUrl) {
        var dialogRef = this.matDialog
            .open(image_view_dialog_1.ImageViewDialogComponent, {
            data: { imageUrl: imageUrl },
            disableClose: false,
            panelClass: 'image-view-dialog'
        })
            .afterClosed()
            .subscribe(function (res) { });
    };
    BoardComponent.prototype.addCardUnderCategory = function (category) {
        this.openDialog(category);
    };
    BoardComponent.prototype.openDialog = function (category) {
        var _this = this;
        var dialogRef = this.matDialog.open(idea_creation_dialog_1.IdeaCreationDialogComponent, {
            panelClass: 'idea-creation-dialog',
            data: {
                showCategoriesDropdown: this.boardMode === 'columns',
                categories: this.board.brainstormcategory_set,
                lessonID: this.activityState.lesson_run.lessonrun_code,
                category: category
            }
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.saveIdea(result);
            }
        });
    };
    BoardComponent.prototype.saveIdea = function (result) {
        if (this.myGroup || this.selectedParticipantGroup) {
            var groupId = null;
            if (this.myGroup) {
                groupId = this.myGroup.id;
            }
            else {
                groupId = this.selectedParticipantGroup.id;
            }
            result = __assign(__assign({}, result), { groupId: groupId });
        }
        this.submitIdea(result);
    };
    BoardComponent.prototype.submitIdea = function (idea) {
        // if (!idea.editing) {
        //   return;
        // }
        if (idea.imagesList || idea.selectedThirdPartyImageUrl) {
            this.submitImageNIdea(idea);
        }
        else if (idea.selectedpdfDoc) {
            this.submitDocumentNIdea(idea);
        }
        else if (idea.video_id) {
            this.submitWithVideo(idea);
        }
        else if (idea.webcamImageId) {
            this.submitWithWebcamImage(idea);
        }
        else {
            this.submitWithoutImg(idea);
        }
    };
    BoardComponent.prototype.submitWithWebcamImage = function (idea) {
        if (idea.id) {
            // idea exists
            // image has been added using webcam
            // TODO(mahin)
            this.sendMessage.emit(new schema_1.BrainstormEditIdeaSubmitEvent(idea.id, idea.text, idea.title, idea.category.id, idea.groupId, idea.webcamImageId));
        }
        else {
            this.sendMessage.emit(new schema_1.BrainstormSubmitEvent(idea.text, idea.title, idea.category.id, idea.groupId, idea.webcamImageId));
        }
    };
    BoardComponent.prototype.submitWithoutImg = function (idea) {
        if (!idea.text && !idea.title) {
            return;
        }
        if (idea.text && idea.text.length === 0 && idea.title && idea.title.length === 0) {
            return;
        }
        if (idea.id) {
            // if there's id in the idea that means we're editing existing idea
            this.sendMessage.emit(new schema_1.BrainstormEditIdeaSubmitEvent(idea.id, idea.text, idea.title, idea.category.id, idea.groupId, idea.idea_image ? (idea.idea_image.id ? idea.idea_image.id : null) : null, idea.selectedThirdPartyImageUrl));
        }
        else {
            // create new idea
            this.sendMessage.emit(new schema_1.BrainstormSubmitEvent(idea.text, idea.title, idea.category.id, idea.groupId));
        }
    };
    BoardComponent.prototype.submitWithVideo = function (idea) {
        console.log(idea);
        if (idea.id) {
            // update video
            this.sendMessage.emit(new schema_1.BrainstormSubmitVideoEvent({
                id: idea.id,
                text: idea.text,
                title: idea.title,
                category: idea.category.id,
                idea_video: idea.video_id
            }));
        }
        else {
            // create idea with uploaded video
            this.sendMessage.emit(new schema_1.BrainstormSubmitVideoEvent({
                id: null,
                text: idea.text,
                title: idea.title,
                category: idea.category.id,
                idea_video: idea.video_id
            }));
        }
    };
    BoardComponent.prototype.submitImageNIdea = function (idea) {
        var _this = this;
        if (idea.id) {
            // update the idea with an image
            this.updateIdeaWithImage(idea);
            return;
        }
        var code = this.activityState.lesson_run.lessonrun_code;
        var url = global.apiRoot + '/course_details/lesson_run/' + code + '/upload_document/';
        var participant_code = this.participantCode;
        var fileList = idea.imagesList;
        if (fileList && fileList.length > 0) {
            var file_1 = fileList[0];
            this.utilsService
                .resizeImage({
                file: file_1,
                maxSize: 500
            })
                .then(function (resizedImage) {
                var formData = new FormData();
                formData.append('document', resizedImage, file_1.name);
                formData.append('participant_code', participant_code ? participant_code.toString() : '');
                var headers = new http_1.HttpHeaders();
                headers.set('Content-Type', null);
                headers.set('Accept', 'multipart/form-data');
                var params = new http_1.HttpParams();
                _this.httpClient
                    .post(url, formData, { params: params, headers: headers })
                    .map(function (res) {
                    console.log(res);
                    _this.imagesList = null;
                    if (!idea.text) {
                        idea.text = '';
                    }
                    _this.sendMessage.emit(new schema_1.BrainstormSubmitEvent(idea.text, idea.title, idea.category.id, idea.groupId, res.id));
                })
                    .subscribe(function (data) { }, function (error) { return console.log(error); });
            })["catch"](function (err) {
                console.error(err);
            });
        }
        else {
            if (idea.selectedThirdPartyImageUrl) {
                this.sendMessage.emit(new schema_1.BrainstormImageSubmitEvent(idea.text, idea.title, idea.category.id, idea.groupId, idea.selectedThirdPartyImageUrl));
            }
        }
    };
    BoardComponent.prototype.updateIdeaWithImage = function (idea) {
        if (idea.selectedThirdPartyImageUrl) {
            // updated with third party image
            this.sendMessage.emit(new schema_1.BrainstormEditIdeaSubmitEvent(idea.id, idea.text, idea.title, idea.category.id, idea.groupId, undefined, idea.selectedThirdPartyImageUrl));
        }
        else {
            // updated with computer uploaded image
            console.log(idea);
        }
    };
    BoardComponent.prototype.submitDocumentNIdea = function (idea) {
        var _this = this;
        var code = this.activityState.lesson_run.lessonrun_code;
        var url = global.apiRoot + '/course_details/lesson_run/' + code + '/upload_document/';
        var participant_code = this.participantCode;
        var file = idea.selectedpdfDoc;
        if (file) {
            var formData = new FormData();
            formData.append('document', file, file.name);
            formData.append('participant_code', participant_code ? participant_code.toString() : '');
            var headers = new http_1.HttpHeaders();
            headers.set('Content-Type', null);
            headers.set('Accept', 'multipart/form-data');
            var params = new http_1.HttpParams();
            this.httpClient
                .post(url, formData, { params: params, headers: headers })
                .map(function (res) {
                // we will get ID of document and that will be attached
                // with the idea
                _this.sendMessage.emit(new schema_1.BrainstormSubmitDocumentEvent(idea.text, idea.title, idea.category.id, idea.groupId, res.id));
            })
                .subscribe(function (data) { }, function (error) { return console.log(error); });
        }
    };
    __decorate([
        core_1.Input()
    ], BoardComponent.prototype, "board");
    __decorate([
        core_1.Input()
    ], BoardComponent.prototype, "activityState");
    __decorate([
        core_1.Input()
    ], BoardComponent.prototype, "eventType");
    __decorate([
        core_1.Input()
    ], BoardComponent.prototype, "participantCode");
    __decorate([
        core_1.Output()
    ], BoardComponent.prototype, "sendMessage");
    BoardComponent = __decorate([
        core_1.Component({
            selector: 'benji-ideas-board',
            templateUrl: './board.component.html'
        })
    ], BoardComponent);
    return BoardComponent;
}());
exports.BoardComponent = BoardComponent;
