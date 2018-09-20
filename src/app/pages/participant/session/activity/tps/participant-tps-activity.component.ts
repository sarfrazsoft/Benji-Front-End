import {Component, OnInit, ViewEncapsulation, OnDestroy, Input} from '@angular/core';
import {BackendService} from '../../../../../services/backend.service';
import { BaseActivityComponent } from '../../../../shared/base-activity.component';

@Component({
  selector: 'app-participant-activity-thinkpairshare',
  templateUrl: './participant-tps-activity.component.html' ,
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class MobileTPSActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy {
  @Input() joinedUsers;
  partner = '';
  myId = -1;
  partnerFound = false;
  thinkingDone = false;

  constructor(private backend: BackendService) { super(); }

  ngOnInit() {
    this.setPartner(this.clientIdentity);
  }

  ngOnDestroy() {
  }


  indicateReady() {
    this.backend.set_activity_user_parameter(this.activityRun.id, 'partner_found', '1').subscribe(
      resp => this.partnerFound = true,
      err => console.log(err)
    );
  }

  indicateThinkingDone() {
    this.backend.set_activity_user_parameter(this.activityRun.id, 'thinking_done', '1').subscribe(
      resp => this.thinkingDone = true,
      err => console.log(err)
    );
  }

  indicateSharingDone() {
    this.backend.set_activity_user_parameter(this.activityRun.id, 'presentation_done', '1').subscribe(
      resp => this.thinkingDone = true,
      err => console.log(err)
    );
  }

  setPartner(resp) {
    this.myId = resp.id;
    for (const elem of this.activityRun.activity_groups) {
      const user1 = elem[0];
      const user2 = elem[1];
      if(!user1 || !user2) {
        return;
      }
      if (user1.id === resp.id) {
        this.partner = user2.first_name;
        return;
      } else if (user2.id === resp.id) {
        this.partner = user1.first_name;
        return;
      }
    }
  }

  allPartnersFound() {
    try {
      const target_users = this.joinedUsers.map(x => x.id);
      const allusersjoined = target_users.every(
        x => this.activityRun.activityrunuser_set.find(y => y.user === x) !== undefined);
      const alljoineduserspartnered = this.activityRun.activityrunuser_set.every(
        x => x.activityrunuserparams_set.find(
          y => y.param_name === 'partner_found' && y.param_value === '1'));

      return allusersjoined && alljoineduserspartnered;
    } catch (err) {
      return false;
    }
  }

  myTurnToPresent() {
    const allgroupsthinkingdone = this.activityRun.activityrunuser_set.every(
      x => x.activityrunuserparams_set.find(
        y => y.param_name === 'thinking_done' && y.param_value === '1'));

    const presentationgroups =  this.activityRun.activity_groups.map(x => x.map(y => y.id));

    for (const group of presentationgroups) {
      const groupusers = this.activityRun.activityrunuser_set.filter(x => group.includes(x.user));
      const grouppresented = groupusers.find(x => x.activityrunuserparams_set.filter(
        y => y.param_name === 'presentation_done' && y.param_value === '1').length > 0);

      if (!grouppresented) {
        return this.allPartnersFound() && allgroupsthinkingdone && group.includes(this.myId);
      }
    }

    return false;
  }

}
