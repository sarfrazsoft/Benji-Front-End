import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import {
  DashboardComponents,
  DashboardEntryComponents,
  DashboardProviders
} from './';
import { DashboardRoutes } from './dashboard.routing';
import { McqsComponent } from './courses/course/mcqs/mcqs.component';
import { McqComponent } from './courses/course/mcqs/mcq/mcq.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutes,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [RouterModule],
  declarations: [...DashboardComponents, McqsComponent, McqComponent],
  entryComponents: DashboardEntryComponents,
  providers: DashboardProviders
})
export class DashboardModule {}

export function DashboardEntrypoint() {
  return DashboardModule;
}
