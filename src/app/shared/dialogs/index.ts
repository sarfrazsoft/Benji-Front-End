export * from './launch-session/launch-session.dialog';
export * from './join-session/join-session.dialog';
export * from './job-info/job-info.dialog';
export * from './confirmation/confirmation.dialog';
export * from './mcq-feedback/mcq-feedback.dialog';
export * from './error-message/error-message.dialog';

import { ConfirmationDialogComponent } from './confirmation/confirmation.dialog';
import { ErrorMessageDialogComponent } from './error-message/error-message.dialog';
import { JobInfoDialogComponent } from './job-info/job-info.dialog';
import { JoinSessionDialogComponent } from './join-session/join-session.dialog';
import { LaunchSessionDialogComponent } from './launch-session/launch-session.dialog';
import { MCQFeedbackDialogComponent } from './mcq-feedback/mcq-feedback.dialog';

export const Dialogs = [
  ConfirmationDialogComponent,
  LaunchSessionDialogComponent,
  JoinSessionDialogComponent,
  JobInfoDialogComponent,
  MCQFeedbackDialogComponent,
  ErrorMessageDialogComponent
];
