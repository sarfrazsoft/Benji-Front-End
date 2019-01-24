export * from './layout.component';

import { LayoutComponent } from './layout.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LandingComponent } from '../pages/landing/main-screen/landing.component';

import { ParticipantLoginComponent } from '../pages/landing/participant/login/participant-login.component';
import { ParticipantJoinComponent } from '../pages/landing/participant/join/participant-join.component';
import { ElementsComponent } from '../elements/elements.component';
import { MainscreenElementsComponent } from '../mainscreen-elements/mainscreen-elements.component';
import { MainScreenTeletriviaActivityComponent } from '../pages/lesson/main-screen/main-screen-teletrivia-activity/main-screen-teletrivia-activity.component';
import { MainScreenLessonComponent } from '../pages/lesson/main-screen/main-screen-lesson.component';
import { MainScreenLobbyComponent } from '../pages/lesson/main-screen/main-screen-lobby-activity/main-screen-lobby.component';
import { ParticipantLessonComponent } from '../pages/lesson/participant/participant-lesson.component';

export const LayoutComponents = [
  MainScreenLessonComponent,
  ToolbarComponent,
  LayoutComponent,
  LandingComponent
];
