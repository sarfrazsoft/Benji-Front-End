import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ContextService } from 'src/app/services/context.service';
import { TokenInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { BackendRestService } from './backend/backend-rest.service';
import { BackendSocketService } from './backend/backend-socket.service';
import { BoardStatusService } from './board-status.service';
import { EmojiLookupService } from './emoji-lookup.service';
import { GroupingToolService } from './grouping-tool.service';
import { LayoutService } from './layout.service';
import { NotificationService } from './notification.service';
import { PastSessionsService } from './past-sessions.service';
import { PostLayoutService } from './post-layout.service';
import { SharingToolService } from './sharing-tool.service';
import { TopicMediaService } from './topic-media.service';
import { UtilsService } from './utils.service';
import { VideoStateService } from './video-state.service';
import { WhiteLabelResolver } from './white-label.resolver';

import { ActivitiesServices } from './activities';
import { DeactivateGuard } from './auth/deactivate-guard';
import { LessonGroupService } from './lesson-group.service';
import { LessonService } from './lesson.service';

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
  GroupingToolService,
  PostLayoutService,
  NotificationService,
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
  GroupingToolService,
  BoardStatusService,
  TopicMediaService,
  LessonGroupService,
  LessonService,
  PostLayoutService,
  NotificationService,
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
];
