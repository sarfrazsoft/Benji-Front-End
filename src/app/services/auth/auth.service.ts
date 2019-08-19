import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ContextService } from 'src/app/services/context.service';
import * as global from '../../globals';
import { UserInvitation } from '../backend/schema';

export interface LoginResponse {
  user: any;
  token: string;
}

@Injectable()
export class AuthService {
  userInvitation: UserInvitation;
  invitationToken: number;
  constructor(
    private http: HttpClient,
    private router: Router,
    private contextService: ContextService
  ) {
    // Set user roles. They should  be set on login based on info from backend.
    // admin
    // mainscreenUser
    // participant
    // localStorage.setItem('userRole', 'mainscreenUser');
  }

  login(username: string, password: string) {
    return this.http
      .post(global.apiRoot + '/jwt-auth/', {
        username: username,
        password: password
      })
      .pipe(tap(result => this.setSession(result)));
  }

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    this.logout();
    let obj;
    if (this.userInvitation) {
      obj = {
        // TODO get rid of username when backend gets rid of it
        // Is there a character limit on the username?
        username: email.replace('@', 'at').replace('.', 'dot'),
        password1: password,
        password2: password,
        first_name: firstName,
        last_name: lastName,
        email: email,
        invitation: this.userInvitation ? this.userInvitation.id : null,
        invitation_token: this.invitationToken ? this.invitationToken : null
      };
    } else {
      obj = {
        // TODO get rid of username when backend gets rid of it
        // Is there a character limit on the username?
        username: email.replace('@', 'at').replace('.', 'dot'),
        password1: password,
        password2: password,
        first_name: firstName,
        last_name: lastName,
        email: email
      };
    }
    return this.http
      .post(global.apiRoot + '/rest-auth/registration/', obj)
      .pipe(
        map((res: Response) => res),
        catchError(err => of(err.error))
      );
  }

  checkConfirmationCode(code: string) {
    return this.http
      .post(global.apiRoot + '/rest-auth/registration/verify-email/', {
        key: code
      })
      .pipe(
        map((res: Response) => res),
        catchError(err => of(err.error))
      );
  }

  signIn(email: string, password: string) {
    this.logout();
    return this.http
      .post(global.apiRoot + '/rest-auth/login/', {
        username: email.replace('@', 'at').replace('.', 'dot'),
        // username: email.split('@')[0],
        email: email,
        password: password
      })
      .pipe(
        map((res: LoginResponse) => {
          this.setSession(res);
          this.contextService.user = res.user;
          localStorage.setItem('benji_user', JSON.stringify(res.user));
        }),
        catchError(err => of(err.error))
      );
  }

  signOut() {
    this.logout();
    this.router.navigate(['/login']);
  }

  private setSession(authResult) {
    localStorage.setItem('token', authResult.token);
  }

  logout() {
    localStorage.removeItem('token');
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
      return (
        this.decodeToken(token).exp > Math.round(new Date().getTime() / 1000)
      );
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
    const request =
      global.apiRoot +
      '/tenants/org_invites/view_invite/' +
      inviteId +
      '/' +
      token +
      '/';
    return this.http.get<UserInvitation>(request);
  }
}
