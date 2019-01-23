import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { DashboardRoutes } from './dashboard.routing';

import {
  DashboardComponents,
  DashboardEntryComponents,
  DashboardProviders
} from './';

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    DashboardRoutes,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule],
  declarations: [...DashboardComponents],
  entryComponents: DashboardEntryComponents,
  providers: DashboardProviders
})
export class DashboardModule {}

export function DashboardEntrypoint() {
  return DashboardModule;
}
