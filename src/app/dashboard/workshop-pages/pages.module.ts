import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { WorkshopPagesComponents, WorkshopPagesProviders } from './index';
import { PagesRoutes } from './pages.routing';

@NgModule({
  imports: [CommonModule, PagesRoutes, FormsModule, ReactiveFormsModule, SharedModule],
  exports: [RouterModule],
  declarations: [WorkshopPagesComponents],
  entryComponents: WorkshopPagesComponents,
  providers: WorkshopPagesProviders,
})
export class PagesModule {}

export function PagesEntrypoint() {
  return PagesModule;
}
