// Core
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MainScreenComponents,
  ParticipantScreenComponents,
  ServicesProviders
} from './index';

// Components
import { RadialTimerComponent } from './ui-components/radial-timer/radial-timer.component';
import { FeedbackPromptComponent } from './ui-components/feedback-prompt/feedback-prompt.component';

// App Pages
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/main-screen/landing.component';
import { MainScreenFooterComponent } from './ui-components/main-screen-footer/main-screen-footer.component';
import { ParticipantLoginComponent } from './pages/landing/participant/login/participant-login.component';
import { ParticipantJoinComponent } from './pages/landing/participant/join/participant-join.component';

// Plugins
import { MatProgressBarModule } from '@angular/material';
import { OnsenModule } from 'ngx-onsenui';
import { PrimaryNavbarComponent } from './ui-components/primary-navbar/primary-navbar.component';

// Material Design Modules
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ElementsComponent } from './elements/elements.component';
import { LinearTimerComponent } from './ui-components/linear-timer/linear-timer.component';
import { AnimatedCheckmarkButtonComponent } from './ui-components/animated-checkmark-button/animated-checkmark-button.component';
import { BTwemojiComponent } from './ui-components/b-twemoji/b-twemoji.component';
import { MainscreenElementsComponent } from './mainscreen-elements/mainscreen-elements.component';
import { MainScreenToolbarComponent } from './ui-components/main-screen-toolbar/main-screen-toolbar.component';
import { ParticipantToolbarComponent } from './ui-components/participant-toolbar/participant-toolbar.component';

@NgModule({
  declarations: [
    AppComponent,
    RadialTimerComponent,
    FeedbackPromptComponent,
    LandingComponent,
    MainScreenFooterComponent,

    ParticipantLoginComponent,
    ParticipantJoinComponent,
    PrimaryNavbarComponent,
    ElementsComponent,
    LinearTimerComponent,
    AnimatedCheckmarkButtonComponent,
    BTwemojiComponent,
    MainscreenElementsComponent,
    MainScreenToolbarComponent,
    ParticipantToolbarComponent,
    ...MainScreenComponents,
    ...ParticipantScreenComponents
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OnsenModule,
    MatButtonModule,
    MatProgressBarModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule
  ],
  providers: [...ServicesProviders],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
