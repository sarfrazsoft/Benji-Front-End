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

// Cmponents
import { RadialTimerComponent } from './ui-components/radial-timer.component';

// App Pages
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { WaitingScreenComponent } from './pages/desktop/waiting-screen/waiting-screen.component';
import { SessionComponent } from './pages/desktop/session/session.component';
import { DesktopFooterComponent } from './pages/desktop/session/desktop-footer.component';
import { DesktopTitleComponent } from './pages/desktop/session/desktop-title.component';
import { DesktopVideoActivityComponent } from './pages/desktop/session/desktop-video-activity.component';
import { DesktopTPSActivityComponent } from './pages/desktop/session/desktop-tps-activity.component';
import { DesktopMCQActivityComponent } from './pages/desktop/session/desktop-mcq-activity.component';
import { MobileLoginComponent } from './pages/mobile/login/mobile-login.component';
import { MobileJoinComponent } from './pages/mobile/join/mobile-join.component';
import { MobileWaitingScreenComponent } from './pages/mobile/waiting-screen/mobile-waiting-screen.component';
import { MobileSessionComponent } from './pages/mobile/session/mobile-session.component';
import { MobileTitleComponent } from './pages/mobile/session/mobile-title.component';
import { MobileVideoActivityComponent } from './pages/mobile/session/mobile-video-activity.component';
import { MobileTPSActivityComponent } from './pages/mobile/session/mobile-tps-activity.component';
import { MobileMCQActivityComponent } from './pages/mobile/session/mobile-mcq-activity.component';

// Plugins
import { MatProgressBarModule } from '@angular/material';
import { OnsenModule } from 'ngx-onsenui';

@NgModule({
  declarations: [
    AppComponent,
    RadialTimerComponent,
    LandingComponent,
    WaitingScreenComponent,
    SessionComponent,
    DesktopFooterComponent,
    DesktopTitleComponent,
    DesktopVideoActivityComponent,
    DesktopTPSActivityComponent,
    DesktopMCQActivityComponent,
    MobileLoginComponent,
    MobileJoinComponent,
    MobileWaitingScreenComponent,
    MobileSessionComponent,
    MobileTitleComponent,
    MobileVideoActivityComponent,
    MobileTPSActivityComponent,
    MobileMCQActivityComponent
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
