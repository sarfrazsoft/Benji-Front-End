// Core
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

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
import { MainScreenLobbyComponent } from './pages/main-screen/lesson/main-screen-lobby-activity/main-screen-lobby.component';
import { MainScreenFooterComponent } from './ui-components/main-screen-footer/main-screen-footer.component';
// tslint:disable-next-line:max-line-length
import { MainScreenVideoActivityComponent } from './pages/main-screen/lesson/main-screen-video-activity/main-screen-video-activity.component';
// tslint:disable-next-line:max-line-length
import { MainScreenTeletriviaActivityComponent } from './pages/main-screen/lesson/main-screen-teletrivia-activity/main-screen-teletrivia-activity.component';
// tslint:disable-next-line:max-line-length
import { MainScreenFeedbackActivityComponent } from './pages/main-screen/lesson/main-screen-feedback-activity/main-screen-feedback-activity.component';

import { ParticipantLoginComponent } from './pages/participant/login/participant-login.component';
import { ParticipantJoinComponent } from './pages/participant/join/participant-join.component';
import { ParticipantLobbyComponent } from './pages/participant/lesson/participant-lobby-activity/participant-lobby.component';
// tslint:disable-next-line:max-line-length
import { ParticipantVideoActivityComponent } from './pages/participant/lesson/participant-video-activity/participant-video-activity.component';

// tslint:disable-next-line:max-line-length
// import { ParticipantFeedbackActivityComponent } from './pages/participant/lesson/activity/feedback/participant-feedback-activity.component';

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
import { ParticipantTeletriviaActivityComponent } from './pages/participant/lesson/participant-teletrivia-activity/participant-teletrivia-activity.component';
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
import { MainScreenHintActivityComponent } from './pages/main-screen/lesson/main-screen-hint-activity/main-screen-hint-activity.component';

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
    BackendService,
    WebSocketService,
    EmojiLookupService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
