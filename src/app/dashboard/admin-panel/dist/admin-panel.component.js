"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminPanelComponent = void 0;
var core_1 = require("@angular/core");
var shared_1 = require("../../shared");
var forms_1 = require("@angular/forms");
var ngx_editor_1 = require("ngx-editor");
var doc_1 = require("./../../shared/ngx-editor/doc");
var AdminPanelComponent = /** @class */ (function () {
    function AdminPanelComponent(intercom, activatedRoute, adminService, contextService, authService, dialog, router) {
        var _this = this;
        this.intercom = intercom;
        this.activatedRoute = activatedRoute;
        this.adminService = adminService;
        this.contextService = contextService;
        this.authService = authService;
        this.dialog = dialog;
        this.router = router;
        this.lessons = [];
        this.lessonRuns = [];
        this.adminName = '';
        this.form = new forms_1.FormGroup({
            editorContent: new forms_1.FormControl(doc_1["default"], ngx_editor_1.Validators.required())
        });
        this.activatedRoute.data.forEach(function (data) {
            _this.lessons = data.dashData.lessons.filter(function (lesson) { return lesson.public_permission !== 'duplicate'; });
            _this.lessonRuns = data.dashData.lessonRuns;
        });
    }
    Object.defineProperty(AdminPanelComponent.prototype, "doc", {
        get: function () {
            return this.form.get('editorContent');
        },
        enumerable: false,
        configurable: true
    });
    AdminPanelComponent.prototype.init = function (view) {
        this.editorView = view;
    };
    AdminPanelComponent.prototype.ngOnInit = function () {
        localStorage.removeItem('single_user_participant');
        this.authService.startIntercom();
        this.adminName = this.contextService.user.first_name;
    };
    AdminPanelComponent.prototype.openCreateSession = function () {
        var _this = this;
        this.dialog
            .open(shared_1.SessionSettingsDialogComponent, {
            data: {
                createSession: true,
                title: '',
                description: ''
            },
            panelClass: 'session-settings-dialog'
        })
            .afterClosed()
            .subscribe(function (data) {
            if (data) {
                _this.adminService.createNewBoard(data).subscribe(function (res) {
                    _this.router.navigate(['/screen/lesson/' + res.lessonrun_code]);
                });
            }
        });
    };
    AdminPanelComponent = __decorate([
        core_1.Component({
            selector: 'benji-admin-panel',
            templateUrl: './admin-panel.component.html',
            styleUrls: ['./admin-panel.component.scss']
        })
    ], AdminPanelComponent);
    return AdminPanelComponent;
}());
exports.AdminPanelComponent = AdminPanelComponent;
