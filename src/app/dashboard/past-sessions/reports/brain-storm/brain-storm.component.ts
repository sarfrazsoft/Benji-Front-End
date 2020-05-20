import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { clone } from 'lodash';
import { ActivityReport } from 'src/app/services/backend/schema';
import { PastSessionsService } from 'src/app/services/past-sessions.service';

@Component({
  selector: 'benji-brain-storm',
  templateUrl: './brain-storm.component.html',
  styleUrls: ['./brain-storm.component.scss'],
})
export class BrainStormComponent implements OnInit, OnChanges {
  @Input() data: ActivityReport;
  brainstorm: ActivityReport['brainstorm'];
  fIUs = [];
  constructor(private pastSessionService: PastSessionsService) {}

  ngOnInit() {
    this.update();
    this.pastSessionService.filteredInUsers$.subscribe((updatedUserFilter) => {
      this.update();
    });
  }
  ngOnChanges() {
    this.update();
  }

  update() {
    this.fIUs = this.pastSessionService.filteredInUsers;
    this.brainstorm = clone(this.data.brainstorm);

    this.brainstorm.idea_rankings = this.brainstorm.idea_rankings.filter((i) =>
      this.fIUs.includes(i.submitted_by_user.id)
    );
  }
}
