import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import * as global from 'src/app/globals';
import { BackendRestService } from './backend/backend-rest.service';
import { ContextService } from './context.service';

@Injectable()
export class WhiteLabelResolver implements Resolve<any> {
  constructor(
    private router: Router,
    private httpClient: HttpClient,
    private contextService: ContextService,
    private restService: BackendRestService
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
            },
            (err: HttpErrorResponse) => {
              if (err.status === 404) {
                console.log(err.status);
                this.applyBenjiTheme();
              }
            }
          );
      }
      // When giving a benji demo, users are not authorized and
      // they usually start at one of these pages
      else if (
        route.url[0] &&
        (route.url[0].path === 'login' ||
          route.url[0].path === 'landing' ||
          route.url[0].path === 'participant') &&
        !this.contextService.user
      ) {
        //
        console.log(route.url[0]);
        this.applyBenjiTheme();
      } else {
        this.contextService.user$.subscribe(user => {
          if (user) {
            const orgId =
              typeof user.organization === 'object'
                ? user.organization.id
                : user.organization;
            this.restService.get_white_label_details(orgId);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  applyBenjiTheme() {
    this.httpClient
      .get(global.apiRoot + '/tenants/orgs/' + 'benji' + '/white_label_info/')
      .subscribe(
        (res: any) => {
          this.contextService.partnerInfo = res;
        },
        (err: HttpErrorResponse) => {
          if (err.status === 404) {
            console.log(err.status);
            this.applyDefaultTheme();
          }
        }
      );
  }

  applyDefaultTheme() {
    console.log('Default theme applied');
    this.contextService.partnerInfo = {
      name: 'Benji',
      welcome_text: 'Welcome to Benji',
      link: 'https://wwww.benji.com',
      logo: '',
      favicon: './assets/img/favicon.ico',
      parameters: {
        lightLogo: './assets/img/Benji_logo_white.png',
        darkLogo: './assets/img/logo.png',
        welcomeDescription:
          'What\'s Benji? Learn more about the future of learning',
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
