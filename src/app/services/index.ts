import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './auth/auth.service';
import { TokenInterceptor } from './auth/auth.interceptor';
import { BackendRestService } from './backend/backend-rest.service';
import { BackendSocketService } from './backend/backend-socket.service';
import { EmojiLookupService } from './emoji-lookup.service';

export const ServicesProviders = [
  AuthService,
  BackendRestService,
  BackendSocketService,
  EmojiLookupService,
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
];
