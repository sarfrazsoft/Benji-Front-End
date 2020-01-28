export * from './groups.component';
export * from './add-groups/add-groups.component';
export * from './groups-table/groups-table.component';
export * from './group-details/group-details.component';
export * from './services';

import { AddGroupsComponent } from './add-groups/add-groups.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { SingleStatComponent } from './group-details/stats/single-stat/single-stat.component';
import { StatsComponent } from './group-details/stats/stats.component';
import { GroupsTableComponent } from './groups-table/groups-table.component';
import { GroupsComponent } from './groups.component';
import { GroupsResolver, GroupsService } from './services';

export const GroupsComponents = [
  SingleStatComponent,
  StatsComponent,
  AddGroupsComponent,
  GroupsComponent,
  GroupDetailsComponent,
  GroupsTableComponent
];

export const GroupsEntryComponents = [];

export const GroupsProviders = [GroupsService, GroupsResolver];
