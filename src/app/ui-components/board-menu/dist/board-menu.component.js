"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.BoardMenuComponent = void 0;
var core_1 = require("@angular/core");
var schema_1 = require("src/app/services/backend/schema");
var confirmation_dialog_1 = require("src/app/shared/dialogs/confirmation/confirmation.dialog");
var BoardMenuComponent = /** @class */ (function () {
    function BoardMenuComponent(dialog, brainstormService, permissionsService, utilsService) {
        this.dialog = dialog;
        this.brainstormService = brainstormService;
        this.permissionsService = permissionsService;
        this.utilsService = utilsService;
        this.sendMessage = new core_1.EventEmitter();
        this.instructions = '';
        this.sub_instructions = '';
        this.statusDropdown = ['Open', 'View Only', 'Closed'];
        this.postOrderDropdown = [
            {
                value: 'newest_to_oldest',
                name: 'Newest to oldest'
            },
            {
                value: 'oldest_to_newest',
                name: 'Oldest to newest'
            },
        ];
        this.defaultSort = 'newest_to_oldest';
        this.participants = [];
        this.boards = [];
        this.hostname = window.location.host + '/participant/join?link=';
    }
    BoardMenuComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.brainstormService.selectedBoard$.subscribe(function (board) {
            if (board) {
                _this.selectedBoard = board;
                _this.boardMode = _this.selectedBoard.board_activity.mode;
                _this.instructions = board.board_activity.instructions;
                _this.sub_instructions = board.board_activity.sub_instructions;
                _this.boardStatus =
                    board.status === 'open' ? 'Open' : board.status === 'view_only' ? 'View Only' : 'Closed';
                if (board.sort) {
                    _this.defaultSort = board.sort;
                }
            }
        });
        this.meetingMode = this.activityState.brainstormactivity.meeting_mode;
        this.initializeBoards();
        this.hostBoard = this.activityState.brainstormactivity.host_board;
    };
    BoardMenuComponent.prototype.ngOnChanges = function () {
        if (this.activityState.eventType === 'BrainstormRemoveBoardEvent' ||
            this.activityState.eventType === 'BrainstormAddBoardEventBaseEvent') {
            this.resetBoards();
        }
        if (this.navType === 'boards') {
            if (this.activityState.eventType === 'HostChangeBoardEvent') {
            }
            else if (this.activityState.eventType === 'BrainstormToggleMeetingMode') {
                this.meetingMode = this.activityState.brainstormactivity.meeting_mode;
            }
            else {
                this.initializeBoards();
            }
        }
        this.hostBoard = this.activityState.brainstormactivity.host_board;
    };
    BoardMenuComponent.prototype.ngAfterViewInit = function () {
        this.decideBoardMode(this.boardMode);
    };
    BoardMenuComponent.prototype.initializeBoards = function () {
        var boards = this.activityState.brainstormactivity.boards.filter(function (board) { return board.removed === false; });
        this.boards = boards.sort(function (a, b) { return a.order - b.order; });
    };
    BoardMenuComponent.prototype.getBoardParticipantCodes = function (board) {
        return this.activityState.brainstormactivity.participants[board.id];
    };
    BoardMenuComponent.prototype.closeNav = function () {
        this.sidenav.close();
    };
    BoardMenuComponent.prototype.addBoard = function (boardIndex) {
        this.sendMessage.emit(new schema_1.BrainstormAddBoardEventBaseEvent('Board ' + this.boards.length, boardIndex + 1, 'Untitled Board ' + this.boards.length, 'Sub Instructions'));
    };
    BoardMenuComponent.prototype.editInstructions = function () {
        var _this = this;
        setTimeout(function () {
            _this.InstructionsElement.nativeElement.focus();
        }, 0);
    };
    BoardMenuComponent.prototype.saveEditedInstructions = function () {
        this.sendMessage.emit(new schema_1.BrainstormEditInstructionEvent(this.instructions, this.selectedBoard.id));
    };
    BoardMenuComponent.prototype.editSubInstructions = function () {
        var _this = this;
        setTimeout(function () {
            _this.SubInstructionsElement.nativeElement.focus();
        }, 0);
    };
    BoardMenuComponent.prototype.saveEditedSubInstructions = function () {
        this.sendMessage.emit(new schema_1.BrainstormEditSubInstructionEvent(this.sub_instructions, this.selectedBoard.id));
    };
    BoardMenuComponent.prototype.getInitials = function (nameString) {
        var fullName = nameString.split(' ');
        var first = fullName[0] ? fullName[0].charAt(0) : '';
        var second = fullName[1] ? fullName[1].charAt(0) : '';
        return (first + second).toUpperCase();
    };
    BoardMenuComponent.prototype.openDeleteDialog = function (boardID) {
        var _this = this;
        this.dialog
            .open(confirmation_dialog_1.ConfirmationDialogComponent, {
            data: {
                confirmationMessage: 'You are about to delete this board. This can’t be undone.'
            },
            panelClass: 'delete-board-dialog'
        })
            .afterClosed()
            .subscribe(function (res) {
            if (res === true) {
                var id = boardID ? boardID : _this.menuBoard;
                _this.sendMessage.emit(new schema_1.BrainstormRemoveBoardEvent(id));
            }
        });
    };
    BoardMenuComponent.prototype.navigateToBoard = function (board) {
        var _this = this;
        this.permissionsService.hasPermission('PARTICIPANT').then(function (val) {
            if (val) {
                _this.sendMessage.emit(new schema_1.ParticipantChangeBoardEvent(board.id));
            }
        });
        this.permissionsService.hasPermission('ADMIN').then(function (val) {
            if (val) {
                _this.sendMessage.emit(new schema_1.HostChangeBoardEvent(board.id));
            }
        });
    };
    BoardMenuComponent.prototype.setBoardMode = function (mode) {
        this.sendMessage.emit(new schema_1.BrainstormChangeModeEvent(mode, this.selectedBoard.id));
        this.decideBoardMode(mode);
    };
    BoardMenuComponent.prototype.decideBoardMode = function (mode) {
        console.log(mode);
        switch (mode) {
            case "grid":
                this.gridMode = true;
                this.threadMode = false;
                this.columnsMode = false;
                break;
            case "thread":
                this.gridMode = false;
                this.threadMode = true;
                this.columnsMode = false;
                break;
            default:
                this.gridMode = false;
                this.threadMode = false;
                this.columnsMode = true;
        }
    };
    BoardMenuComponent.prototype.duplicateBoard = function () { };
    BoardMenuComponent.prototype.setBoardStatus = function () {
        var selected = this.boardStatus;
        var status = selected === 'Open' ? 'open' : selected === 'View Only' ? 'view_only' : 'closed';
        this.sendMessage.emit(new schema_1.BrainstormChangeBoardStatusEvent(status, this.selectedBoard.id));
    };
    BoardMenuComponent.prototype.toggleMeetingMode = function ($event) {
        this.sendMessage.emit(new schema_1.BrainstormToggleMeetingMode($event.currentTarget.checked));
    };
    BoardMenuComponent.prototype.copyLink = function () {
        this.utilsService.copyToClipboard(this.hostname + this.activityState.lesson_run.lessonrun_code);
    };
    BoardMenuComponent.prototype.resetBoards = function () {
        this.boardsCount = 0;
        this.boards = this.boards.filter(function (board) { return board.removed === false; });
        this.boardsCount = this.boards.length;
    };
    BoardMenuComponent.prototype.setMenuBoard = function (board) {
        this.menuBoard = board.id;
    };
    BoardMenuComponent.prototype.clearBoard = function () {
        var _this = this;
        this.dialog
            .open(confirmation_dialog_1.ConfirmationDialogComponent, {
            data: {
                confirmationMessage: 'Are you sure you want to delete all posts? This action can not be undone?',
                actionButton: 'Delete'
            },
            disableClose: true,
            panelClass: 'clear-board-dialog'
        })
            .afterClosed()
            .subscribe(function (res) {
            if (res) {
                _this.sendMessage.emit(new schema_1.BrainstormClearBoardIdeaEvent(_this.selectedBoard.id));
            }
        });
    };
    BoardMenuComponent.prototype.changeOrder = function (order) {
        this.sendMessage.emit(new schema_1.BrainstormBoardSortOrderEvent(order.value, this.selectedBoard.id));
    };
    __decorate([
        core_1.Input()
    ], BoardMenuComponent.prototype, "activityState");
    __decorate([
        core_1.Input()
    ], BoardMenuComponent.prototype, "sidenav");
    __decorate([
        core_1.Input()
    ], BoardMenuComponent.prototype, "navType");
    __decorate([
        core_1.ViewChild('title')
    ], BoardMenuComponent.prototype, "InstructionsElement");
    __decorate([
        core_1.ViewChild('instructions')
    ], BoardMenuComponent.prototype, "SubInstructionsElement");
    __decorate([
        core_1.Output()
    ], BoardMenuComponent.prototype, "sendMessage");
    BoardMenuComponent = __decorate([
        core_1.Component({
            selector: 'benji-board-menu',
            templateUrl: 'board-menu.component.html'
        })
    ], BoardMenuComponent);
    return BoardMenuComponent;
}());
exports.BoardMenuComponent = BoardMenuComponent;
