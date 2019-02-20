import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ContextService } from 'src/app/services/context.service';
import { TokenInterceptor } from './auth/auth.interceptor';
import { AuthService } from './auth/auth.service';
import { BackendRestService } from './backend/backend-rest.service';
import { BackendSocketService } from './backend/backend-socket.service';
import { EmojiLookupService } from './emoji-lookup.service';
import { LayoutService } from './layout.service';

export { AuthGuard } from './auth/auth.guard';
export { AuthService, ContextService };

export const ServicesProviders = [
  AuthService,
  BackendRestService,
  BackendSocketService,
  ContextService,
  EmojiLookupService,
  LayoutService,
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];
