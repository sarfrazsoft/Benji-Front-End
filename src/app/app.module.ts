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
import { RadialTimerComponent } from './ui-components/radial-timer/radial-timer.component';
import { FeedbackPromptComponent } from './ui-components/feedback-prompt/feedback-prompt.component';

// App Pages
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { DesktopLobbyComponent } from './pages/main-screen/session/lobby/main-screen-lobby.component';
import { SessionComponent } from './pages/main-screen/session/session.component';
import { DesktopFooterComponent } from './pages/main-screen/session/footer/main-screen-footer.component';
import { DesktopTitleComponent } from './pages/main-screen/session/title/main-screen-title.component';
import { DesktopVideoActivityComponent } from './pages/main-screen/session/activities/video/main-screen-video-activity.component';
import { DesktopTPSActivityComponent } from './pages/main-screen/session/activities/tps/main-screen-tps-activity.component';
import { DesktopMCQActivityComponent } from './pages/main-screen/session/activities/mcq/desktop-mcq-activity.component';
import { DesktopFeedbackActivityComponent } from './pages/main-screen/session/activities/feedback/desktop-feedback-activity.component';
import { ParticipantLoginComponent } from './pages/participant/login/participant-login.component';
import { ParticipantJoinComponent } from './pages/participant/join/participant-join.component';
import { MobileLobbyComponent } from './pages/participant/session/lobby/participant-lobby.component';
import { ParticipantSessionComponent } from './pages/participant/session/participant-session.component';
import { MobileTitleComponent } from './pages/participant/session/title/participant-title.component';
import { MobileVideoActivityComponent } from './pages/participant/session/activity/video/participant-video-activity.component';
import { MobileTPSActivityComponent } from './pages/participant/session/activity/tps/participant-tps-activity.component';
import { MobileMCQActivityComponent } from './pages/participant/session/activity/mcq/participant-mcq-activity.component';
import { MobileFeedbackActivityComponent } from './pages/participant/session/activity/feedback/participant-feedback-activity.component';

// Plugins
import { MatProgressBarModule } from '@angular/material';
import { OnsenModule } from 'ngx-onsenui';
import { PrimaryNavbarComponent } from './ui-components/primary-navbar/primary-navbar.component';

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

    ParticipantLoginComponent,
    ParticipantJoinComponent,
    MobileLobbyComponent,
    ParticipantSessionComponent,
    MobileTitleComponent,
    MobileVideoActivityComponent,
    MobileTPSActivityComponent,
    MobileMCQActivityComponent,
    MobileFeedbackActivityComponent,
    PrimaryNavbarComponent
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
