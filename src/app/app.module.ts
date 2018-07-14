// Core
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Services
import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './services/auth.interceptor';
import { BackendService } from './services/backend.service';
import { WebsocketService } from './services/socket.service';

// Components
import { RadialTimerComponent } from './ui-components/radial-timer.component';
import { FeedbackPromptComponent } from './ui-components/feedback-prompt.component';

// App Pages
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { DesktopLobbyComponent } from './pages/desktop/session/desktop-lobby.component';
import { SessionComponent } from './pages/desktop/session/session.component';
import { DesktopFooterComponent } from './pages/desktop/session/desktop-footer.component';
import { DesktopTitleComponent } from './pages/desktop/session/desktop-title.component';
import { DesktopVideoActivityComponent } from './pages/desktop/session/desktop-video-activity.component';
import { DesktopTPSActivityComponent } from './pages/desktop/session/desktop-tps-activity.component';
import { DesktopMCQActivityComponent } from './pages/desktop/session/desktop-mcq-activity.component';
import { DesktopFeedbackActivityComponent } from './pages/desktop/session/desktop-feedback-activity.component';
import { MobileLoginComponent } from './pages/mobile/login/mobile-login.component';
import { MobileJoinComponent } from './pages/mobile/join/mobile-join.component';
import { MobileLobbyComponent } from './pages/mobile/session/mobile-lobby.component';
import { MobileSessionComponent } from './pages/mobile/session/mobile-session.component';
import { MobileTitleComponent } from './pages/mobile/session/mobile-title.component';
import { MobileVideoActivityComponent } from './pages/mobile/session/mobile-video-activity.component';
import { MobileTPSActivityComponent } from './pages/mobile/session/mobile-tps-activity.component';
import { MobileMCQActivityComponent } from './pages/mobile/session/mobile-mcq-activity.component';
import { MobileFeedbackActivityComponent } from './pages/mobile/session/mobile-feedback-activity.component';

// Plugins
import { MatProgressBarModule } from '@angular/material';
import { OnsenModule } from 'ngx-onsenui';

@NgModule({
  declarations: [
    AppComponent,
    RadialTimerComponent,
    FeedbackPromptComponent,

    LandingComponent,
    DesktopLobbyComponent,
    SessionComponent,
    DesktopFooterComponent,
    DesktopTitleComponent,
    DesktopVideoActivityComponent,
    DesktopTPSActivityComponent,
    DesktopMCQActivityComponent,
    DesktopFeedbackActivityComponent,

    MobileLoginComponent,
    MobileJoinComponent,
    MobileLobbyComponent,
    MobileSessionComponent,
    MobileTitleComponent,
    MobileVideoActivityComponent,
    MobileTPSActivityComponent,
    MobileMCQActivityComponent,
    MobileFeedbackActivityComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    OnsenModule,
    MatProgressBarModule
  ],
  providers: [
    AuthService,
    BackendService,
    WebsocketService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
