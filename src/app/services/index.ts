import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ContextService } from 'src/app/services/context.service';
import { TokenInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { BackendRestService } from './backend/backend-rest.service';
import { BackendSocketService } from './backend/backend-socket.service';
import { EmojiLookupService } from './emoji-lookup.service';
import { LayoutService } from './layout.service';
import { PastSessionsService } from './past-sessions.service';
import { SharingToolService } from './sharing-tool.service';
import { UtilsService } from './utils.service';
import { VideoStateService } from './video-state.service';
import { WhiteLabelResolver } from './white-label.resolver';

import { ActivitiesServices } from './activities';
import { DeactivateGuard } from './auth/deactivate-guard';

export * from './activities';
export { AuthGuard } from './auth/auth.guard';
export {
  WhiteLabelResolver,
  AuthService,
  DeactivateGuard,
  BackendRestService,
  BackendSocketService,
  ContextService,
  EmojiLookupService,
  VideoStateService,
  PastSessionsService,
  SharingToolService,
};

export const ServicesProviders = [
  DeactivateGuard,
  WhiteLabelResolver,
  AuthService,
  BackendRestService,
  BackendSocketService,
  ContextService,
  EmojiLookupService,
  ...ActivitiesServices,
  LayoutService,
  PastSessionsService,
  UtilsService,
  SharingToolService,
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
];
