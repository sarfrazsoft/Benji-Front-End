import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { DefaultwhiteLabelInfo } from './globals';
import { BackendRestService } from './services';
import { PartnerInfo } from './services/backend/schema/whitelabel_info';
import { ContextService } from './services/context.service';
import { LayoutService } from './services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private layoutService: LayoutService,
    private contextService: ContextService,
    private restService: BackendRestService,
    private title: Title,
    @Inject(DOCUMENT) private _document: HTMLDocument
  ) {}

  ngOnInit() {
    // this.checkWhitelabeling();

    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.title.setTitle(info.parameters.tabTitle);
        this._document.getElementById('appFavicon').setAttribute('href', info.favicon);

        const cssCode = `
        * {
          caret-color: ${info.parameters.primary};
        }
        .bg-primary-color {
          background: ${info.parameters.primary};
        }

        .bg-primary-color-dark {
          background: ${info.parameters.primary_dark};
        }

        .bg-primary-color-darkest {
          background: ${info.parameters.primary_darkest};
        }

        .bg-primary-color-light {
          background: ${info.parameters.primary_light};
        }

        .bg-primary-color-lighter {
          background: ${info.parameters.primary_lighter};
        }

        .primary-color {
          color: ${info.parameters.primary} !important;
        }

        .primary-color-dark {
          color: ${info.parameters.primary_dark};
        }

        .primary-color-darkest {
          color: ${info.parameters.primary_darkest};
        }

        .primary-color-light {
          color: ${info.parameters.primary_light};
        }

        .primary-colorjoin-session-header-lighter {
          color: ${info.parameters.primary_lighter};
        }

        .b-standard-button.selected {
          background: ${info.parameters.primary};
        }

        .b-standard-button.selected:hover {
          background: ${info.parameters.primary};
        }

        .indigo-launch-button:active {
          background: ${info.parameters.primary_darker};
        }

        .indigo-launch-button-sub:active {
          background: ${info.parameters.primary_darker};
        }

        em {
          color: ${info.parameters.primary_darkest};
        }

        benji-ps-build-pitch-activity .b-flat-card__body .pitch-form .pitch-segment textarea {
          border-bottom-color: ${info.parameters.primary};
        }

        mat-toolbar.mat-toolbar {
          border-bottom-color: ${info.parameters.primary}
        }

        benji-ps-build-pitch-activity .b-flat-card__body .your-pitch em {
          color: ${info.parameters.primary};
          border-bottom-color: ${info.parameters.primary};
        }

        .launch-session:hover span {
          border-bottom-color: ${info.parameters.primary};
        }

        .overview-button:hover span {
          border-bottom-color: ${info.parameters.primary};
        }

        .item.active .item-name {
          color: ${info.parameters.primary} !important;

        }

        .dashboard-secondary-button {
          border: 2px solid ${info.parameters.primary};
        }

        .dashboard-secondary-button.active {
          border-color: ${info.parameters.primary};
          color: ${info.parameters.primary};
        }

        .dashboard-secondary-button:hover {
          border: 2px solid ${info.parameters.primary};
          color: ${info.parameters.primary};
          background-color: white;
        }

        .dashboard-secondary-button.delete:hover {
          background-color: ${info.parameters.primary};
          color: white !important;
        }

        .report-cards .card-header {
          color: ${info.parameters.primary_darkest};
          color: black;
        }

        .dashboard-table .table-link {
          color: ${info.parameters.primary};
        }

        .login-container-mob .login-signup-section {
          color: ${info.parameters.primary_darkest};
        }

        .login-container-mob .login-signup-section .section-buttons {
          color: ${info.parameters.primary_darkest};
        }

        .low-response-dialog mat-dialog-container {
          background-color: ${info.parameters.primary_dark};
        }

        .low-response-dialog mat-dialog-container.mat-dialog-container .content button {
          background-color: ${info.parameters.primary_dark};
        }

        .mat-progress-spinner circle, .mat-spinner circle {
          stroke: ${info.parameters.primary};
        }

        .border-color-primary {
          border-color: ${info.parameters.primary} !important;
        }

        .mat-tab-label-active {
          color: ${info.parameters.primary} !important;
        }

        .activity-type.selected,
        .activity-type:hover,
        benji-overview-panel .panel .activity-list .activity-container .activity.active {
          border: 2px solid ${info.parameters.primary} !important;
        }

        .mat-slide-toggle.mat-checked .mat-slide-toggle-thumb {
          background-color: ${info.parameters.primary} !important;
        }
        `;

        let additionalCssStyle = document.getElementById('additionalCss');
        if (!additionalCssStyle) {
          additionalCssStyle = document.createElement('style');
          additionalCssStyle.id = 'additionalCss';
          document.head.appendChild(additionalCssStyle);
        }
        additionalCssStyle.innerText = cssCode;
      }
    });
  }

  checkWhitelabeling() {
    // let whitelabelDetailsAvailable = false;
    // Is there a user present?
    // this.restService.get_own_identity().subscribe(
    //   (res: any) => {
    //     this.contextService.user = res;
    //   },
    //   (error: any) => {
    //     // console.log('no user available');
    //     // this.contextService.partnerInfo = DefaultwhiteLabelInfo;
    //   }
    // );
    // this.contextService.user$.subscribe(user => {
    //   if (user && user.organization) {
    // const orgId =
    //   typeof user.organization === 'object'
    //     ? user.organization.id
    //     : user.organization;
    // this.restService.get_white_label_details(orgId).subscribe(
    //   (data: any) => {
    //     // whitelabelDetailsAvailable = true;
    //     this.contextService.partnerInfo = data;
    //   },
    //   error => {
    //     this.contextService.partnerInfo = DefaultwhiteLabelInfo;
    //   }
    // );
    // } else {
    // it's a guest user
    // if (user !== null) {
    // console.log('continue as guest user');
    // whitelabelDetailsAvailable = false;
    // this.contextService.partnerInfo = DefaultwhiteLabelInfo;
    // }
    // }
    // });
  }
}
