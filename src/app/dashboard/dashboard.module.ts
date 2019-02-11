import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { DashboardRoutes } from './dashboard.routing';

import {
  DashboardComponents,
  DashboardEntryComponents,
  DashboardProviders
} from './';
import { LearnersComponent } from './learners/learners.component';

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    DashboardRoutes,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [RouterModule],
  declarations: [...DashboardComponents, LearnersComponent],
  entryComponents: DashboardEntryComponents,
  providers: DashboardProviders
})
export class DashboardModule {}

export function DashboardEntrypoint() {
  return DashboardModule;
}
