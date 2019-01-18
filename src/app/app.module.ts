// Core
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

// Services
import { AuthService } from './services/auth/auth.service';
import { TokenInterceptor } from './services/auth/auth.interceptor';
import { BackendRestService } from './services/backend/backend-rest.service';
import { BackendSocketService } from './services/backend/backend-socket.service';
import { EmojiLookupService } from './services/emoji-lookup.service';

// Components
import { RadialTimerComponent } from './ui-components/radial-timer/radial-timer.component';
import { FeedbackPromptComponent } from './ui-components/feedback-prompt/feedback-prompt.component';

// App Pages
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/main-screen/landing.component';
import { MainScreenLobbyComponent } from './pages/lesson/main-screen/main-screen-lobby-activity/main-screen-lobby.component';
import { MainScreenFooterComponent } from './ui-components/main-screen-footer/main-screen-footer.component';
import { MainScreenVideoActivityComponent } from './pages/lesson/main-screen/main-screen-video-activity/main-screen-video-activity.component';
import { MainScreenTeletriviaActivityComponent } from './pages/lesson/main-screen/main-screen-teletrivia-activity/main-screen-teletrivia-activity.component';
import { MainScreenFeedbackActivityComponent } from './pages/lesson/main-screen/main-screen-feedback-activity/main-screen-feedback-activity.component';
import { ParticipantLoginComponent } from './pages/landing/participant/login/participant-login.component';
import { ParticipantJoinComponent } from './pages/landing/participant/join/participant-join.component';
import { ParticipantLobbyComponent } from './pages/lesson/participant/participant-lobby-activity/participant-lobby.component';
import { ParticipantVideoActivityComponent } from './pages/lesson/participant/participant-video-activity/participant-video-activity.component';
// import { ParticipantFeedbackActivityComponent } from './pages/participant/lesson/activity/feedback/participant-feedback-activity.component';

// Plugins
import { MatProgressBarModule } from '@angular/material';
import { OnsenModule } from 'ngx-onsenui';
import { PrimaryNavbarComponent } from './ui-components/primary-navbar/primary-navbar.component';

// Material Design Modules
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ElementsComponent } from './elements/elements.component';
import { LinearTimerComponent } from './ui-components/linear-timer/linear-timer.component';
import { AnimatedCheckmarkButtonComponent } from './ui-components/animated-checkmark-button/animated-checkmark-button.component';
import { BTwemojiComponent } from './ui-components/b-twemoji/b-twemoji.component';
import { MainscreenElementsComponent } from './mainscreen-elements/mainscreen-elements.component';
import { MainScreenToolbarComponent } from './ui-components/main-screen-toolbar/main-screen-toolbar.component';

import { ParticipantTeletriviaActivityComponent } from './pages/lesson/participant/participant-teletrivia-activity/participant-teletrivia-activity.component';
import { MainScreenLessonComponent } from './pages/lesson/main-screen/main-screen-lesson.component';
import { MainScreenPairActivityComponent } from './pages/lesson/main-screen/main-screen-pair-activity/main-screen-pair-activity.component';
import { MainScreenDiscussionActivityComponent } from './pages/lesson/main-screen/main-screen-discussion-activity/main-screen-discussion-activity.component';
import { ParticipantLessonComponent } from './pages/lesson/participant/participant-lesson.component';
import { ParticipantToolbarComponent } from './ui-components/participant-toolbar/participant-toolbar.component';
import { ParticipantPairActivityComponent } from './pages/lesson/participant/participant-pair-activity/participant-pair-activity.component';
import { ParticipantDiscussionActivityComponent } from './pages/lesson/participant/participant-discussion-activity/participant-discussion-activity.component';
import { ParticipantHintActivityComponent } from './pages/lesson/participant/participant-hint-activity/participant-hint-activity.component';
import { ParticipantFeedbackActivityComponent } from './pages/lesson/participant/participant-feedback-activity/participant-feedback-activity.component';
import { MainScreenHintActivityComponent } from './pages/lesson/main-screen/main-screen-hint-activity/main-screen-hint-activity.component';
import { MainScreenMcqActivityComponent } from './pages/lesson/main-screen/main-screen-mcq-activity/main-screen-mcq-activity.component';
import { ParticipantMcqActivityComponent } from './pages/lesson/participant/participant-mcq-activity/participant-mcq-activity.component';

@NgModule({
  declarations: [
    AppComponent,
    RadialTimerComponent,
    FeedbackPromptComponent,
    LandingComponent,
    MainScreenLobbyComponent,
    MainScreenFooterComponent,
    MainScreenVideoActivityComponent,
    MainScreenFeedbackActivityComponent,
    MainScreenTeletriviaActivityComponent,

    ParticipantLoginComponent,
    ParticipantJoinComponent,
    ParticipantLobbyComponent,
    ParticipantVideoActivityComponent,
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
    MainScreenHintActivityComponent,
    MainScreenMcqActivityComponent,
    ParticipantMcqActivityComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OnsenModule,
    MatProgressBarModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [
    AuthService,
    BackendRestService,
    BackendSocketService,
    EmojiLookupService,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
