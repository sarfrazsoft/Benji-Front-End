// Core
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { ServicesProviders } from './index';

import { EntryComponents } from 'src/app/pages';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutModule } from './layout/layout.module';

// App Pages
import { AppComponent } from './app.component';

// Plugins
import { OnsenModule } from 'ngx-onsenui';

import { VgBufferingModule } from 'videogular2/buffering';
import { VgControlsModule } from 'videogular2/controls';
import { VgCoreModule } from 'videogular2/core';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgStreamingModule } from 'videogular2/streaming';

@NgModule({
  declarations: [AppComponent, ...EntryComponents],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OnsenModule,
    SharedModule,
    LayoutModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule
  ],
  providers: [...ServicesProviders],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
