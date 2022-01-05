import { viewClassName } from '@angular/compiler';
import { ChangeDetectorRef, Component, OnChanges, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
export class MainScreenLessonComponent extends BaseLessonComponent implements OnInit {
  dialogRef: any;
  
  // Side-Navigation variables
  sideNavOpen: boolean;
  @ViewChild('sidenav') sidenav: MatSidenav;

  @ViewChild(MainScreenToolbarComponent) msToolbar: MainScreenToolbarComponent;
  navType: string;

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

    // groupingToolService.showGroupingToolMainScreen$.subscribe((val) => {
    //   this.showGroupingOnScreen = val;
    //   console.log(val);
    //   if (val) {
    //     this.openParticipantGroupingToolDialog();
    //   }
    // });
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

  isPaused() {
    const activity_type = this.serverMessage.activity_type.toLowerCase();
    return this.serverMessage[activity_type].is_paused;
  }
  
  openSideNav(type) {
    console.log(this.serverMessage);
    type? this.sidenav.open() :  this.sidenav.close();
    type =='boards'? this.navType='boards' : this.navType='board-settings';
  }

  close() {
    this.sidenav.close();
  }

}
