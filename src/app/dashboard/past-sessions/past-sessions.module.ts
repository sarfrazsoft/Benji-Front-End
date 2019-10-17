import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import {
  PastSessionsComponents,
  PastSessionsEntryComponents,
  PastSessionsProviders
} from './index';
import { PastSessionsRoutes } from './past-sessions.routing';
import { PitchOMaticComponent } from './reports/pitch-o-matic/pitch-o-matic.component';

@NgModule({
  imports: [
    CommonModule,
    PastSessionsRoutes,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [RouterModule],
  declarations: [PastSessionsComponents, PitchOMaticComponent],
  entryComponents: PastSessionsEntryComponents,
  providers: PastSessionsProviders
})
export class PastSessionsModule {}

export function PastSessionsEntrypoint() {
  return PastSessionsModule;
}
