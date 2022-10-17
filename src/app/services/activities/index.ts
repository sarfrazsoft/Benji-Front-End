import { ActivitiesService } from './activities.service';
import { ActivitySettingsService } from './activity-settings.service';
import { BoardsNavigationService } from './boards-navigation.service';
import { BrainstormService } from './brainstorm.service';
import { BuildAPitchService } from './build-a-pitch.service';
import { EitherOrActivityService } from './either-or-activity.service';

export {
  ActivitySettingsService,
  BuildAPitchService,
  EitherOrActivityService,
  BrainstormService,
  ActivitiesService,
  BoardsNavigationService,
};

export const ActivitiesServices = [
  ActivitiesService,
  ActivitySettingsService,
  BuildAPitchService,
  BrainstormService,
  EitherOrActivityService,
  BoardsNavigationService,
];
