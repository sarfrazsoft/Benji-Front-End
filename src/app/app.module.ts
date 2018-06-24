// Core
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Services
import { AuthService } from './services/auth.service';
import { TokenInterceptor } from './services/auth.interceptor';
import { BackendService } from './services/backend.service';


// App Pages
import { AppComponent } from './app.component';
import { LandingComponent } from './pages/landing/landing.component';
import { WaitingScreenComponent } from './pages/desktop/waiting-screen/waiting-screen.component';
import { MobileLoginComponent } from './pages/mobile/login/mobile-login.component';
import { MobileJoinComponent } from './pages/mobile/join/mobile-join.component';
import { MobileWaitingScreenComponent } from './pages/mobile/waiting-screen/mobile-waiting-screen.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    WaitingScreenComponent,
    MobileLoginComponent,
    MobileJoinComponent,
    MobileWaitingScreenComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [
    AuthService,
    BackendService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
