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
exports.IdeaDetailedComponent = void 0;
var animations_1 = require("@angular/animations");
var core_1 = require("@angular/core");
// import { UppyConfig } from 'uppy-angular/uppy-angular';
// import { Uppy } from '@uppy/core';
var core_2 = require("@uppy/core");
var google_drive_1 = require("@uppy/google-drive");
var webcam_1 = require("@uppy/webcam");
var xhr_upload_1 = require("@uppy/xhr-upload");
var schema_1 = require("src/app/services/backend/schema");
var environment_1 = require("src/environments/environment");
var confirmation_dialog_1 = require("../../dialogs/confirmation/confirmation.dialog");
var image_picker_dialog_1 = require("../../dialogs/image-picker-dialog/image-picker.dialog");
var IdeaDetailedComponent = /** @class */ (function () {
    function IdeaDetailedComponent(activitiesService, matDialog, deleteDialog) {
        var _this = this;
        this.activitiesService = activitiesService;
        this.matDialog = matDialog;
        this.deleteDialog = deleteDialog;
        this.showCategoriesDropdown = false;
        this.categories = [];
        this.userIdeaText = '';
        this.imageSelected = false;
        this.participantCode = null;
        this.submitting_participant = null;
        this.hostname = environment_1.environment.web_protocol + '://' + environment_1.environment.host;
        this.commentModel = '';
        this.video = false;
        this.webcamImage = false;
        this.showInline = false;
        this.showModal = false;
        this.dashboardProps = {
            plugins: ['Webcam', 'GoogleDrive']
        };
        this.dashboardModalProps = {
            target: document.body,
            onRequestCloseModal: function () {
                _this.showModal = false;
            }
        };
        this.uppy = new core_2.Uppy({ id: 'idea-detailed', debug: true, autoProceed: false });
        this.sendMessage = new core_1.EventEmitter();
        this.deleteIdea = new core_1.EventEmitter();
        this.submit = new core_1.EventEmitter();
        this.closeView = new core_1.EventEmitter();
        this.previousItemRequested = new core_1.EventEmitter();
        this.nextItemRequested = new core_1.EventEmitter();
    }
    IdeaDetailedComponent.prototype.ngOnInit = function () {
        this.uppy
            .use(webcam_1["default"], { countdown: 5 })
            // .use(Tus, { endpoint: 'https://tusd.tusdemo.net/files/' })
            .use(google_drive_1["default"], { companionUrl: 'https://companion.uppy.io' })
            .use(xhr_upload_1["default"], {
            endpoint: 'http://my-website.org/upload'
        });
    };
    IdeaDetailedComponent.prototype.ngOnChanges = function () {
        this.initIdea();
    };
    IdeaDetailedComponent.prototype.initIdea = function () {
        this.showCategoriesDropdown = this.data.showCategoriesDropdown;
        this.categories = this.data.categories.filter(function (val) { return !val.removed; });
        this.idea = this.data.item;
        if (this.categories.length) {
            this.selectedCategory = this.categories[0];
        }
        this.ideaTitle = this.data.item.title;
        this.userIdeaText = this.data.item.idea;
        // initialize idea image
        if (this.data.item.idea_image) {
            this.imageSelected = true;
            this.imageSrc = this.data.item.idea_image.document;
        }
        else {
            this.removeImage();
        }
        // check if idea has document and reset if
        // document isn't present
        if (this.data.item.idea_document) {
            this.pdfSelected = true;
            this.pdfSrc = this.hostname + this.data.item.idea_document.document;
        }
        else {
            this.clearPDF();
        }
        // check if idea has video and reset if not
        if (this.data.item.idea_video) {
            this.video = true;
            this.videoURL = this.data.item.idea_video.document;
        }
        else {
            this.removeVideo();
        }
        this.userRole = this.data.userRole;
        if (this.data.participantCode) {
            this.participantCode = this.data.participantCode;
        }
        else {
            // viewing user is the host
        }
        if (this.data.item.submitting_participant) {
            this.submitting_participant = this.data.item.submitting_participant.participant_code;
        }
        if (this.data.category) {
            this.selectedCategory = this.data.category;
        }
        if (this.data.myGroup) {
            this.group = this.data.myGroup;
        }
        this.activityState = this.data.activityState;
        this.lessonRunCode = this.activityState.lesson_run.lessonrun_code;
    };
    IdeaDetailedComponent.prototype.onSubmit = function () {
        this.submit.emit(__assign(__assign({}, this.idea), { text: this.userIdeaText, title: this.ideaTitle, category: this.selectedCategory, imagesList: this.imagesList, selectedImageUrl: this.selectedImageUrl, selectedThirdPartyImageUrl: this.selectedThirdPartyImageUrl, video_id: this.video_id, webcamImageId: this.webcamImageId }));
    };
    IdeaDetailedComponent.prototype.closeDialog = function () {
        // this.dialogRef.close();
        this.closeView.emit();
    };
    IdeaDetailedComponent.prototype.remove = function () {
        if (this.pdfSelected) {
            this.clearPDF();
        }
        else if (this.video) {
            this.removeVideo();
        }
        else {
            this.removeImage();
        }
        this.sendMessage.emit(new schema_1.RemoveIdeaDocumentEvent(this.idea.id));
        this.uploadPanelExpanded = true;
    };
    IdeaDetailedComponent.prototype.removeImage = function () {
        this.imageSelected = false;
        this.imagesList = null;
        this.imageSrc = null;
        this.selectedImageUrl = null;
        this.selectedThirdPartyImageUrl = null;
        this.idea.idea_image = null;
    };
    IdeaDetailedComponent.prototype.clearPDF = function () {
        this.selectedpdfDoc = null;
        this.pdfSelected = false;
        this.pdfSrc = null;
    };
    IdeaDetailedComponent.prototype.removeVideo = function () {
        this.video = false;
        this.videoURL = null;
        this.video_id = null;
    };
    IdeaDetailedComponent.prototype.removeWebcamImage = function () {
        this.webcamImage = false;
        this.webcamImageId = null;
        this.webcamImageURL = null;
    };
    IdeaDetailedComponent.prototype.openImagePickerDialog = function () {
        var _this = this;
        this.imageDialogRef = this.matDialog
            .open(image_picker_dialog_1.ImagePickerDialogComponent, {
            disableClose: false,
            panelClass: ['dashboard-dialog', 'image-picker-dialog']
        })
            .afterClosed()
            .subscribe(function (res) {
            if (res) {
                _this.uploadPanelExpanded = false;
                if (res.type === 'upload') {
                    _this.imageSelected = true;
                    _this.imagesList = res.data;
                    var fileList = res.data;
                    var file = fileList[0];
                    var reader_1 = new FileReader();
                    reader_1.onload = function (e) { return (_this.imageSrc = reader_1.result); };
                    reader_1.readAsDataURL(file);
                }
                else if (res.type === 'unsplash') {
                    _this.selectedImageUrl = res.data;
                    _this.imageSrc = res.data;
                    _this.imageSelected = true;
                    _this.selectedThirdPartyImageUrl = res.data;
                }
                else if (res.type === 'giphy') {
                    _this.selectedThirdPartyImageUrl = res.data;
                    _this.imageSrc = res.data;
                    _this.selectedImageUrl = res.data;
                    _this.imageSelected = true;
                }
            }
        });
    };
    IdeaDetailedComponent.prototype.isAbsolutePath = function (imageUrl) {
        if (imageUrl.includes('https:')) {
            return true;
        }
        else {
            return false;
        }
    };
    IdeaDetailedComponent.prototype.getParticipantName = function (code) {
        return this.activitiesService.getParticipantName(this.activityState, code);
    };
    IdeaDetailedComponent.prototype.submitComment = function (ideaId, val) {
        this.sendMessage.emit(new schema_1.BrainstormSubmitIdeaCommentEvent(val, ideaId));
    };
    IdeaDetailedComponent.prototype.getInitials = function (nameString) {
        var fullName = nameString.split(' ');
        var first = fullName[0] ? fullName[0].charAt(0) : '';
        if (fullName.length === 1) {
            return first.toUpperCase();
        }
        var second = fullName[fullName.length - 1] ? fullName[fullName.length - 1].charAt(0) : '';
        return (first + second).toUpperCase();
    };
    IdeaDetailedComponent.prototype["delete"] = function () {
        var _this = this;
        this.deleteDialog
            .open(confirmation_dialog_1.ConfirmationDialogComponent, {
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
                _this.deleteIdea.emit(_this.idea.id);
            }
        });
    };
    IdeaDetailedComponent.prototype.toggle = function () {
        if (!this.imageSelected && !this.pdfSelected) {
            this.uploadPanelExpanded = !this.uploadPanelExpanded;
        }
    };
    IdeaDetailedComponent.prototype.previousArrowClicked = function () {
        this.previousItemRequested.emit();
    };
    IdeaDetailedComponent.prototype.nextArrowClicked = function () {
        this.nextItemRequested.emit();
    };
    IdeaDetailedComponent.prototype.participantIsOwner = function () { };
    IdeaDetailedComponent.prototype.mediaUploaded = function (res) {
        this.uploadPanelExpanded = false;
        if (res.document_type === 'video') {
            this.videoURL = res.document;
            this.video = true;
            this.video_id = res.id;
        }
        else if (res.document_type === 'image') {
            this.webcamImageId = res.id;
            this.webcamImageURL = res.document;
            this.webcamImage = true;
        }
    };
    __decorate([
        core_1.Input()
    ], IdeaDetailedComponent.prototype, "data");
    __decorate([
        core_1.Output()
    ], IdeaDetailedComponent.prototype, "sendMessage");
    __decorate([
        core_1.Output()
    ], IdeaDetailedComponent.prototype, "deleteIdea");
    __decorate([
        core_1.Output()
    ], IdeaDetailedComponent.prototype, "submit");
    __decorate([
        core_1.Output()
    ], IdeaDetailedComponent.prototype, "closeView");
    __decorate([
        core_1.Output()
    ], IdeaDetailedComponent.prototype, "previousItemRequested");
    __decorate([
        core_1.Output()
    ], IdeaDetailedComponent.prototype, "nextItemRequested");
    IdeaDetailedComponent = __decorate([
        core_1.Component({
            selector: 'benji-idea-detailed',
            templateUrl: 'idea-detailed.html',
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
                    animations_1.transition('enabled => disabled', [animations_1.animate('0.1s')]),
                    animations_1.transition('disabled => enabled', [animations_1.animate('0.1s')]),
                ]),
                animations_1.trigger('openClose', [
                    animations_1.state('open', animations_1.style({
                        width: '512px'
                    })),
                    animations_1.state('closed', animations_1.style({
                        width: '0px'
                    })),
                    animations_1.transition('* => closed', [animations_1.animate('0.5s 0ms ease-in-out')]),
                    animations_1.transition('* => open', [animations_1.animate('0.5s 0ms ease-in-out')]),
                ]),
                animations_1.trigger('flyInOut', [
                    animations_1.state('in', animations_1.style({ transform: 'translateX(0)' })),
                    animations_1.transition('void => *', [animations_1.style({ transform: 'translateX(100%)' }), animations_1.animate('0.5s 0ms ease-in-out')]),
                    animations_1.transition('* => void', [animations_1.animate('0.5s 0ms ease-in-out', animations_1.style({ transform: 'translateX(100%)' }))]),
                ]),
                animations_1.trigger('openupClosedown', [
                    animations_1.state('openUp', animations_1.style({
                        height: '300px'
                    })),
                    animations_1.state('closeDown', animations_1.style({
                    // height: '0px',
                    })),
                    animations_1.transition('* => closeDown', [animations_1.animate('0.5s 0ms ease-in-out')]),
                    animations_1.transition('* => openUp', [animations_1.animate('0.5s 0ms ease-in-out')]),
                ]),
                animations_1.trigger('flyUpDown', [
                    animations_1.state('up', animations_1.style({ transform: 'translateY(0)' })),
                    animations_1.transition('void => *', [animations_1.style({ transform: 'translateY(100%)' }), animations_1.animate('0.5s 0ms ease-in-out')]),
                    animations_1.transition('* => void', [animations_1.animate('0.5s 0ms ease-in-out', animations_1.style({ transform: 'translateY(100%)' }))]),
                ]),
            ]
        })
    ], IdeaDetailedComponent);
    return IdeaDetailedComponent;
}());
exports.IdeaDetailedComponent = IdeaDetailedComponent;
