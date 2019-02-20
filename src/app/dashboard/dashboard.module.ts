import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';
import { DashboardRoutes } from './dashboard.routing';

import {
  DashboardComponents,
  DashboardEntryComponents,
  DashboardProviders
} from './';
import { LearnersComponent, LearnersTableComponent } from './learners';
import { ScrollContainerComponent } from './learners/learners-table/scroll-container/scroll-container.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutes,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [RouterModule],
  declarations: [
    ...DashboardComponents,
    LearnersComponent,
    LearnersTableComponent,
    ScrollContainerComponent
  ],
  entryComponents: DashboardEntryComponents,
  providers: DashboardProviders
})
export class DashboardModule {}

export function DashboardEntrypoint() {
  return DashboardModule;
}
