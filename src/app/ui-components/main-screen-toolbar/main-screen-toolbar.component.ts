import { Component, OnInit } from '@angular/core';

import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'app-main-screen-toolbar',
  templateUrl: './main-screen-toolbar.component.html',
  styleUrls: ['./main-screen-toolbar.component.scss']
})
export class MainScreenToolbarComponent {
  constructor(private layoutService: LayoutService) {}

  toggleFullscreen() {
    this.layoutService.toggleFullscreen();
  }

  isFullscreen() {
    return this.layoutService.isFullscreen;
  }
}
