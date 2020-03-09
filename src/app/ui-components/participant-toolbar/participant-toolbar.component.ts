import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ContextService } from 'src/app/services';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

@Component({
  selector: 'benji-participant-toolbar',
  templateUrl: './participant-toolbar.component.html',
  styleUrls: ['./participant-toolbar.component.scss']
})
export class ParticipantToolbarComponent implements OnInit {
  logo;
  constructor(private contextService: ContextService, private router: Router) {}

  ngOnInit() {
    this.contextService.partnerInfo$.subscribe((info: PartnerInfo) => {
      if (info) {
        this.logo = info.parameters.lightLogo;
      }
    });
  }

  disconnect() {
    this.router.navigate(['/participant/join']);
  }
}
