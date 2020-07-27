import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { EditorRoutes } from './editor.routing';
import {
  EditorComponents,
  EditorEntryComponents,
  EditorProviders,
} from './index';

@NgModule({
  imports: [
    CommonModule,
    EditorRoutes,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
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
