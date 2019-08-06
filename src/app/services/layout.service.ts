import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import * as global from 'src/app/globals';
import { ContextService } from './context.service';

@Injectable()
export class LayoutService {
  isFullscreen = false;
  constructor(
    private http: HttpClient,
    private contextService: ContextService
  ) {
    this.getPartnerInfo();
  }

  getPartnerInfo(): any {
    console.log('brr');
    this.contextService.partnerInfo = {
      name: 'Welcome to Holistic Learning!',
      description: 'What\'s Holistic Learning? Learn about your future here.',
      link: 'www.holisticlearning.com',
      logo: './assets/img/logo.png',
      primaryClass: 'holistic-theme'
    };
    // this.contextService.partnerInfo = {
    //   name: 'Welcome to Benji!',
    //   description: 'What\'s Holistic Learning? Learn about your future here.',
    //   partnerLink: 'www.holisticlearning.com',
    //   partnerLogo: './assets/img/Benji_logo_white.png',
    //   primaryClass: 'benji-theme'
    // };
    return this.http.get(global.apiRoot + '/tenants/users/').pipe(
      map(res => {
        console.log('brr');
        // this.contextService.partnerInfo = 'Benji Hud';
        console.log(this.contextService.partnerInfo);
        // return res;
      })
    );
  }

  toggleFullscreen() {
    if (this.isFullscreen) {
      this.closefullscreen();
    } else {
      this.openfullscreen();
    }
  }

  openfullscreen() {
    // Trigger fullscreen
    const docElmWithBrowsersFullScreenFunctions = document.documentElement as HTMLElement & {
      mozRequestFullScreen(): Promise<void>;
      webkitRequestFullscreen(): Promise<void>;
      msRequestFullscreen(): Promise<void>;
    };

    if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
      docElmWithBrowsersFullScreenFunctions.requestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) {
      /* Firefox */
      docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
    } else if (docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
    } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) {
      /* IE/Edge */
      docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
    }
    this.isFullscreen = true;
  }

  closefullscreen() {
    const docWithBrowsersExitFunctions = document as Document & {
      mozCancelFullScreen(): Promise<void>;
      webkitExitFullscreen(): Promise<void>;
      msExitFullscreen(): Promise<void>;
    };

    if (docWithBrowsersExitFunctions.exitFullscreen) {
      docWithBrowsersExitFunctions.exitFullscreen();
    } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) {
      /* Firefox */
      docWithBrowsersExitFunctions.mozCancelFullScreen();
    } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      docWithBrowsersExitFunctions.webkitExitFullscreen();
    } else if (docWithBrowsersExitFunctions.msExitFullscreen) {
      /* IE/Edge */
      docWithBrowsersExitFunctions.msExitFullscreen();
    }
    this.isFullscreen = false;
  }
}
