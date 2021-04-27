import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgxEditorModule } from 'ngx-editor';

import { EntryComponents, LayoutComponent, LayoutDeclarations } from './';
import { SharedModule } from './../shared/shared.module';
import { LayoutRoutes } from './layout.routing';

@NgModule({
  imports: [CommonModule, LayoutRoutes, FormsModule, ReactiveFormsModule, SharedModule, NgxEditorModule],
  exports: [RouterModule, LayoutComponent],
  declarations: [...LayoutDeclarations],
  entryComponents: [...EntryComponents],
})
export class LayoutModule {}
