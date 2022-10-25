import { ActivitiesService } from './activities.service';
import { ActivitySettingsService } from './activity-settings.service';
import { BoardsNavigationService } from './boards-navigation.service';
import { BrainstormEventService } from './brainstorm-event.service';
import { BrainstormService } from './brainstorm.service';
import { BuildAPitchService } from './build-a-pitch.service';

export {
  ActivitySettingsService,
  BuildAPitchService,
  BrainstormEventService,
  BrainstormService,
  ActivitiesService,
  BoardsNavigationService,
};

export const ActivitiesServices = [
  ActivitiesService,
  ActivitySettingsService,
  BuildAPitchService,
  BrainstormService,
  BrainstormEventService,
  BoardsNavigationService,
];
