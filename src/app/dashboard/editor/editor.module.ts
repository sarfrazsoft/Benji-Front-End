import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { EditorRoutes } from './editor.routing';
import { EditorComponents, EditorEntryComponents, EditorProviders } from './index';

import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { effects, reducers } from './store';

@NgModule({
  imports: [
    CommonModule,
    EditorRoutes,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PickerModule,
    StoreModule.forFeature('editor', reducers),
    EffectsModule.forFeature(effects),
  ],
  exports: [RouterModule],
  declarations: [EditorComponents],
  entryComponents: EditorEntryComponents,
  providers: EditorProviders,
})
export class EditorModule {}

export function EditorEntrypoint() {
  return EditorModule;
}
