export * from './launch-session/launch-session.dialog';
export * from './join-session/join-session.dialog';
export * from './job-info/job-info.dialog';
export * from './confirmation/confirmation.dialog';
export * from './mcq-feedback/mcq-feedback.dialog';
export * from './error-message/error-message.dialog';
export * from './add-video-dialog/add-video.dialog';
export * from './lesson-settings-dialog/lesson-settings.dialog';
export * from './templates-dialog/templates.dialog';
export * from './idea-creation-dialog/idea-creation.dialog';
export * from './grouping-tool-dialog/grouping-tool.dialog';
export * from './idea-detailed-dialog/idea-detailed.dialog';
export * from './import-slides-dialog/import-slides.dialog'
export * from './participant-grouping-dialog/participant-grouping.dialog';

import { AddVideoDialogComponent } from './add-video-dialog/add-video.dialog';
import { ConfirmationDialogComponent } from './confirmation/confirmation.dialog';
import { ErrorMessageDialogComponent } from './error-message/error-message.dialog';
import { GroupingToolDialogComponent } from './grouping-tool-dialog/grouping-tool.dialog';
import { IdeaCreationDialogComponent } from './idea-creation-dialog/idea-creation.dialog';
import { IdeaDetailedDialogComponent } from './idea-detailed-dialog/idea-detailed.dialog';
import { GiphyComponent } from './image-picker-dialog/giphy/giphy.component';
import { ImagePickerDialogComponent } from './image-picker-dialog/image-picker.dialog';
import { ImportSlidesDialogComponent } from './import-slides-dialog/import-slides.dialog'
import { UnsplashComponent } from './image-picker-dialog/unsplash/unsplash.component';
import { UploadImageComponent } from './image-picker-dialog/upload-image/upload-image.component';
import { JobInfoDialogComponent } from './job-info/job-info.dialog';
import { JoinSessionDialogComponent } from './join-session/join-session.dialog';
import { LaunchSessionDialogComponent } from './launch-session/launch-session.dialog';
import { LessonSettingsDialogComponent } from './lesson-settings-dialog/lesson-settings.dialog';
import { MCQFeedbackDialogComponent } from './mcq-feedback/mcq-feedback.dialog';
import { ParticipantGroupingDialogComponent } from './participant-grouping-dialog/participant-grouping.dialog';
import { TemplatesDialogComponent } from './templates-dialog/templates.dialog';

export const Dialogs = [
  AddVideoDialogComponent,
  ConfirmationDialogComponent,
  ErrorMessageDialogComponent,
  ImagePickerDialogComponent,
 // ImportSlidesDialogComponent,
  UnsplashComponent,
  GiphyComponent,
  UploadImageComponent,
  JobInfoDialogComponent,
  JoinSessionDialogComponent,
  LaunchSessionDialogComponent,
  LessonSettingsDialogComponent,
  MCQFeedbackDialogComponent,
  TemplatesDialogComponent,
  IdeaCreationDialogComponent,
  GroupingToolDialogComponent,
  ParticipantGroupingDialogComponent,
  IdeaDetailedDialogComponent,
];
