import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import {
  LearnersComponents,
  LearnersEntryComponents,
  LearnersProviders
} from './index';
import { LearnersRoutes } from './learners.routing';

@NgModule({
  imports: [
    CommonModule,
    LearnersRoutes,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [RouterModule],
  declarations: [LearnersComponents],
  entryComponents: LearnersEntryComponents,
  providers: LearnersProviders
})
export class LearnersModule {}

export function LearnersEntrypoint() {
  return LearnersModule;
}
