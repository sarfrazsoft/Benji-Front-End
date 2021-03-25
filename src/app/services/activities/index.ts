import { BuildAPitchComponent } from 'src/app/pages/lesson/main-screen/shared/sharing-tool/build-a-pitch/build-a-pitch.component';
import { ActivitySettingsService } from './activity-settings.service';
import { BuildAPitchService } from './build-a-pitch.service';
import { EitherOrActivityService } from './either-or-activity.service';
import { BrainstormService } from './brainstorm.service';

export { ActivitySettingsService, BuildAPitchService, EitherOrActivityService, BrainstormService };

export const ActivitiesServices = [EitherOrActivityService, ActivitySettingsService, BuildAPitchService, BrainstormService];
