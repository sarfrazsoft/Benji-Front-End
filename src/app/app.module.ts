// Core
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { ServicesProviders } from './index';

import { ActivateAccountComponent, EntryComponents } from 'src/app/pages';
import { SharedModule } from 'src/app/shared/shared.module';
import { LayoutModule } from './layout/layout.module';

// App Pages
import { AppComponent } from './app.component';

// Plugins
import { OnsenModule } from 'ngx-onsenui';
import { BTwemoji2Component } from 'src/app/pages/activate-account/b-twemoji2/b-twemoji.component';

@NgModule({
  declarations: [
    AppComponent,
    ...EntryComponents,
    BTwemoji2Component,
    ActivateAccountComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    OnsenModule,
    SharedModule,
    LayoutModule
  ],
  providers: [...ServicesProviders],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
