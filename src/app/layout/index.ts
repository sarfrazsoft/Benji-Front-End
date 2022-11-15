export * from './layout.component';

import { MainScreenLessonComponent } from '../pages/lesson/main-screen/main-screen-lesson.component';
import { ParticipantLoginComponent } from '../pages/participant/login/participant-login.component';
import { LayoutComponent } from './layout.component';
import { SidenavItemComponent } from './sidenav/sidenav-item/sidenav-item.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

import { ImageViewDialogComponent, MainScreenComponents } from '../index';

export const LayoutDeclarations = [
  ...MainScreenComponents,
  ImageViewDialogComponent,
  LayoutComponent,
  ParticipantLoginComponent,
  MainScreenLessonComponent,
  ToolbarComponent,
  SidenavComponent,
  SidenavItemComponent,
];

export const EntryComponents = [ImageViewDialogComponent];
