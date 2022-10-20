import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ActivityTypes } from 'src/app/globals';
import { ContextService } from 'src/app/services';
import {
  Branding,
  ParticipantOptInEvent,
  ParticipantOptOutEvent,
  Timer,
  UpdateMessage,
  User,
} from 'src/app/services/backend/schema';
import { PartnerInfo } from 'src/app/services/backend/schema/whitelabel_info';

@Component({
  selector: 'benji-participant-toolbar',
  templateUrl: './participant-toolbar.component.html',
  styleUrls: ['./participant-toolbar.component.scss'],
})
export class ParticipantToolbarComponent implements OnInit, OnChanges {
  logo;
  timer: Timer;
  @Input() activityState: UpdateMessage;
  at: typeof ActivityTypes = ActivityTypes;
  @Input() showTimer = false;

  @Output() sendMessage = new EventEmitter<any>();

  constructor(private contextService: ContextService, private router: Router) {}

  ngOnInit() {
    this.contextService.brandingInfo$.subscribe((info: Branding) => {
      if (info) {
        this.logo = info.logo ? info.logo.toString() : '/assets/img/Benji_logo.svg';
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

  ngOnChanges() {
    const as = this.activityState;
    if (as) {
      if (as.activity_type === this.at.brainStorm || as.activity_type === this.at.title) {
        if (as.activity_type === this.at.title) {
          if (as.titleactivity.hide_timer) {
            this.showTimer = false;
          } else {
            this.showTimer = true;
          }
        } else if (as.activity_type === this.at.brainStorm) {
          // if (as.brainstormactivity.hide_timer) {
          //   this.showTimer = false;
          // } else {
          //   this.showTimer = true;
          // }
        }
      } else {
        this.showTimer = false;
      }
    }
  }
}
