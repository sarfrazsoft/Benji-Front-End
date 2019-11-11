import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from './../shared/shared.module';

import { EntryComponents, LayoutComponent, LayoutDeclarations } from './';
import { LayoutRoutes } from './layout.routing';

// import { VgBufferingModule } from 'videogular2/buffering';
// import { VgControlsModule } from 'videogular2/controls';
// import { VgCoreModule } from 'videogular2/core';
// import { VgOverlayPlayModule } from 'videogular2/overlay-play';
// import { VgStreamingModule } from 'videogular2/streaming';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutes,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
    // VgCoreModule,
    // VgControlsModule,
    // VgOverlayPlayModule,
    // VgBufferingModule,
    // VgStreamingModule
  ],
  exports: [RouterModule, LayoutComponent],
  declarations: [...LayoutDeclarations],
  entryComponents: [...EntryComponents]
})
export class LayoutModule {}
