export * from './launch-session/launch-session.dialog';
export * from './join-session/join-session.dialog';
export * from './job-info/job-info.dialog';
export * from './confirmation/confirmation.dialog';
export * from './mcq-feedback/mcq-feedback.dialog';
export * from './error-message/error-message.dialog';
export * from './add-video-dialog/add-video.dialog';
export * from './lesson-settings-dialog/lesson-settings.dialog';
export * from './templates-dialog/templates.dialog';

import { AddVideoDialogComponent } from './add-video-dialog/add-video.dialog';
import { ConfirmationDialogComponent } from './confirmation/confirmation.dialog';
import { ErrorMessageDialogComponent } from './error-message/error-message.dialog';
import { JobInfoDialogComponent } from './job-info/job-info.dialog';
import { JoinSessionDialogComponent } from './join-session/join-session.dialog';
import { LaunchSessionDialogComponent } from './launch-session/launch-session.dialog';
import { LessonSettingsDialogComponent } from './lesson-settings-dialog/lesson-settings.dialog';
import { MCQFeedbackDialogComponent } from './mcq-feedback/mcq-feedback.dialog';
import { TemplatesDialogComponent } from './templates-dialog/templates.dialog';

export const Dialogs = [
  AddVideoDialogComponent,
  ConfirmationDialogComponent,
  ErrorMessageDialogComponent,
  JobInfoDialogComponent,
  JoinSessionDialogComponent,
  LaunchSessionDialogComponent,
  LessonSettingsDialogComponent,
  MCQFeedbackDialogComponent,
  TemplatesDialogComponent,
];
