import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';

import { LayoutComponent, LayoutDeclarations } from './';
import { LayoutRoutes } from './layout.routing';

import {
  MatButtonModule,
  MatDialogModule,
  MatIconModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutes,
    // MatButtonModule,
    // MatDialogModule,
    // MatIconModule,
    // MatMenuModule,
    // MatProgressBarModule,
    // MatProgressSpinnerModule,
    // MatSidenavModule,
    // MatToolbarModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [RouterModule, LayoutComponent],
  declarations: [...LayoutDeclarations]
})
export class LayoutModule {}
