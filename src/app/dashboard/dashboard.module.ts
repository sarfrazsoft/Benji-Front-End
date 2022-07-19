import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { DashboardComponents, DashboardEntryComponents, DashboardProviders } from './';
import { DashboardRoutes, DashboardRoutesWithoutResolve } from './dashboard.routing';
import { LessonListComponent } from './lessons/lessons-list/lesson-list/lesson-list.component';
import { LessonTileComponent } from './lessons/lessons-list/lesson-tile/lesson-tile.component';

import { ColorPickerModule } from 'ngx-color-picker';
import { NgxEditorModule } from 'ngx-editor';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutes,
    DashboardRoutesWithoutResolve,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxEditorModule,
    ColorPickerModule,
  ],
  exports: [RouterModule],
  declarations: [...DashboardComponents, LessonTileComponent, LessonListComponent],
  entryComponents: DashboardEntryComponents,
  providers: DashboardProviders,
})
export class DashboardModule {}

export function DashboardEntrypoint() {
  return DashboardModule;
}
