"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BrainstormCardComponent = void 0;
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
var operators_1 = require("rxjs/operators");
var schema_1 = require("src/app/services/backend/schema");
var dialogs_1 = require("src/app/shared/dialogs");
var idea_detailed_dialog_1 = require("src/app/shared/dialogs/idea-detailed-dialog/idea-detailed.dialog");
var environment_1 = require("src/environments/environment");
var BrainstormCardComponent = /** @class */ (function () {
    function BrainstormCardComponent(dialog, matDialog, activitiesService, brainstormService, deviceService, _ngZone) {
        this.dialog = dialog;
        this.matDialog = matDialog;
        this.activitiesService = activitiesService;
        this.brainstormService = brainstormService;
        this.deviceService = deviceService;
        this._ngZone = _ngZone;
        this.hostname = environment_1.environment.web_protocol + '://' + environment_1.environment.host;
        this.viewImage = new core_1.EventEmitter();
        this.deleteIdea = new core_1.EventEmitter();
        this.commentModel = '';
        this.deactivateHearting = false;
        // super();
    }
    BrainstormCardComponent.prototype.ngOnInit = function () {
        if (this.item && this.item.submitting_participant) {
            this.submittingUser = this.item.submitting_participant.participant_code;
        }
        if (this.participantCode) {
            this.userRole = 'viewer';
        }
        else {
            // viewing user is the host
            this.userRole = 'owner';
        }
        if (this.item && this.item.submitting_participant && this.userRole !== 'owner') {
            this.submittingUser = this.item.submitting_participant.participant_code;
            if (this.submittingUser === this.participantCode) {
                this.userRole = 'owner';
            }
            else {
                this.userRole = 'viewer';
            }
        }
    };
    BrainstormCardComponent.prototype.triggerResize = function () {
        var _this = this;
        // Wait for changes to be applied, then trigger textarea resize.
        this._ngZone.onStable.pipe(operators_1.take(1)).subscribe(function () { return _this.autosize.resizeToFitContent(true); });
    };
    BrainstormCardComponent.prototype.ngOnChanges = function () { };
    BrainstormCardComponent.prototype["delete"] = function (id) {
        var _this = this;
        this.matDialog
            .open(dialogs_1.ConfirmationDialogComponent, {
            data: {
                confirmationMessage: 'Are you sure you want to delete this idea?',
                actionButton: 'Delete'
            },
            disableClose: true,
            panelClass: 'idea-delete-dialog'
        })
            .afterClosed()
            .subscribe(function (res) {
            if (res) {
                _this.deleteIdea.emit(id);
            }
        });
    };
    BrainstormCardComponent.prototype.isAbsolutePath = function (imageUrl) {
        if (imageUrl.includes('https:')) {
            return true;
        }
        else {
            return false;
        }
    };
    BrainstormCardComponent.prototype.openImage = function (imageUrl) {
        this.viewImage.emit(imageUrl);
    };
    BrainstormCardComponent.prototype.getPersonName = function (idea) {
        if (idea) {
            if (idea.submitting_participant) {
                return this.getParticipantName(idea.submitting_participant.participant_code);
            }
            else {
                return this.getParticipantName(null);
            }
        }
    };
    BrainstormCardComponent.prototype.getParticipantName = function (code) {
        return this.activitiesService.getParticipantName(this.activityState, code);
    };
    BrainstormCardComponent.prototype.submitComment = function (ideaId, val) {
        this.sendMessage.emit(new schema_1.BrainstormSubmitIdeaCommentEvent(val, ideaId));
    };
    BrainstormCardComponent.prototype.removeComment = function (commentId, ideaId) {
        this.sendMessage.emit(new schema_1.BrainstormRemoveIdeaCommentEvent(commentId, ideaId));
    };
    BrainstormCardComponent.prototype.isUserTheCommentor = function (participantCode) {
        if (this.participantCode && this.participantCode === participantCode) {
            return true;
        }
        return false;
    };
    BrainstormCardComponent.prototype.hasParticipantHearted = function (item) {
        var _this = this;
        var hearted = false;
        item.hearts.forEach(function (element) {
            if (element.participant === _this.participantCode) {
                hearted = true;
                _this.deactivateHearting = false;
            }
            // If a trainer hearts an idea the heart object does not have
            // a participant code.
            if (element.participant === null && !_this.participantCode) {
                hearted = true;
                _this.deactivateHearting = false;
            }
        });
        return hearted;
    };
    BrainstormCardComponent.prototype.removeHeart = function (item) {
        var _this = this;
        var hearted;
        item.hearts.forEach(function (element) {
            if (element.participant === _this.participantCode) {
                hearted = element;
            }
            // If a trainer hearts an idea the heart object does not have
            // a participant code.
            if (element.participant === null && !_this.participantCode) {
                hearted = element;
            }
        });
        if (hearted) {
            this.sendMessage.emit(new schema_1.BrainstormRemoveIdeaHeartEvent(item.id, hearted.id));
        }
    };
    BrainstormCardComponent.prototype.setHeart = function (idea) {
        if (!this.deactivateHearting) {
            this.deactivateHearting = true;
            this.sendMessage.emit(new schema_1.BrainstormSubmitIdeaHeartEvent(idea.id));
        }
    };
    BrainstormCardComponent.prototype.showDetailedIdea = function (idea) {
        if (this.deviceService.isMobile()) {
            this.openDialog(idea, 'idea-detailed-mobile-dialog', false);
        }
        else {
            this.openDialog(idea, 'idea-detailed-dialog', true);
        }
        // this.openDialog(idea, 'idea-detailed-mobile-dialog', false);
        // this.openDialog(idea, 'idea-detailed-dialog', true);
    };
    BrainstormCardComponent.prototype.openDialog = function (idea, assignedClass, isDesktop) {
        var _this = this;
        var dialogRef = this.dialog.open(idea_detailed_dialog_1.IdeaDetailedDialogComponent, {
            hasBackdrop: isDesktop,
            panelClass: assignedClass,
            data: {
                showCategoriesDropdown: this.categorizeFlag,
                categories: this.board.brainstormcategory_set,
                item: this.item,
                category: this.category,
                myGroup: this.myGroup,
                activityState: this.activityState,
                isMobile: !isDesktop,
                participantCode: this.participantCode,
                userRole: this.userRole,
                showUserName: this.showUserName
            }
        });
        var sub = dialogRef.componentInstance.sendMessage.subscribe(function (event) {
            _this.sendMessage.emit(event);
        });
        dialogRef.componentInstance.deleteIdea.subscribe(function (event) {
            _this.deleteIdea.emit(event);
            dialogRef.close();
        });
        dialogRef.afterClosed().subscribe(function (result) {
            if (result) {
                _this.brainstormService.saveIdea$.next(result);
            }
        });
    };
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "board");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "item");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "category");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "submissionScreen");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "voteScreen");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "act");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "activityState");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "minWidth");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "sendMessage");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "joinedUsers");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "showUserName");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "participantCode");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "eventType");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "categorizeFlag");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "myGroup");
    __decorate([
        core_1.Input()
    ], BrainstormCardComponent.prototype, "avatarSize");
    __decorate([
        core_1.ViewChild('colName')
    ], BrainstormCardComponent.prototype, "colNameElement");
    __decorate([
        core_1.Output()
    ], BrainstormCardComponent.prototype, "viewImage");
    __decorate([
        core_1.Output()
    ], BrainstormCardComponent.prototype, "deleteIdea");
    __decorate([
        core_1.ViewChild('autosize')
    ], BrainstormCardComponent.prototype, "autosize");
    BrainstormCardComponent = __decorate([
        core_1.Component({
            selector: 'benji-brainstorm-card',
            templateUrl: './brainstorm-card.component.html',
            animations: [
                animations_1.trigger('enableDisable', [
                    // ...
                    animations_1.state('enabled', animations_1.style({
                        opacity: 1,
                        display: 'block'
                    })),
                    animations_1.state('disabled', animations_1.style({
                        opacity: 0,
                        display: 'none'
                    })),
                ]),
            ]
        })
    ], BrainstormCardComponent);
    return BrainstormCardComponent;
}());
exports.BrainstormCardComponent = BrainstormCardComponent;
