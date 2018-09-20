import {Component, OnInit, ViewEncapsulation, Input, OnDestroy, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {BackendService} from '../../../../../services/backend.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {interval} from 'rxjs/internal/observable/interval';

import { BaseActivityComponent } from '../../../../shared/base-activity.component';

@Component({
  selector: 'app-mainscreen-activity-thinkpairshare',
  templateUrl: './main-screen-tps-activity.component.html',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class DesktopTPSActivityComponent extends BaseActivityComponent implements OnInit, OnDestroy, OnChanges {
  @Input() footer;
  @Input() joinedUsers;
  @Output() activityComplete = new EventEmitter<boolean>();

  thinkCountdown = 0;
  shareCountdown = 0;

  thinkProgressBarInterval;
  shareProgressBarInterval;

  shareIndex = -1;
  mode = 'partnering';

  constructor() { super(); }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);

    if (this.mode === 'partnering' && !this.allPartnersFound()) {
      this.footer.completed = this.countPartners();
      this.footer.total = this.joinedUsers.length;
      this.footer.statusText = 'People have found pairs';
    } else if (this.mode === 'partnering' && this.allPartnersFound()) {
      this.mode = 'thinking';
      this.thinkProgressBarInterval = interval(100).subscribe(() => ++this.thinkCountdown);
      setTimeout(() => { if (this.mode === 'thinking') { this.mode = 'sharing'; }},
        this.activityDetails.thinkpairshareactivity.think_timer * 1000);
    }

    if (this.mode === 'thinking' && this.stillThinking() > 0) {
      this.footer.completed = this.countPresenters();
      this.footer.total = this.joinedUsers.length;
      this.footer.statusText = 'People ready to present';
    } else if (this.mode === 'thinking' && this.stillThinking() === 0) {
      this.mode = 'sharing';
      this.footer.showProgress = false;
    }

    if (this.mode === 'sharing' && (this.shareIndex === -1 || this.currentPresentersDone()) ) {
      if (this.shareIndex === this.activityRun.activity_groups.length - 1) {
        this.activityComplete.emit(true);
        this.mode = 'complete';
      } else {
        ++this.shareIndex;
        this.shareCountdown = 0;
        if (this.shareProgressBarInterval) {
          this.shareProgressBarInterval.unsubscribe();
        }
        this.shareProgressBarInterval = interval(100).subscribe(() => ++this.shareCountdown);
      }
    }
  }

  ngOnInit() {
    this.footer.showProgress = true;
  }

  ngOnDestroy() {
    this.thinkProgressBarInterval.unsubscribe();
    this.shareProgressBarInterval.unsubscribe();
    this.footer.showProgress = false;
  }

  countPartners() {
    return this.activityRun.activityrunuser_set.filter(
      x => x.activityrunuserparams_set.find(
        y => y.param_name === 'partner_found' && y.param_value === '1') !== undefined).length;
  }

  countRemain() {
    return this.joinedUsers.length - this.countPartners();
  }

  countPresenters() {
    return this.activityRun.activityrunuser_set.filter(
      x => x.activityrunuserparams_set.find(
        y => y.param_name === 'thinking_done' && y.param_value === '1') !== undefined).length;
  }

  stillThinking() {
    return this.joinedUsers.length - this.countPresenters();
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

  currentPresenters() {
    return this.activityRun.activity_groups[this.shareIndex];
  }

  nextPresenters() {
    if (this.shareIndex <= this.activityRun.activity_groups.length - 2) {
      return this.activityRun.activity_groups[this.shareIndex + 1];
    } else {
      return null;
    }
  }

  currentPresenterNames() {
    const fnames = this.currentPresenters().map(x => x.first_name);
    return fnames[0] + ' and ' + fnames[1];
  }

  nextPresenterNames() {
    if (this.nextPresenters()) {
      const fnames = this.nextPresenters().map(x => x.first_name);
      return fnames[0] + ' and ' + fnames[1];
    } else {
      return '';
    }
  }

  currentPresentersDone() {
    if (this.shareIndex === -1) {
      return true;
    } else {
      const target_ids = this.currentPresenters().map(x => x.id);
      const target_user_params = this.activityRun.activityrunuser_set.filter(x => target_ids.includes(x.user));
      return target_user_params.filter(
        x => x.activityrunuserparams_set.filter(y => y.param_name === 'presentation_done' && y.param_value === '1').length > 0).length > 0;
    }

  }

  getTimer(cd, max_timer) {
    const seconds_remain = max_timer - cd / 10;
    const min = Math.floor( seconds_remain / 60);
    const sec = seconds_remain - 60 * min;
    return {'min': min, 'sec': sec};
  }
}
