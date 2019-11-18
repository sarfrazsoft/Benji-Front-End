import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
import { SharedModule } from '../../shared/shared.module';
import {
  PastSessionsComponents,
  PastSessionsEntryComponents,
  PastSessionsProviders
} from './index';
import { PastSessionsRoutes } from './past-sessions.routing';

@NgModule({
  imports: [
    CommonModule,
    PastSessionsRoutes,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PerfectScrollbarModule
  ],
  exports: [RouterModule],
  declarations: [PastSessionsComponents],
  entryComponents: PastSessionsEntryComponents,
  providers: [
    ...PastSessionsProviders,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class PastSessionsModule {}

export function PastSessionsEntrypoint() {
  return PastSessionsModule;
}
