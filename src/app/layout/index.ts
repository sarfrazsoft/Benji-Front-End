export * from './layout.component';

import { MainScreenLessonComponent } from '../pages/lesson/main-screen/main-screen-lesson.component';
import { LayoutComponent } from './layout.component';
import { SidenavItemComponent } from './sidenav/sidenav-item/sidenav-item.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

import { ImageViewDialogComponent, MainScreenComponents } from '../index';
import { FolderComponent } from './sidenav/folder/folder.component';

export const LayoutDeclarations = [
  ...MainScreenComponents,
  ImageViewDialogComponent,
  LayoutComponent,
  MainScreenLessonComponent,
  ToolbarComponent,
  SidenavComponent,
  SidenavItemComponent,
  FolderComponent
];

export const EntryComponents = [ImageViewDialogComponent];
