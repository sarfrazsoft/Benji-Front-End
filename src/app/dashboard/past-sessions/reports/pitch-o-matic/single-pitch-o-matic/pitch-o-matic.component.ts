import { Component, Input, OnInit } from '@angular/core';
import { PastSessionsService } from 'src/app/services';
import { ActivityReport } from 'src/app/services/backend/schema';

@Component({
  selector: 'benji-learner-pitch-o-matic',
  templateUrl: './pitch-o-matic.component.html',
  styleUrls: ['./pitch-o-matic.component.scss']
})
export class PitchOMaticComponent implements OnInit {
  @Input() data: ActivityReport;
  constructor(private pastSessionService: PastSessionsService) {}

  ngOnInit() {
    this.pastSessionService.filteredInUsers$.subscribe(updatedUserFilter => {});
  }
}
