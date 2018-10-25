// Core
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';

// Services
import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './services/auth.interceptor';
import { BackendService } from './services/backend.service';
import { WebSocketService } from './services/socket.service';
import { EmojiLookupService } from './services/emoji-lookup.service';

// Components
import { RadialTimerComponent } from './ui-components/radial-timer/radial-timer.component';
import { FeedbackPromptComponent } from './ui-components/feedback-prompt/feedback-prompt.component';

// App Pages
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { MainScreenLobbyComponent } from './pages/main-screen/session/lobby/main-screen-lobby.component';
import { SessionComponent } from './pages/main-screen/session/session.component';
import { MainScreenFooterComponent } from './ui-components/main-screen-footer/main-screen-footer.component';
import { MainScreenTitleComponent } from './pages/main-screen/session/title/main-screen-title.component';
import { MainScreenVideoActivityComponent } from './pages/main-screen/session/activities/video/main-screen-video-activity.component';
import { MainScreenTPSActivityComponent } from './pages/main-screen/session/activities/tps/main-screen-tps-activity.component';
import { MainScreenMCQActivityComponent } from './pages/main-screen/session/activities/mcq/main-screen-mcq-activity.component';
import { MainScreenTeletriviaActivityComponent } from './pages/main-screen/session/activities/teletrivia/main-screen-teletrivia-activity.component';

// tslint:disable-next-line:max-line-length
import { MainScreenFeedbackActivityComponent } from './pages/main-screen/session/activities/feedback/main-screen-feedback-activity.component';
import { ParticipantLoginComponent } from './pages/participant/login/participant-login.component';
import { ParticipantJoinComponent } from './pages/participant/join/participant-join.component';
import { ParticipantLobbyComponent } from './pages/participant/lesson/participant-lobby/participant-lobby.component';
import { ParticipantSessionComponent } from './pages/participant/session/participant-session.component';
import { ParticipantTitleComponent } from './pages/participant/session/title/participant-title.component';
import { ParticipantVideoActivityComponent } from './pages/participant/session/activity/video/participant-video-activity.component';
import { ParticipantTPSActivityComponent } from './pages/participant/session/activity/tps/participant-tps-activity.component';
import { ParticipantMCQActivityComponent } from './pages/participant/session/activity/mcq/participant-mcq-activity.component';

// tslint:disable-next-line:max-line-length
// import { ParticipantFeedbackActivityComponent } from './pages/participant/session/activity/feedback/participant-feedback-activity.component';

// Plugins
import { MatProgressBarModule } from '@angular/material';
import { OnsenModule } from 'ngx-onsenui';
import { PrimaryNavbarComponent } from './ui-components/primary-navbar/primary-navbar.component';


// Material Design Modules
import { MatMenuModule} from '@angular/material/menu';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { ElementsComponent } from './elements/elements.component';
import { LinearTimerComponent } from './ui-components/linear-timer/linear-timer.component';
import { AnimatedCheckmarkButtonComponent } from './ui-components/animated-checkmark-button/animated-checkmark-button.component';
import { BTwemojiComponent } from './ui-components/b-twemoji/b-twemoji.component';
import { MainscreenElementsComponent } from './mainscreen-elements/mainscreen-elements.component';
import { MainScreenToolbarComponent } from './ui-components/main-screen-toolbar/main-screen-toolbar.component';
// tslint:disable-next-line:max-line-length
import { ParticipantTeletriviaActivityComponent } from './pages/participant/session/activity/participant-teletrivia-activity/participant-teletrivia-activity.component';
import { MainScreenLessonComponent } from './pages/main-screen/lesson/main-screen-lesson.component';
import { MainScreenPairActivityComponent } from './pages/main-screen/lesson/main-screen-pair-activity/main-screen-pair-activity.component';
// tslint:disable-next-line:max-line-length
import { MainScreenDiscussionActivityComponent } from './pages/main-screen/lesson/main-screen-discussion-activity/main-screen-discussion-activity.component';
import { ParticipantLessonComponent } from './pages/participant/lesson/participant-lesson.component';
import { ParticipantToolbarComponent } from './ui-components/participant-toolbar/participant-toolbar.component';
import { ParticipantPairActivityComponent } from './pages/participant/lesson/participant-pair-activity/participant-pair-activity.component';
// tslint:disable-next-line:max-line-length
import { ParticipantDiscussionActivityComponent } from './pages/participant/lesson/participant-discussion-activity/participant-discussion-activity.component';
import { ParticipantHintActivityComponent } from './pages/participant/lesson/participant-hint-activity/participant-hint-activity.component';
// tslint:disable-next-line:max-line-length
import { ParticipantFeedbackActivityComponent } from './pages/participant/lesson/participant-feedback-activity/participant-feedback-activity.component';

@NgModule({
  declarations: [
    AppComponent,
    RadialTimerComponent,
    FeedbackPromptComponent,
    LandingComponent,
    MainScreenLobbyComponent,
    SessionComponent,
    MainScreenFooterComponent,
    MainScreenTitleComponent,
    MainScreenVideoActivityComponent,
    MainScreenTPSActivityComponent,
    MainScreenMCQActivityComponent,
    MainScreenFeedbackActivityComponent,
    MainScreenTeletriviaActivityComponent,

    ParticipantLoginComponent,
    ParticipantJoinComponent,
    ParticipantLobbyComponent,
    ParticipantSessionComponent,
    ParticipantTitleComponent,
    ParticipantVideoActivityComponent,
    ParticipantTPSActivityComponent,
    ParticipantMCQActivityComponent,
    ParticipantFeedbackActivityComponent,
    PrimaryNavbarComponent,
    ElementsComponent,
    LinearTimerComponent,
    AnimatedCheckmarkButtonComponent,
    BTwemojiComponent,
    MainscreenElementsComponent,
    MainScreenToolbarComponent,
    ParticipantTeletriviaActivityComponent,
    MainScreenLessonComponent,
    MainScreenPairActivityComponent,
    MainScreenDiscussionActivityComponent,
    ParticipantLessonComponent,
    ParticipantToolbarComponent,
    ParticipantPairActivityComponent,
    ParticipantDiscussionActivityComponent,
    ParticipantHintActivityComponent,

  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    OnsenModule,
    MatProgressBarModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [
    AuthService,
    BackendService,
    WebSocketService,
    EmojiLookupService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
