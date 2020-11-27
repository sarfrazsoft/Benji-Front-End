export * from './layout.component';

import { IcebreakerComponent } from '../pages/landing/icebreaker/icebreaker.component';
import { LandingComponent } from '../pages/landing/main-screen/landing.component';
import { LayoutComponent } from './layout.component';
import { SidenavItemComponent } from './sidenav/sidenav-item/sidenav-item.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

import { MainscreenElementsComponent } from '../mainscreen-elements/mainscreen-elements.component';
import { ParticipantJoinComponent } from '../pages/landing/participant/join/participant-join.component';
import { ParticipantLoginComponent } from '../pages/landing/participant/login/participant-login.component';
import { MainScreenLessonComponent } from '../pages/lesson/main-screen/main-screen-lesson.component';

import {
  ImageViewDialogComponent,
  LowAttendanceDialogComponent,
  LowResponseDialogComponent,
  MainScreenComponents,
  ParticipantScreenComponents,
  PeakBackDialogComponent,
  SingleUserScreenComponents,
} from '../index';

export const LayoutDeclarations = [
  ...MainScreenComponents,
  ...ParticipantScreenComponents,
  ...SingleUserScreenComponents,
  LowAttendanceDialogComponent,
  LowResponseDialogComponent,
  PeakBackDialogComponent,
  ImageViewDialogComponent,
  IcebreakerComponent,
  LandingComponent,
  LayoutComponent,
  MainscreenElementsComponent,
  ParticipantJoinComponent,
  ParticipantLoginComponent,
  MainScreenLessonComponent,
  ToolbarComponent,
  SidenavComponent,
  SidenavItemComponent,
];

export const EntryComponents = [
  LowAttendanceDialogComponent,
  LowResponseDialogComponent,
  PeakBackDialogComponent,
  ImageViewDialogComponent,
];
