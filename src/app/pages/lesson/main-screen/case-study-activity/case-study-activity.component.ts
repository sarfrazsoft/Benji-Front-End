import { Component, OnChanges, OnInit } from '@angular/core';
import { CaseStudyActivity, CaseStudyParticipantSet, Group } from 'src/app/services/backend/schema';
import { BaseActivityComponent } from '../../shared/base-activity.component';

@Component({
  selector: 'benji-ms-case-study-activity',
  templateUrl: './case-study-activity.component.html',
  styleUrls: ['./case-study-activity.component.scss'],
})
export class MainScreenCaseStudyActivityComponent extends BaseActivityComponent implements OnInit, OnChanges {
  groups: Array<Group>;
  act: CaseStudyActivity;
  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges() {
    this.act = this.activityState.casestudyactivity;
    this.groups = this.act.groups;
  }

  getGroupText(userGroup: Group): string {
    return userGroup.participantgroupstatus_set
      .map((u) => this.getParticipantName(u.participant.participant_code))
      .join(' + ');
  }

  isGroupDone(userGroup: Group) {
    const userId = userGroup.participantgroupstatus_set[0].participant.participant_code;
    const myNoteTaker = this.getMyNoteTaker(userId);
    return myNoteTaker.is_done;
  }

  getMyNoteTaker(userId: number): CaseStudyParticipantSet {
    const myGroupFellows = this.getPeopleFromMyGroup(userId);
    for (let i = 0; i < this.act.casestudyparticipant_set.length; i++) {
      const casestudyuser = this.act.casestudyparticipant_set[i];
      if (
        myGroupFellows.includes(casestudyuser.participant.participant_code) &&
        casestudyuser.role === 'Note Taker'
      ) {
        return casestudyuser;
      }
    }
  }

  getPeopleFromMyGroup(userId): Array<number> {
    for (let i = 0; i < this.act.groups.length; i++) {
      const group = this.act.groups[i];
      for (let j = 0; j < group.participantgroupstatus_set.length; j++) {
        const participantCode = group.participantgroupstatus_set[j].participant.participant_code;
        if (participantCode === userId) {
          return group.participantgroupstatus_set.map((obj) => {
            return obj.participant.participant_code;
          });
        }
      }
    }
  }
}
