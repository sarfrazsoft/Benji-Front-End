import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as global from '../../globals';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {
    // Set user roles. They should  be set on login based on info from backend.
    // admin
    // mainscreenUser
    // participant
    localStorage.setItem('userRole', 'admin');
  }

  login(username: string, password: string) {
    return this.http
      .post(global.apiRoot + '/jwt-auth/', {
        username: username,
        password: password
      })
      .pipe(tap(result => this.setSession(result)));
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
