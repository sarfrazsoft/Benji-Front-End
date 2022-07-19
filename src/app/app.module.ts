// Core
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IntercomModule } from 'ng-intercom';
import { AppRoutingModule } from './app-routing.module';

//import { EntryComponents } from 'src/app/pages';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServicesProviders } from './index';
import { LayoutModule } from './layout/layout.module';

// App Pages
import { AppComponent } from './app.component';

import { SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { AccountProviders } from './dashboard';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LayoutModule,
    IntercomModule.forRoot({
      appId: 'bddh2r9q', // from your Intercom config
      // will automatically run `update` on router event changes. Default: `false`
      updateOnRouterChange: true,
    }),
    SocialLoginModule
  ],
  providers: [
    ...ServicesProviders,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              // replace this with your google client id
              '1045008906243-hfer3eo1mh91gg3oi6khdg000guqg4lq.apps.googleusercontent.com'
            ),
          },

        ],
      } as SocialAuthServiceConfig,
    },
    { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: { disabled: true } },
    AccountProviders
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
