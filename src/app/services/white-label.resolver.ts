import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import * as global from 'src/app/globals';
import { BackendRestService } from './backend/backend-rest.service';
import { PartnerInfo } from './backend/schema/whitelabel_info';
import { ContextService } from './context.service';

@Injectable()
export class WhiteLabelResolver implements Resolve<any> {
  requestSent = false;
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
          .get(global.apiRoot + '/tenants/orgs/' + route.paramMap.get('partner') + '/white_label_info/')
          .subscribe(
            (res: PartnerInfo) => {
              this.contextService.partnerInfo = res;
            },
            (err: HttpErrorResponse) => {
              if (err.status === 404) {
                // Could not find custom whitelabel info
                console.log(err.status);
                this.applyDefaultTheme();
              }
            }
          );
      }
      // When giving a benji demo, users are not authorized and
      // they usually start at one of these pages
      // submit bu
      else if (
        window.location.origin !== 'https://app.mybenji.com' &&
        window.location.origin !== 'http://localhost:4200' &&
        window.location.origin !== 'https://staging.mybenji.com'
      ) {
        if (window.location.origin.includes('muralys')) {
          console.log('get muraly theme');
          this.httpClient.get(global.apiRoot + '/tenants/orgs/' + 'muralys' + '/white_label_info/').subscribe(
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
        } else if (window.location.origin.includes('whetstone')) {
          this.httpClient
            .get(global.apiRoot + '/tenants/orgs/' + 'whetstone' + '/white_label_info/')
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
        } else if (window.location.origin.includes('ccl')) {
          this.httpClient.get(global.apiRoot + '/tenants/orgs/' + 'ccl' + '/white_label_info/').subscribe(
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
        } else if (window.location.origin.includes('rgax')) {
          this.httpClient.get(global.apiRoot + '/tenants/orgs/' + 'rgax' + '/white_label_info/').subscribe(
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
        } else if (window.location.origin.includes('rga')) {
          this.httpClient.get(global.apiRoot + '/tenants/orgs/' + 'rga' + '/white_label_info/').subscribe(
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
        // It doesn't matter which organization you are registered to
        // if the location is this; it'll get location based whitelabeling details
      } else {
        this.restService.get_own_identity().subscribe(
          (res: any) => {
            this.contextService.user = res;
          },
          (error: any) => {
            console.log('user not found');
            this.contextService.partnerInfo = global.DefaultwhiteLabelInfo;
          }
        );
        this.contextService.user$.subscribe((user) => {
          if (user && user.organization && !this.requestSent) {
            const orgId = typeof user.organization === 'object' ? user.organization.id : user.organization;
            this.requestSent = true;
            this.restService.get_white_label_details(orgId).subscribe(
              (data: any) => {
                this.contextService.partnerInfo = data;
              },
              (error) => {
                console.log('users org white label details not found');
                this.contextService.partnerInfo = global.DefaultwhiteLabelInfo;
              }
            );
          } else {
            if (user !== null) {
              // this.applyBenjiTheme();
              this.contextService.partnerInfo = global.DefaultwhiteLabelInfo;
            }
          }
        });
      }
    } catch (err) {
      console.log(err);
      console.log('yolo');
      this.applyDefaultTheme();
    }
  }

  applyBenjiTheme() {
    this.httpClient.get(global.apiRoot + '/tenants/orgs/' + 'benji' + '/white_label_info/').subscribe(
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
    this.contextService.partnerInfo = global.DefaultwhiteLabelInfo as PartnerInfo;
  }
}
// 68195
// 27582
