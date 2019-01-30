// Core
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { ServicesProviders } from './index';

import { LayoutModule } from './layout/layout.module';

// App Pages
import { AppComponent } from './app.component';

// Temporary imports
import { ElementsComponent } from './elements/elements.component';
import { FeedbackPromptComponent } from './ui-components/feedback-prompt/feedback-prompt.component';
import { PrimaryNavbarComponent } from './ui-components/primary-navbar/primary-navbar.component';

// Plugins
import { OnsenModule } from 'ngx-onsenui';

@NgModule({
  declarations: [
    AppComponent,
    ElementsComponent,
    FeedbackPromptComponent,
    PrimaryNavbarComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OnsenModule,
    LayoutModule
  ],
  providers: [...ServicesProviders],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
