import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { Intercom } from 'ng-intercom';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ContextService } from 'src/app/services/context.service';
import * as global from '../../globals';
import { TeamUser, UserInvitation } from '../backend/schema';
import { LayoutService } from '../layout.service';

export interface LoginResponse {
  user: any;
  token: string;
}

@Injectable()
export class AuthService {
  userInvitation: UserInvitation;
  invitationToken: number;
  redirectURL = '';
  constructor(
    public intercom: Intercom,
    private http: HttpClient,
    private router: Router,
    private contextService: ContextService,
    private layoutService: LayoutService
  ) {
    // Set user roles. They should  be set on login based on info from backend.
    // admin
    // mainscreenUser
    // participant
    // localStorage.setItem('userRole', 'mainscreenUser');
  }

  register(email: string, password: string, firstName: string, lastName: string) {
    this.logout();
    let obj;
    if (this.userInvitation) {
      obj = {
        // TODO get rid of username when backend gets rid of it
        // Is there a character limit on the username?
        username: this.convertEmailToUserName(email),
        password1: password,
        password2: password,
        first_name: firstName,
        last_name: lastName ? lastName : ' ',
        email: email,
        invitation: this.userInvitation ? this.userInvitation.id : null,
        invitation_token: this.invitationToken ? this.invitationToken : null,
      };
    } else {
      obj = {
        // TODO get rid of username when backend gets rid of it
        // Is there a character limit on the username?
        username: this.convertEmailToUserName(email),
        password1: password,
        password2: password,
        first_name: firstName,
        last_name: lastName ? lastName : ' ',
        email: email,
      };
    }
    return this.http.post(global.apiRoot + '/rest-auth/registration/', obj).pipe(
      map((res: Response) => res),
      catchError((err) => of(err.error))
    );
  }

  checkConfirmationCode(code: string) {
    return this.http
      .post(global.apiRoot + '/rest-auth/registration/verify-email/', {
        key: code,
      })
      .pipe(
        map((res: Response) => res),
        catchError((err) => of(err.error))
      );
  }

  signIn(email: string, password: string) {
    this.logout();
    return this.http
      .post(global.apiRoot + '/rest-auth/login/', {
        username: this.convertEmailToUserName(email),
        // username: email.split('@')[0],
        email: email,
        password: password,
      })
      .pipe(
        map((res: LoginResponse) => {
          this.setFacilitatorSession(res);
        }),
        catchError((err) => of(err.error))
      );
  }

  convertEmailToUserName(email: string) {
    return email.replace(/@/g, 'at').replace(/\./g, 'dot');
  }

  signOut() {
    this.logout();
    this.router.navigate(['/login']);
  }

  setFacilitatorSession(res) {
    localStorage.setItem('token', res.token);
    this.contextService.user = res.user;
    this.layoutService.hideSidebar = false;
    localStorage.setItem('benji_user', JSON.stringify(res.user));
  }

  createParticipant(username: string, enteredRoomCode: number) {
    return this.http
      .post(global.apiRoot + '/course_details/participant/', {
        lessonrun_code: enteredRoomCode,
        display_name: username,
      })
      .pipe(
        map((res: LoginResponse) => {
          this.setParticipantSession(res);
          return res;
        }),
        catchError((err) => of(err.error))
      );
  }

  setParticipantSession(res) {
    localStorage.setItem('participant', JSON.stringify(res));
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('single_user_participant');
    this.closeIntercom();
  }

  getToken() {
    return localStorage.getItem('token');
  }

  private decodeToken(token) {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  public isLoggedIn() {
    const token = this.getToken();
    if (token) {
      return this.decodeToken(token).exp > Math.round(new Date().getTime() / 1000);
    } else {
      return false;
    }
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getUserRole(): string | Observable<string> {
    return localStorage.getItem('userRole');
  }

  getInivitationDetails(inviteId: string, token: string) {
    const request = global.apiRoot + '/tenants/org_invites/view_invite/' + inviteId + '/' + token + '/';
    return this.http.get<UserInvitation>(request);
  }

  loginUser() {
    if (this.isLoggedIn()) {
    } else {
      // navigate to login screen with the current url as the parameter
      this.redirectURL = window.location.href;
      this.router.navigate(['/login']);
    }
  }

  startIntercom() {
    const user: TeamUser = JSON.parse(localStorage.getItem('benji_user'));
    this.intercom.boot({
      name: user.first_name + ' ' + user.last_name,
      email: user.email,
      widget: {
        activator: '#intercom',
      },
    });
  }

  closeIntercom() {
    this.intercom.shutdown();
  }

  // Password change
  resetPassword(email: string) {
    return this.http
      .post(global.apiRoot + '/rest-auth/password/reset/', {
        email: email,
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((err) => of(err.error))
      );
  }

  resetPasswordConfirm(password1: string, password2: string, uid: string, token: string) {
    return this.http
      .post(global.apiRoot + '/rest-auth/password/reset/confirm/', {
        new_password1: password1,
        new_password2: password2,
        uid: uid,
        token: token,
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((err) => of(err.error))
      );
  }

  validateGoogleToken(token) {
    return this.http
      .post(global.apiRoot + '/social-auth/google/', {
        auth_token: token,
      })
      .pipe(
        map((res) => {
          return res;
        }),
        catchError((err) => of(err.error))
      );
  }
}
