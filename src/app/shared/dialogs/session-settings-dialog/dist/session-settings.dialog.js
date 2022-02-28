"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.SessionSettingsDialogComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var dialog_1 = require("@angular/material/dialog");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var global = require("src/app/globals");
var SessionSettingsDialogComponent = /** @class */ (function () {
    function SessionSettingsDialogComponent(httpClient, dialogRef, builder, data) {
        this.httpClient = httpClient;
        this.dialogRef = dialogRef;
        this.builder = builder;
        this.data = data;
        this.emailErr = false;
        this.emailErrMsg = '';
        this.invitationsSent = false;
        this.eventsSubject = new rxjs_1.Subject();
    }
    SessionSettingsDialogComponent.prototype.ngOnInit = function () {
        this.form = this.builder.group({
            title: new forms_1.FormControl('', [forms_1.Validators.required]),
            description: new forms_1.FormControl('')
        });
        this.form.setValue({ title: this.data.title, description: this.data.description });
        this.createSession = this.data.createSession;
    };
    Object.defineProperty(SessionSettingsDialogComponent.prototype, "title", {
        get: function () {
            return this.form.get('title');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SessionSettingsDialogComponent.prototype, "description", {
        get: function () {
            return this.form.get('description');
        },
        enumerable: false,
        configurable: true
    });
    SessionSettingsDialogComponent.prototype.updateLesson = function (lesson, id) {
        return this.httpClient.patch(global.apiRoot + ("/course_details/lesson/" + id + "/"), lesson);
    };
    SessionSettingsDialogComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.createSession && this.form.valid) {
            var val = this.form.value;
            this.dialogRef.close({
                title: val.title,
                description: val.description
            });
        }
        else if (this.form.valid) {
            var val = this.form.value;
            var l_1 = {
                lesson_name: val.title,
                lesson_description: val.description,
                index: this.data.index
            };
            this.updateLesson(l_1, this.data.id)
                .pipe(operators_1.map(function (res) { return res; }), operators_1.catchError(function (error) { return error; }))
                .subscribe(function (res) {
                _this.dialogRef.close(l_1);
            });
        }
    };
    SessionSettingsDialogComponent = __decorate([
        core_1.Component({
            selector: 'benji-session-settings-dialog',
            templateUrl: 'session-settings.dialog.html'
        }),
        __param(3, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], SessionSettingsDialogComponent);
    return SessionSettingsDialogComponent;
}());
exports.SessionSettingsDialogComponent = SessionSettingsDialogComponent;
