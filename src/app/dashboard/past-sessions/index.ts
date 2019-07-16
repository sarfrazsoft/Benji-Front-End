export * from './services/past-sessions.service';

import { PastSessionsComponent } from './past-sessions.component';
import { PastSessionsService } from './services/past-sessions.service';
export { PastSessionsComponent };

export const PastSessionsComponents = [PastSessionsComponent];

export const PastSessionsProviders = [PastSessionsService];
