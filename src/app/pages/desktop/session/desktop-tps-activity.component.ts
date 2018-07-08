import {Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy} from '@angular/core';
import {BackendService} from '../../../services/backend.service';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {interval} from 'rxjs/internal/observable/interval';


@Component({
  selector: 'app-desktop-activity-title',
  template: '<div class="centred-aligned-screen-body-div" *ngIf="mode === \'partnering\'">\n' +
  '    <div class="content-slide-wrap"><img src="assets/img/Partner.png" height="115">\n' +
  '      <h1 class="content-header">Find your partner</h1>\n' +
  '      <div class="grey-text"><strong>Press "Ready" when you’re ready for the discussion question.</strong><br></div>\n' +
  '      <div class="participants-wrap">\n' +
  '        <div class="participants-entered">\n' +
  '          <h1 class="welcome-screen-text dark-blue">Partnered: {{ countPartners() }}<br></h1>\n' +
  '          <h1 class="welcome-screen-text dark-blue">Remain: {{ countRemain() }}<br></h1>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '    <div class="timer-bar">\n' +
  '      <mat-progress-bar mode="indeterminate"></mat-progress-bar>' +
  '    </div>\n' +
  '  </div>\n' +
  '<div class="vertical-stack-body-div" *ngIf="mode === \'thinking\'">\n' +
  '    <div class="screen-header-wrap">\n' +
  '      <div class="left-header-wrap">\n' +
  '        <h1 class="screen-header">Pair &amp; Share</h1>\n' +
  '      </div>\n' +
  '      <div class="right-header-wrap">\n' +
  '        <div class="screen-text">Discuss the prompt with your partner for {{ activityDetails.current_activity.thinkpairshareactivity.think_timer / 60 }} minutes, then get ready to share your ideas with the rest of the group.<br></div>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '    <div class="body-div-wrap">\n' +
  '      <h1 class="subheader">Discussion question</h1>\n' +
  '      <div class="body-content-no-border">\n' +
  '        <div class="left-body-wrap">\n' +
  '          <h1 class="dark-blue-header">{{ activityDetails.current_activity.thinkpairshareactivity.question_text }}<br></h1>\n' +
  '        </div>\n' +
  '        <div class="right-body-wrap"><h1 class="welcome-screen-text dark-blue">{{ getTimer(thinkCountdown, activityDetails.current_activity.thinkpairshareactivity.think_timer).min | number:\'1.0-0\'}}:{{ getTimer(thinkCountdown, activityDetails.current_activity.thinkpairshareactivity.think_timer).sec | number:\'2.0-0\' }}</h1><br></div>\n' +
  '        <div class="right-body-wrap"><h1 class="welcome-screen-text dark-blue">Ready to present: {{ countPresenters() }} / {{ sessionDetails.sessionrunuser_set.length }}</h1><br></div>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '    <div class="timer-bar">\n' +
  '      <mat-progress-bar mode="determinate" [value]="thinkCountdown * 10 / activityDetails.current_activity.thinkpairshareactivity.think_timer"></mat-progress-bar>' +
  '    </div>\n' +
  '  </div>\n' +
  '  <div class="centred-aligned-screen-body-div" *ngIf="mode === \'sharing\'">\n' +
  '    <div class="div-block-2">\n' +
  '      <h1 class="subheader">Discussion question</h1>\n' +
  '      <div class="body-content-divider">\n' +
  '        <div class="left-body-wrap">\n' +
  '          <h1 class="dark-blue-header">{{ activityDetails.current_activity.thinkpairshareactivity.question_text }}<br></h1>\n' +
  '        </div>\n' +
  '        <div class="right-body-wrap"><h1 class="welcome-screen-text dark-blue">{{ getTimer(shareCountdown, activityDetails.current_activity.thinkpairshareactivity.share_timer).min | number:\'1.0-0\'}}:{{ getTimer(shareCountdown, activityDetails.current_activity.thinkpairshareactivity.share_timer).sec | number:\'2.0-0\' }}</h1></div>\n' +
  '      </div>\n' +
  '      <div class="lower-content-wrap">\n' +
  '        <div class="left-body-wrap">\n' +
  '          <h1 class="small-dark-blue-header"><span class="blue text-span">{{ currentPresenterNames() }}</span> are presenting<br></h1>\n' +
  '        </div>\n' +
  '        <div class="right-body-wrap">\n' +
  '          <h1 class="small-spaced-header" *ngIf="nextPresenters()"><span class="grey text-span-3">UP NEXT:</span> nextPresenterNames()</h1>\n' +
  '        </div>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '    <div class="timer-bar">\n' +
  '      <mat-progress-bar mode="determinate" [value]="shareCountdown * 10 / activityDetails.current_activity.thinkpairshareactivity.share_timer"></mat-progress-bar>' +
  '    </div>\n' +
  '  </div>',
  styleUrls: [],
  encapsulation: ViewEncapsulation.None
})

