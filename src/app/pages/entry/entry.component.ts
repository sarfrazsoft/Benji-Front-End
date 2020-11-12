import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AuthService } from 'src/app/services';

@Component({
  selector: 'benji-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
})
export class EntryComponent implements OnInit {
  isMobile = false;

  constructor(private authService: AuthService, private deviceService: DeviceDetectorService) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.authService.signOut();
    }
    this.isMobile = this.deviceService.isMobile();
  }
}
