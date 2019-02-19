import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from '../../globals';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
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
    return this.http
      .post(global.apiRoot + '/rest-auth/registration/', {
        // TODO get rid of username when backend gets rid of it
        // Is there a character limit on the username?
        username: email.replace('@', 'at').replace('.', 'dot'),
        password1: password,
        password2: password,
        first_name: firstName,
        last_name: lastName,
        email: email
      })
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
        email: email,
        password: password
      })
      .pipe(
        map((res: Response) => {
          this.setSession(res);
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
}
