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
import { InfiniteScrollListComponent } from './learners/infinite-scroll-list/infinite-scroll-list.component';
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
    InfiniteScrollListComponent
  ],
  entryComponents: DashboardEntryComponents,
  providers: DashboardProviders
})
export class DashboardModule {}

export function DashboardEntrypoint() {
  return DashboardModule;
}
