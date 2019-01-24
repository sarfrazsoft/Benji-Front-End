import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent, LayoutComponents } from './';
import { LayoutRoutes } from './layout.routing';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MainScreenToolbarComponent } from '../ui-components/main-screen-toolbar/main-screen-toolbar.component';
import { MainScreenFooterComponent } from '../ui-components/main-screen-footer/main-screen-footer.component';
import { BTwemojiComponent } from '../ui-components/b-twemoji/b-twemoji.component';
import { RadialTimerComponent } from '../ui-components/radial-timer/radial-timer.component';
import { LinearTimerComponent } from '../ui-components/linear-timer/linear-timer.component';
import { MainscreenElementsComponent } from '../mainscreen-elements/mainscreen-elements.component';
import { AnimatedCheckmarkButtonComponent } from '../ui-components/animated-checkmark-button/animated-checkmark-button.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ParticipantToolbarComponent } from '../ui-components/participant-toolbar/participant-toolbar.component';

import { ParticipantLoginComponent } from '../pages/landing/participant/login/participant-login.component';
import { ParticipantJoinComponent } from '../pages/landing/participant/join/participant-join.component';

import {
  MainScreenComponents,
  ParticipantScreenComponents,
  ServicesProviders
} from '../index';
import {
  MatButtonModule,
  MatProgressBarModule,
  MatMenuModule,
  MatDialogModule
} from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    LayoutRoutes,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatProgressBarModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule, LayoutComponent],
  declarations: [
    LinearTimerComponent,
    ...LayoutComponents,
    ...MainScreenComponents,
    ...ParticipantScreenComponents,
    ParticipantLoginComponent,
    ParticipantJoinComponent,
    MainScreenToolbarComponent,
    MainScreenFooterComponent,
    BTwemojiComponent,
    RadialTimerComponent,
    MainscreenElementsComponent,
    AnimatedCheckmarkButtonComponent,
    ParticipantToolbarComponent
  ]
})
export class LayoutModule {}
