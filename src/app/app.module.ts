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

import { EntryComponents } from 'src/app/pages';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServicesProviders } from './index';
import { LayoutModule } from './layout/layout.module';

// App Pages
import { AppComponent } from './app.component';

// Ngrx store
// import { EffectsModule } from '@ngrx/effects';
// import { MetaReducer, StoreModule } from '@ngrx/store';
// not used in production
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';
// import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from './../environments/environment';

import { SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { UppyAngularModule } from 'uppy-angular';

// export const metaReducers: MetaReducer<any>[] = !environment.production ? [storeFreeze] : [];

@NgModule({
  declarations: [AppComponent, ...EntryComponents],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    LayoutModule,
    UppyAngularModule,
    // StoreModule.forRoot({}, { metaReducers }),
    // EffectsModule.forRoot([]),
    IntercomModule.forRoot({
      appId: 'bddh2r9q', // from your Intercom config
      // will automatically run `update` on router event changes. Default: `false`
      updateOnRouterChange: true,
    }),
    // !environment.production ? StoreDevtoolsModule.instrument() : [],
    SocialLoginModule,
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
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
