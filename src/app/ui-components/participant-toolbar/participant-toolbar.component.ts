import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContextService } from 'src/app/services';
import { Timer } from 'src/app/services/backend/schema';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

@Component({
  selector: 'benji-participant-toolbar',
  templateUrl: './participant-toolbar.component.html',
  styleUrls: ['./participant-toolbar.component.scss'],
})
export class ParticipantToolbarComponent implements OnInit {
  logo;
  timer: Timer;
  constructor(private contextService: ContextService, private router: Router) {}

  ngOnInit() {
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.logo = info.parameters.lightLogo;
      }
    });

    this.contextService.activityTimer$.subscribe((timer: Timer) => {
      if (timer) {
        this.timer = timer;
      }
    });
  }

  disconnect() {
    this.router.navigate(['/participant/join']);
  }
}
