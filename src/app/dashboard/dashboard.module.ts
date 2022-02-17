import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { DashboardComponents, DashboardEntryComponents, DashboardProviders } from './';
import { DashboardRoutes } from './dashboard.routing';
import { ActiveLessonsComponent } from './lessons/lessons-list/active-lessons/active-lessons.component';
import { LessonTileComponent } from './lessons/lessons-list/lesson-tile/lesson-tile.component';

import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  imports: [CommonModule, DashboardRoutes, FormsModule, ReactiveFormsModule, SharedModule, NgxEditorModule],
  exports: [RouterModule],
  declarations: [...DashboardComponents, LessonTileComponent, ActiveLessonsComponent],
  entryComponents: DashboardEntryComponents,
  providers: DashboardProviders,
})
export class DashboardModule {}

export function DashboardEntrypoint() {
  return DashboardModule;
}
