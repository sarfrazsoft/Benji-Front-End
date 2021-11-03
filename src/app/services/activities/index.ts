import { BuildAPitchComponent } from 'src/app/pages/lesson/main-screen/shared/sharing-tool/build-a-pitch/build-a-pitch.component';
import { ActivitiesService } from './activities.service';
import { ActivitySettingsService } from './activity-settings.service';
import { BrainstormService } from './brainstorm.service';
import { BuildAPitchService } from './build-a-pitch.service';
import { EitherOrActivityService } from './either-or-activity.service';

export {
  ActivitySettingsService,
  BuildAPitchService,
  EitherOrActivityService,
  BrainstormService,
  ActivitiesService,
};

export const ActivitiesServices = [
  ActivitiesService,
  ActivitySettingsService,
  BuildAPitchService,
  BrainstormService,
  EitherOrActivityService,
];
