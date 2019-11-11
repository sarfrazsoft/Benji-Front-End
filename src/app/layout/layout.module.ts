import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';

import { EntryComponents, LayoutComponent, LayoutDeclarations } from './';
import { LayoutRoutes } from './layout.routing';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutes,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [RouterModule, LayoutComponent],
  declarations: [...LayoutDeclarations],
  entryComponents: [...EntryComponents]
})
export class LayoutModule {}
