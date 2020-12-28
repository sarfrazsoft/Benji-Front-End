export * from './low-response/low-response.dialog';
export * from './low-attendance/low-attendance.dialog';
export * from './peak-back/peak-back.dialog';
export * from './image-view/image-view.dialog';
export * from './case-study-checkin/case-study-checkin.dialog';

import { CaseStudyCheckinDialogComponent } from './case-study-checkin/case-study-checkin.dialog';
import { ImageViewDialogComponent } from './image-view/image-view.dialog';
import { LowAttendanceDialogComponent } from './low-attendance/low-attendance.dialog';
import { LowResponseDialogComponent } from './low-response/low-response.dialog';
import { PeakBackDialogComponent } from './peak-back/peak-back.dialog';

export const LessonDialogs = [
  LowResponseDialogComponent,
  LowAttendanceDialogComponent,
  PeakBackDialogComponent,
  ImageViewDialogComponent,
  CaseStudyCheckinDialogComponent,
];
