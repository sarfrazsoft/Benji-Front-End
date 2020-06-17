export * from './low-response/low-response.dialog';
export * from './low-attendance/low-attendance.dialog';
export * from './peak-back/peak-back.dialog';

import { LowAttendanceDialogComponent } from './low-attendance/low-attendance.dialog';
import { LowResponseDialogComponent } from './low-response/low-response.dialog';
import { PeakBackDialogComponent } from './peak-back/peak-back.dialog';

export const LessonDialogs = [
  LowResponseDialogComponent,
  LowAttendanceDialogComponent,
  PeakBackDialogComponent,
];
