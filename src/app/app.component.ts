import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ContextService } from './services/context.service';
import { LayoutService } from './services/layout.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(
    private layoutService: LayoutService,
    private contextService: ContextService,
    @Inject(DOCUMENT) private _document: HTMLDocument
  ) {
    layoutService.getPartnerInfo();
  }

  ngOnInit() {
    this.contextService.partnerInfo$.subscribe(info => {
      if (info) {
        this._document
          .getElementById('appFavicon')
          .setAttribute('href', info.favicon);

        console.log(info.colors);

        // const cssCode = 'body {background-color: yellow}';

        const cssCode = `
        .bg-primary-color {
          background: ${info.colors.primary};
        }

        .bg-primary-color-dark {
          background: ${info.colors.primaryDark};
        }

        .bg-primary-color-darkest {
          background: ${info.colors.primaryDarkest};
        }

        .bg-primary-color-light {
          background: ${info.colors.primaryLight};
        }

        .bg-primary-color-lighter {
          background: ${info.colors.primaryLighter};
        }

        .mat-ink-bar {
          background: ${info.colors.primaryDarkest} !important;
        }

        .primary-color {
          color: ${info.colors.primary} !important;
        }

        .primary-color-dark {
          color: ${info.colors.primaryDark};
        }

        .primary-color-darkest {
          color: ${info.colors.primaryDarkest};
        }

        .primary-color-light {
          color: ${info.colors.primaryLight};
        }

        .primary-color-lighter {
          color: ${info.colors.primaryLighter};
        }

        .b-standard-button:hover {
          background: ${info.colors.primaryDark};
        }

        .b-standard-button.selected {
          background: ${info.colors.primary};
        }

        .b-standard-button.selected:hover {
          background: ${info.colors.primary};
        }

        .indigo-launch-button:active {
          background: ${info.colors.primaryDarker};
        }

        .indigo-launch-button-sub:active {
          background: ${info.colors.primaryDarker};
        }

        em {
          color: ${info.colors.primaryDarkest};
        }

        benji-ps-build-pitch-activity .b-flat-card__body .pitch-form .pitch-segment textarea {
          border-bottom-color: ${info.colors.primary};
        }

        benji-ps-build-pitch-activity .b-flat-card__body .your-pitch em {
          color: ${info.colors.primary};
          border-bottom-color: ${info.colors.primary};
        }

        .login-container-mob .login-signup-section {
          color: ${info.colors.primaryDarkest};
        }

        .login-container-mob .login-signup-section .section-buttons {
          color: ${info.colors.primaryDarkest};
        }

        .low-response-dialog mat-dialog-container {
          background-color: ${info.colors.primaryDark};
        }

        .low-response-dialog mat-dialog-container.mat-dialog-container .content button {
          background-color: ${info.colors.primaryDark};
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
}
