import { Component, OnInit } from '@angular/core';

import { ContextService } from 'src/app/services';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'benji-main-screen-toolbar',
  templateUrl: './main-screen-toolbar.component.html',
  styleUrls: ['./main-screen-toolbar.component.scss'],
})
export class MainScreenToolbarComponent implements OnInit {
  lightLogo = '';
  constructor(
    private layoutService: LayoutService,
    public contextService: ContextService
  ) {}

  ngOnInit() {
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.lightLogo = info.parameters.lightLogo;
      }
    });
  }

  toggleFullscreen() {
    this.layoutService.toggleFullscreen();
  }

  isFullscreen() {
    return this.layoutService.isFullscreen;
  }
}
