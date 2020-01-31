export * from './launch-session/launch-session.dialog';
export * from './join-session/join-session.dialog';
export * from './job-info/job-info.dialog';
export * from './confirmation/confirmation.dialog';

import { ConfirmationDialogComponent } from './confirmation/confirmation.dialog';
import { JobInfoDialogComponent } from './job-info/job-info.dialog';
import { JoinSessionDialogComponent } from './join-session/join-session.dialog';
import { LaunchSessionDialogComponent } from './launch-session/launch-session.dialog';

export const Dialogs = [
  ConfirmationDialogComponent,
  LaunchSessionDialogComponent,
  JoinSessionDialogComponent,
  JobInfoDialogComponent
];
