import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { DashboardComponents, DashboardEntryComponents, DashboardProviders } from './';
import { DashboardRoutes } from './dashboard.routing';
import { LessonTileComponent } from './lessons/lessons-list/lesson-tile/lesson-tile.component';

@NgModule({
  imports: [CommonModule, DashboardRoutes, FormsModule, ReactiveFormsModule, SharedModule],
  exports: [RouterModule],
  declarations: [...DashboardComponents, LessonTileComponent],
  entryComponents: DashboardEntryComponents,
  providers: DashboardProviders,
})
export class DashboardModule {}

export function DashboardEntrypoint() {
  return DashboardModule;
}
