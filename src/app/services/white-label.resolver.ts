import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import * as global from 'src/app/globals';
import { BackendRestService } from './backend/backend-rest.service';
import { PartnerInfo } from './backend/schema/whitelabel_info';
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
              '/white_label_info/'
          )
          .subscribe(
            (res: PartnerInfo) => {
              this.contextService.partnerInfo = res;
            },
            (err: HttpErrorResponse) => {
              if (err.status === 404) {
                // Could not find custom whitelabel info
                console.log(err.status);
                // this.applyBenjiTheme();
                this.applyDefaultTheme();
              }
            }
          );
      }
      // When giving a benji demo, users are not authorized and
      // they usually start at one of these pages
      // submit bu
      // else if (
      //   route.url[0] &&
      //   (route.url[0].path === 'login' ||
      //     route.url[0].path === 'landing' ||
      //     route.url[0].path === 'participant')
      // ) {
      //   console.log('applying default theme at login page');
      //   this.restService.get_own_identity().subscribe(
      //     (res: any) => {
      //       this.contextService.user = res;
      //     },
      //     (error: any) => {
      //       this.contextService.partnerInfo = global.DefaultwhiteLabelInfo;
      //     }
      //   );
      //   // this.applyDefaultTheme();
      // }
      else {
        this.restService.get_own_identity().subscribe(
          (res: any) => {
            this.contextService.user = res;
          },
          (error: any) => {
            console.log('user not found');
            this.contextService.partnerInfo = global.DefaultwhiteLabelInfo;
          }
        );
        this.contextService.user$.subscribe(user => {
          if (user && user.organization) {
            const orgId =
              typeof user.organization === 'object'
                ? user.organization.id
                : user.organization;

            this.restService.get_white_label_details(orgId).subscribe(
              (data: any) => {
                this.contextService.partnerInfo = data;
              },
              error => {
                console.log('user not found');
                this.contextService.partnerInfo = global.DefaultwhiteLabelInfo;
              }
            );
          } else {
            if (user !== null) {
              console.log('user not found');
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
    this.contextService.partnerInfo = global.DefaultwhiteLabelInfo as PartnerInfo;
  }
}
