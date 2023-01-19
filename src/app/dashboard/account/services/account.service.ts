import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { Branding, TeamUser, User } from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';

@Injectable()
export class AccountService {
  constructor(
    private httpClient: HttpClient,
    private contextService: ContextService,
    private utilsService: UtilsService
  ) {}

  saveUser(user): Observable<TeamUser> {
    const saveUserObservable$ = this.httpClient
      .patch(global.apiRoot + '/tenants/users/' + user.id + '/', user)
      .pipe(
        map((res: TeamUser) => {
          this.contextService.user = res;
          return res;
        })
      );
    return saveUserObservable$;
  }

  createBranding(val, type: string): Observable<Branding> {
    const logo: Blob = val.logo;
    const favicon: Blob = val.favicon;
    const formData: FormData = new FormData();
    const url = global.apiRoot + '/tenants/branding/';
    const headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    const params = new HttpParams();

    if (type === 'logo') {
      formData.append('logo', logo);
      const brandingInfoObservable$ = this.httpClient.post(url, formData, { params, headers }).pipe(
        map((res: Branding) => {
          this.contextService.brandingInfo = res;
          return res;
        })
      );
      return brandingInfoObservable$;
    } else if (type === 'favicon') {
      formData.append('favicon', favicon);
      const brandingInfoObservable$ = this.httpClient.post(url, formData, { params, headers }).pipe(
        map((res: Branding) => {
          this.contextService.brandingInfo = res;
          return res;
        })
      );
      return brandingInfoObservable$;
    } else if (type === 'color') {
      formData.append('color', val.color);
      const brandingInfoObservable$ = this.httpClient.post(url, formData, { params, headers }).pipe(
        map((res: Branding) => {
          this.contextService.brandingInfo = res;
          return res;
        })
      );
      return brandingInfoObservable$;
    }
  }

  updateBranding(val, type: string) {
    const logo: File = val.logo;
    const favicon: File = val.favicon;
    const formData: FormData = new FormData();
    const url = global.apiRoot + '/tenants/branding/' + val.id + '/';
    const headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    const params = new HttpParams();

    if (type === 'logo') {
      if (logo !== null && logo.type === 'image/svg+xml') {
        formData.append('logo', logo, logo.name);
        return this.httpClient
          .put(url, formData, { params, headers })
          .map((res: Branding) => {
            this.contextService.brandingInfo = res;
            localStorage.setItem('benji_branding', JSON.stringify(res));
            return res;
          })
          .subscribe(
            (data) => {},
            (error) => console.log(error)
          );
      } else if (logo) {
        this.utilsService
          .resizeImage({
            file: logo,
            maxSize: 152,
          })
          .then((resizedImage: Blob) => {
            formData.append('logo', resizedImage, logo.name);
            return this.httpClient
              .put(url, formData, { params, headers })
              .map((res: Branding) => {
                this.contextService.brandingInfo = res;
                localStorage.setItem('benji_branding', JSON.stringify(res));
                return res;
              })
              .subscribe(
                (data) => {},
                (error) => console.log(error)
              );
          })
          .catch(function (err) {
            console.error(err);
          });
      } else {
        formData.append('logo', '');
        return this.httpClient
          .put(url, formData, { params, headers })
          .map((res: Branding) => {
            this.contextService.brandingInfo = res;
            localStorage.setItem('benji_branding', JSON.stringify(res));
            return res;
          })
          .subscribe(
            (data) => {},
            (error) => console.log(error)
          );
      }
    } else if (type === 'favicon') {
      if (favicon !== null && favicon.type === 'image/svg+xml') {
        formData.append('favicon', favicon, favicon.name);
        return this.httpClient
          .put(url, formData, { params, headers })
          .map((res: Branding) => {
            this.contextService.brandingInfo = res;
            localStorage.setItem('benji_branding', JSON.stringify(res));
            return res;
          })
          .subscribe(
            (data) => {},
            (error) => console.log(error)
          );
      } else if (favicon) {
        this.utilsService
          .resizeImage({
            file: favicon,
            maxSize: 16,
          })
          .then((resizedImage: Blob) => {
            formData.append('favicon', resizedImage, favicon.name);
            return this.httpClient
              .put(url, formData, { params, headers })
              .map((res: Branding) => {
                this.contextService.brandingInfo = res;
                localStorage.setItem('benji_branding', JSON.stringify(res));
                return res;
              })
              .subscribe(
                (data) => {},
                (error) => console.log(error)
              );
          })
          .catch(function (err) {
            console.error(err);
          });
      } else {
        formData.append('favicon', '');
        return this.httpClient
          .put(url, formData, { params, headers })
          .map((res: Branding) => {
            this.contextService.brandingInfo = res;
            localStorage.setItem('benji_branding', JSON.stringify(res));
            return res;
          })
          .subscribe(
            (data) => {},
            (error) => console.log(error)
          );
      }
    } else if (type === 'color') {
      formData.append('color', val.color);
      return this.httpClient
        .put(url, formData, { params, headers })
        .map((res: Branding) => {
          this.contextService.brandingInfo = res;
          localStorage.setItem('benji_branding', JSON.stringify(res));
          return res;
        })
        .subscribe(
          (data) => {},
          (error) => console.log(error)
        );
    }
  }

  // TODO implement types
  resetPassword(oldPassword, newPassword1, newPassword2): Observable<any> {
    const passwords = {
      old_password: oldPassword,
      new_password1: newPassword1,
      new_password2: newPassword2,
    };
    return this.httpClient.post(global.apiRoot + '/rest-auth/password/change/', passwords);
  }
}
