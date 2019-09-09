import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { GroupsRoutes } from './groups.routing';
import {
  GroupsComponents,
  GroupsEntryComponents,
  GroupsProviders
} from './index';

@NgModule({
  imports: [
    CommonModule,
    GroupsRoutes,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [RouterModule],
  declarations: [GroupsComponents],
  entryComponents: GroupsEntryComponents,
  providers: GroupsProviders
})
export class GroupsModule {}

export function GroupsEntrypoint() {
  return GroupsModule;
}
