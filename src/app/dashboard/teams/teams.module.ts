import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { InfoComponent } from './group-details/info/info.component';
import { GroupsEntryComponents, GroupsProviders, TeamsComponents } from './index';
import { TeamsRoutes } from './teams.routing';

@NgModule({
  imports: [CommonModule, TeamsRoutes, FormsModule, ReactiveFormsModule, SharedModule],
  exports: [RouterModule],
  declarations: [...TeamsComponents, InfoComponent],
  entryComponents: GroupsEntryComponents,
  providers: GroupsProviders,
})
export class TeamsModule {}

export function GroupsEntrypoint() {
  return TeamsModule;
}
