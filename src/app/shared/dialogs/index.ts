export * from './launch-session/launch-session.dialog';
export * from './join-session/join-session.dialog';

import { JoinSessionDialogComponent } from './join-session/join-session.dialog';
import { LaunchSessionDialogComponent } from './launch-session/launch-session.dialog';

export const Dialogs = [
  LaunchSessionDialogComponent,
  JoinSessionDialogComponent
];