export class DesktopTPSActivityComponent implements OnInit, OnDestroy {
  public activityDetails;
  public sessionDetails;
  thinkCountdown = 0;
  shareCountdown = 0;

  thinkProgressBarInterval;
  shareProgressBarInterval;

  shareIndex = -1;

  activityBeat;
  mode = 'partnering';

  constructor(public matProgressBar: MatProgressBarModule, private backend: BackendService) {
    this.activityDetails = {'activity': {'titleactivity': {'timer': 30}}};
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.thinkProgressBarInterval.unsubscribe();
    this.shareProgressBarInterval.unsubscribe();
    this.activityBeat.unsubscribe();
  }

  dataInit() {
    this.activityBeat = interval(500).subscribe(() => {
      if (this.mode === 'partnering' && this.allPartnersFound()) {
        this.mode = 'thinking';
        this.thinkProgressBarInterval = interval(100).subscribe(() => ++this.thinkCountdown);
        setTimeout(() => { if (this.mode === 'thinking') { this.mode = 'sharing'; }},
          this.activityDetails.current_activity.thinkpairshareactivity.think_timer * 1000);
      }
      if (this.mode === 'thinking' && this.stillThinking() === 0) {
        this.mode = 'sharing';
      }
      if (this.mode === 'sharing' && (this.shareIndex === -1 || this.currentPresentersDone()) ) {
        if (this.shareIndex === this.activityDetails.current_activityrun.activity_groups.length - 1) {
          this.backend.start_next_activity(this.sessionDetails.session.id).subscribe();
        } else {
          ++this.shareIndex;
          this.shareCountdown = 0;
          if (this.shareProgressBarInterval) {
            this.shareProgressBarInterval.unsubscribe();
          }
          this.shareProgressBarInterval = interval(100).subscribe(() => ++this.shareCountdown);
        }
      }
    });
  }

  countPartners() {
    return this.activityDetails.current_activityrun.activityrunuser_set.filter(
      x => x.activityrunuserparams_set.find(
        y => y.param_name === 'partner_found' && y.param_value === '1') !== undefined).length;
  }

  countRemain() {
    return this.sessionDetails.sessionrunuser_set.length - this.countPartners();
  }

  countPresenters() {
    return this.activityDetails.current_activityrun.activityrunuser_set.filter(
      x => x.activityrunuserparams_set.find(
        y => y.param_name === 'thinking_done' && y.param_value === '1') !== undefined).length;
  }

  stillThinking() {
    return this.sessionDetails.sessionrunuser_set.length - this.countPresenters();
  }

  allPartnersFound() {
    try {
      const target_users = this.sessionDetails.sessionrunuser_set.map(x => x.user.id);
      const allusersjoined = target_users.every(
        x => this.activityDetails.current_activityrun.activityrunuser_set.find(y => y.user === x) !== undefined);
      const alljoineduserspartnered = this.activityDetails.current_activityrun.activityrunuser_set.every(
        x => x.activityrunuserparams_set.find(
          y => y.param_name === 'partner_found' && y.param_value === '1'));

      return allusersjoined && alljoineduserspartnered;
    } catch (err) {
      return false;
    }
  }

  currentPresenters() {
    return this.activityDetails.current_activityrun.activity_groups[this.shareIndex];
  }

  nextPresenters() {
    if (this.shareIndex <= this.activityDetails.current_activityrun.activity_groups.length - 2) {
      return this.activityDetails.current_activityrun.activity_groups[this.shareIndex + 1];
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
      const target_user_params = this.activityDetails.current_activityrun.activityrunuser_set.filter(x => target_ids.includes(x.user));
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
