import { Component, OnInit } from '@angular/core';
import { ContextService } from 'src/app/services';

@Component({
  selector: 'benji-participant-toolbar',
  templateUrl: './participant-toolbar.component.html',
  styleUrls: ['./participant-toolbar.component.scss']
})
export class ParticipantToolbarComponent implements OnInit {
  logo;
  constructor(private contextService: ContextService) {}

  ngOnInit() {
    this.contextService.partnerInfo$.subscribe(info => {
      if (info) {
        this.logo = info.logo;
      }
    });
  }
}
