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

import { AnimatedCheckmarkButtonComponent } from '../ui-components/animated-checkmark-button/animated-checkmark-button.component';
import { BTwemojiComponent } from '../ui-components/b-twemoji/b-twemoji.component';
import { AttentionOverlayComponent } from '../ui-components/linear-timer/attention-overlay/attention-overlay.component';
import { LinearTimerComponent } from '../ui-components/linear-timer/linear-timer.component';
import { MainScreenFooterComponent } from '../ui-components/main-screen-footer/main-screen-footer.component';
import { MainScreenToolbarComponent } from '../ui-components/main-screen-toolbar/main-screen-toolbar.component';
import { NumberTimerComponent } from '../ui-components/number-timer/number-timer.component';
import { ParticipantToolbarComponent } from '../ui-components/participant-toolbar/participant-toolbar.component';
import { RadialTimerComponent } from '../ui-components/radial-timer/radial-timer.component';

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
  AnimatedCheckmarkButtonComponent,
  IcebreakerComponent,
  LandingComponent,
  LayoutComponent,
  // LinearTimerComponent,
  // AttentionOverlayComponent,
  MainscreenElementsComponent,
  // MainScreenToolbarComponent,
  // MainScreenFooterComponent,
  ParticipantJoinComponent,
  ParticipantLoginComponent,
  ParticipantToolbarComponent,
  MainScreenLessonComponent,
  // RadialTimerComponent,
  // NumberTimerComponent,
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
