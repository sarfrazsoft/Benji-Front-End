export * from './low-response/low-response.dialog';
export * from './low-attendance/low-attendance.dialog';

import { LowAttendanceDialogComponent } from './low-attendance/low-attendance.dialog';
import { LowResponseDialogComponent } from './low-response/low-response.dialog';

export const LessonDialogs = [
  LowResponseDialogComponent,
  LowAttendanceDialogComponent
];
