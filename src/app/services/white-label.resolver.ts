import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import * as global from 'src/app/globals';
import { ContextService } from './context.service';

// import { AuthService } from 'src/app/services';
// import { AdminService } from './admin.service';

@Injectable()
export class WhiteLabelResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private contextService: ContextService
  ) {}

  async resolve(route: ActivatedRouteSnapshot): Promise<any> {
    try {
      if (route.paramMap.get('partner')) {
        this.httpClient
          .get(
            global.apiRoot +
              '/tenants/orgs/' +
              route.paramMap.get('partner') +
              '/white_label_info'
          )
          .subscribe(
            (res: any) => {
              this.contextService.partnerInfo = res;
              // this.contextService.partnerInfo = {
              //   name: 'Ben',
              //   welcome_text: 'Welcome to Benx',
              //   link: 'https://wwww.benjxx.com',
              //   logo: './assets/img/logo.png',
              //   favicon: './assets/img/favicon.ico',
              //   parameters: {
              //     // primary_lighter: '#80a8ff',
              //     // primary_light: '#4c83fc',
              //     // primary: '#0a4cef',
              //     // primary_dark: '#4c188f',
              //     // primary_darker: '#3a126e',
              //     // primary_darkest: '#00178a'
              //     primary_lighter: '#f8b0ac',
              //     primary_light: '#fa8b85',
              //     primary: '#fd4b42',
              //     primary_dark: '#fd261b',
              //     primary_darker: '#c91006',
              //     primary_darkest: '#830700'
              //   }
              // };
              // return {
              //   name: 'Ben',
              //   welcome_text: 'Welcome to Benx',
              //   link: 'https://wwww.benjxx.com',
              //   logo: './assets/img/logo.png',
              //   favicon: './assets/img/favicon.ico',
              //   parameters: {
              //     // primary_lighter: '#80a8ff',
              //     // primary_light: '#4c83fc',
              //     // primary: '#0a4cef',
              //     // primary_dark: '#4c188f',
              //     // primary_darker: '#3a126e',
              //     // primary_darkest: '#00178a'
              //     primary_lighter: '#f8b0ac',
              //     primary_light: '#fa8b85',
              //     primary: '#fd4b42',
              //     primary_dark: '#fd261b',
              //     primary_darker: '#c91006',
              //     primary_darkest: '#830700'
              //   }
              // };
            },
            (err: HttpErrorResponse) => {
              if (err.status === 404) {
                console.log(err.status);
                this.applyDefaultTheme();
              }
            }
          );
      } else {
        // Apply default theme
        this.applyDefaultTheme();
      }
    } catch (err) {
      console.log(err);
    }
  }

  applyDefaultTheme() {
    this.contextService.partnerInfo = {
      name: 'Benji',
      welcome_text: 'Welcome to Default',
      link: 'https://wwww.benjxx.com',
      logo: './assets/img/logo.png',
      favicon: './assets/img/favicon.ico',
      parameters: {
        primary_lighter: '#80a8ff',
        primary_light: '#4c83fc',
        primary: '#0a4cef',
        primary_dark: '#4c188f',
        primary_darker: '#3a126e',
        primary_darkest: '#00178a'
        // primary_lighter: '#f8b0ac',
        // primary_light: '#fa8b85',
        // primary: '#fd4b42',
        // primary_dark: '#fd261b',
        // primary_darker: '#c91006',
        // primary_darkest: '#830700'
      }
    };
  }
}
