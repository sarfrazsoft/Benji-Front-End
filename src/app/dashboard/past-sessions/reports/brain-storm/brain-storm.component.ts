import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { clone } from 'lodash';
import { ActivityReport } from 'src/app/services/backend/schema';
import { PastSessionsService } from 'src/app/services/past-sessions.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'benji-brain-storm',
  templateUrl: './brain-storm.component.html',
  styleUrls: ['./brain-storm.component.scss'],
})
export class BrainStormComponent implements OnInit, OnChanges {
  @Input() data: ActivityReport;
  brainstorm: ActivityReport['brainstorm'];
  ideas = [];
  fIUs = [];
  // hostname = window.location.protocol + '//' + window.location.hostname;
  hostname = window.location.protocol + '//' + environment.host;
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
    this.getUsersIdeas(this.brainstorm);
  }

  isUserIncluded(userId) {
    return this.fIUs.includes(userId);
  }

  getPersonName(id: number) {
    const user = this.data.participant_set.find((u) => u.participant_code === id);
    return user.display_name;
  }

  getUsersIdeas(act) {
    const arr = [];
    act.brainstormcategory_set.forEach((category) => {
      if (!category.removed) {
        category.brainstormidea_set.forEach((idea) => {
          if (!idea.removed) {
            arr.push(idea);
          }
        });
      }
    });
    this.ideas = arr;
    return arr;
  }
}
