import { viewClassName } from '@angular/compiler';
import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPermissionsService } from 'ngx-permissions';
import { ActivityTypes } from 'src/app/globals';
import {
  AuthService,
  BackendRestService,
  BackendSocketService,
  ContextService,
  GroupingToolService,
  SharingToolService,
} from 'src/app/services';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { ParticipantGroupingDialogComponent } from 'src/app/shared/dialogs/participant-grouping-dialog/participant-grouping.dialog';
import { MainScreenToolbarComponent } from 'src/app/ui-components/main-screen-toolbar/main-screen-toolbar.component';
import { BaseLessonComponent } from '../shared/base-lesson.component';

@Component({
  selector: 'benji-main-screen-lesson',
  templateUrl: './main-screen-lesson.component.html',
})
export class MainScreenLessonComponent extends BaseLessonComponent implements AfterViewInit {
  dialogRef: any;

  // board-menu variables
  sideNavOpen: boolean;
  @ViewChild('sidenav') sidenav: MatSidenav;

  @ViewChild(MainScreenToolbarComponent) msToolbar: MainScreenToolbarComponent;
  navType: string;
  sideNavPosition: 'start' | 'end';
  sideNavMode: 'side' | 'over';
  public innerWidth: any;

  constructor(
    protected deviceDetectorService: DeviceDetectorService,
    protected utilsService: UtilsService,
    protected restService: BackendRestService,
    protected activatedRoute: ActivatedRoute,
    protected socketService: BackendSocketService,
    protected contextService: ContextService,
    protected authService: AuthService,
    protected permissionsService: NgxPermissionsService,
    protected ref: ChangeDetectorRef,
    protected matSnackBar: MatSnackBar,
    protected sharingToolService: SharingToolService,
    protected groupingToolService: GroupingToolService
  ) {
    super(
      deviceDetectorService,
      utilsService,
      restService,
      activatedRoute,
      socketService,
      'screen',
      contextService,
      authService,
      permissionsService,
      ref,
      matSnackBar
    );
  }

  at: typeof ActivityTypes = ActivityTypes;
  showGroupingOnScreen;

  fastForwardActivities = [
    this.at.pitchoMatic,
    this.at.buildAPitch,
    this.at.rolePlayPair,
    this.at.mcqResults,
    this.at.mcq,
    this.at.discussion,
    this.at.genericRoleplay,
    this.at.externalGrouping,
    this.at.whereDoYouStand,
    this.at.brainStorm,
    this.at.montyHall,
  ];

  ngAfterViewInit() {
    this.innerWidth = window.innerWidth;
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = event.target.innerWidth; 
    this.innerWidth < 848 && this.navType === 'boards' ? 
      this.sideNavMode = 'over' : 
      this.sideNavMode = 'side'; 
  }

  isPaused() {
    const activity_type = this.serverMessage.activity_type.toLowerCase();
    return this.serverMessage[activity_type].is_paused;
  }

  openSideNav(type: 'board-settings' | 'boards') {
    if (type === 'board-settings') {
      this.navType = 'board-settings';
      this.sideNavPosition = 'end';
      this.sideNavMode = 'over';
    } else if (type === 'boards') {
      this.navType = 'boards';
      this.sideNavPosition = 'start';
      this.innerWidth < 848 ?
        this.sideNavMode = 'over' :
        this.sideNavMode = 'side';
    }
    type ? this.sidenav.open() : this.close();
  }

  openBoardSettings() {
    this.openSideNav('board-settings');
  }

  close() {
    this.sidenav.close();
    this.sideNavMode = null;
    this.navType = null;
    this.sideNavPosition = null;
  }
}
