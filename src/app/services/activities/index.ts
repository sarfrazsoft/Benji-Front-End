import { BuildAPitchComponent } from 'src/app/pages/lesson/main-screen/shared/sharing-tool/build-a-pitch/build-a-pitch.component';
import { ActivitySettingsService } from './activity-settings.service';
import { BuildAPitchService } from './build-a-pitch.service';
import { EitherOrActivityService } from './either-or-activity.service';

export { ActivitySettingsService, BuildAPitchService, EitherOrActivityService };

export const ActivitiesServices = [EitherOrActivityService, ActivitySettingsService, BuildAPitchService];
