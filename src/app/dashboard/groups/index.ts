export * from './groups.component';
export * from './add-groups/add-groups.component';
export * from './table/table.component';
export * from './group-details/group-details.component';
export * from './services';

import { AddGroupsComponent } from './add-groups/add-groups.component';
import { AddLearnersDialogComponent } from './group-details/add-learners-dialog/add-learners.dialog';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { LearnersTableComponent as GroupsLearnersTableComponent } from './group-details/learners/table.component';
import { PastSessionsTableComponent } from './group-details/past-sessions/table.component';
import { SingleStatComponent } from './group-details/stats/single-stat/single-stat.component';
import { StatsComponent } from './group-details/stats/stats.component';
import { GroupsComponent } from './groups.component';
import { GroupsResolver, GroupsService } from './services';
import { GroupsTableComponent } from './table/table.component';

export const GroupsComponents = [
  SingleStatComponent,
  StatsComponent,
  PastSessionsTableComponent,
  AddGroupsComponent,
  GroupsComponent,
  GroupDetailsComponent,
  GroupsTableComponent,
  GroupsLearnersTableComponent,
  AddLearnersDialogComponent
];

export const GroupsEntryComponents = [AddLearnersDialogComponent];

export const GroupsProviders = [GroupsService, GroupsResolver];
