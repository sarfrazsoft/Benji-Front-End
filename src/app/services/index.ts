import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ContextService } from 'src/app/services/context.service';
import { TokenInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { BackendRestService } from './backend/backend-rest.service';
import { BackendSocketService } from './backend/backend-socket.service';
import { EitherOrActivityService } from './either-or-activity.service';
import { EmojiLookupService } from './emoji-lookup.service';
import { LayoutService } from './layout.service';
import { PastSessionsService } from './past-sessions.service';
import { UtilsService } from './utils.service';
import { VideoStateService } from './video-state.service';
import { WhiteLabelResolver } from './white-label.resolver';

export { AuthGuard } from './auth/auth.guard';
export {
  WhiteLabelResolver,
  AuthService,
  BackendRestService,
  BackendSocketService,
  ContextService,
  EmojiLookupService,
  EitherOrActivityService,
  VideoStateService,
  PastSessionsService,
};

export const ServicesProviders = [
  WhiteLabelResolver,
  AuthService,
  BackendRestService,
  BackendSocketService,
  ContextService,
  EmojiLookupService,
  EitherOrActivityService,
  LayoutService,
  PastSessionsService,
  UtilsService,
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
];
