export * from './groups.component';
export * from './add-groups/add-groups.component';
export * from './groups-table/groups-table.component';
export * from './services';

import { AddGroupsComponent } from './add-groups/add-groups.component';
import { GroupsTableComponent } from './groups-table/groups-table.component';
import { GroupsComponent } from './groups.component';
import { GroupsResolver, GroupsService } from './services';

export const GroupsComponents = [
  AddGroupsComponent,
  GroupsComponent,
  GroupsTableComponent
];

export const GroupsEntryComponents = [];

export const GroupsProviders = [GroupsService, GroupsResolver];
