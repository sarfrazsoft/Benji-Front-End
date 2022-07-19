import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { DefaultwhiteLabelInfo } from './globals';
import { BackendRestService } from './services';
import { Branding, User } from './services/backend/schema';
import { PartnerInfo } from './services/backend/schema/whitelabel_info';
//import { Branding } from './services/backend/schema/whitelabel_info';
import { ContextService } from './services/context.service';
import { LayoutService } from './services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
  ],
})
export class AppComponent implements OnInit {
  apiUrl = 'test';

  constructor(
    private layoutService: LayoutService,
    private contextService: ContextService,
    private restService: BackendRestService,
    private title: Title,
    @Inject(DOCUMENT) private _document: HTMLDocument
  ) {}

  ngOnInit() {

    let color = '#555BEA';
    let favicon;

    this.contextService.brandingInfo$.subscribe((branding: Branding) => {
      if (branding) {
        color = branding.color ? branding.color : '#555BEA';
        favicon = branding.favicon ? branding.favicon : '/assets/img/favicon.ico';
        this._document.getElementById('appFavicon').setAttribute('href', favicon);
      }
        const cssCode = `
        * {
          caret-color: ${color};
        }
        .bg-primary-color {
          background: ${color} !important;
        }

        .primary-color {
          color: ${color} !important;
        }

        .b-standard-button.selected {
          background: ${color};
        }

        .b-standard-button.selected:hover {
          background: ${color};
        }

        .editor-content-button {
          background: ${this.hexToRGB(color, 0.1)};
        }

        benji-ps-build-pitch-activity .b-flat-card__body .pitch-form .pitch-segment span {
          border-bottom-color: ${color};
        }

        benji-ps-build-pitch-activity benji-vote-pitch .b-standard-button em {
          color: ${color};
        }

        benji-ps-build-pitch-activity benji-vote-pitch .b-standard-button.selected em {
          color: #fff;
        }

        mat-toolbar.mat-toolbar {
          border-bottom-color: ${color}
        }

        benji-ps-build-pitch-activity .b-flat-card__body .your-pitch em {
          color: ${color};
          border-bottom-color: ${color};
        }

        .launch-session:hover span {
          border-bottom-color: ${color};
        }

        .overview-button:hover span {
          border-bottom-color: ${color};
        }

        .dashboard-secondary-button {
          border: 2px solid ${color};
        }

        .dashboard-secondary-button.active {
          border-color: ${color};
          color: ${color};
        }

        .dashboard-secondary-button:hover {
          border: 2px solid ${color};
          color: ${color};
          background-color: white;
        }

        .dashboard-secondary-button.delete:hover {
          background-color: ${color};
          color: white !important;
        }

        .selected-primary-border.selected {
          border-color: ${color} !important;
          background-color: ${this.hexToRGB(color, 0.08)} !important;
        }

        .selected-primary-border-only.selected {
          border-color: ${color} !important;
        }

        .selected-primary-border-bg.selected {
          border-color: ${color} !important;
          background-color: ${this.hexToRGB(color, 0.08)} !important;
        }

        .dashboard-table .table-link {
          color: ${color};
        }

        .low-response-dialog mat-dialog-container {
          background-color: ${color};
        }

        .low-response-dialog mat-dialog-container.mat-dialog-container .content button {
          background-color: ${color};
        }

        .mat-progress-spinner circle, .mat-spinner circle {
          stroke: ${color};
        }

        .border-color-primary {
          border-color: ${color} !important;
        }

        .mat-tab-label-active {
          color: ${color} !important;
        }

        .activity-type.selected,
        .activity-type:hover,
        benji-overview-panel .panel .activity-list .activity-container .activity.active {
          border: 2px solid ${color} !important;
        }

        .mat-slide-toggle.mat-checked .mat-slide-toggle-thumb {
          background-color: ${color} !important;
        }

        benji-ms-sharing-tool .mainscreen-activity .content .speaker-cue-container .speaker-list .name-row.current-speaker {
          border-color: ${color};
        }
        .mat-radio-button.mat-accent.mat-radio-checked .mat-radio-outer-circle {
          border-color: ${color};
        }

        .mat-radio-button.mat-accent .mat-radio-inner-circle {
          color: ${color};
          background-color: ${color};
        }

        .mat-radio-button.mat-accent .mat-radio-ripple .mat-ripple-element {
          background-color: ${color};
        }
        .dash-input:focus {
          box-shadow: 0px 0px 0pt 0.2pt ${color};
        }
        .board-settings-navigation input:checked + .slider {
            background-color: ${color};
        }
        .board-settings-navigation .board-status-dropdown ng-dropdown-panel .ng-dropdown-panel-items {
            border: 2px solid ${color};
        }
        .posting-settings input:checked + .slider {
          background-color: ${color};
        }
        .idea-detailed-dialog mat-dialog-container .content-area .idea-creation-controls .settings .bg-primary-color {
          background: ${color};
        }
        .idea-detailed-dialog mat-dialog-container .content-area .idea-creation-controls .settings .bg-primary-color:hover {
          background: ${color};
        }
        .confirmation-dialog .session-duplication .copying-options .mat-checkbox-checked.mat-accent .mat-checkbox-background {
          background-color: ${color};
        }
        .confirmation-dialog .session-duplication .copying-options .mat-checkbox-layout:hover .mat-checkbox-frame {
          border-color: ${color};
        }
        .mat-tab-group.mat-primary .mat-ink-bar, .mat-tab-nav-bar.mat-primary .mat-ink-bar {
          background-color: ${color};
        }
        .uploadcare--dialog__container .uploadcare--button_muted:focus, .uploadcare--dialog__container .uploadcare--button_muted:hover {
          color: ${color};
        }
        .uploadcare--dialog__container .uploadcare--button_primary {
          background: ${color};
        }
        .uploadcare--dialog__container .uploadcare--button_muted:focus, .uploadcare--dialog__container .uploadcare--button_muted:hover {
          color: ${color};
        }
        benji-ms-brainstorming-activity .prose-sm p a, .idea-detailed-dialog mat-dialog-container .content-area .prose-sm p a {
          color: ${color};
        }
        `;

        let additionalCssStyle = document.getElementById('additionalCss');
        if (!additionalCssStyle) {
          additionalCssStyle = document.createElement('style');
          additionalCssStyle.id = 'additionalCss';
          document.head.appendChild(additionalCssStyle);
        }
        additionalCssStyle.innerText = cssCode;
      
    });

    this.contextService.brandingInfo = {
      color: '#555BEA',
      logo: '/assets/img/Benji_logo.svg',
      favicon: '/assets/img/favicon.ico',
    } 
  }

  hexToRGB(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
    } else {
      return 'rgb(' + r + ', ' + g + ', ' + b + ')';
    }
  }

}
