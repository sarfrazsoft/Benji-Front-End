import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import { ActivityTitles, ActivityTypes } from 'src/app/globals';
import { ContextService } from 'src/app/services';
import { UpdateMessage } from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { Timer } from '../../services/backend/schema/utils';
@Component({
  selector: 'benji-dynamic-timer',
  templateUrl: './dynamic-timer.component.html',
})
export class DynamicTimerComponent implements OnInit, OnDestroy {
  timerDiameter = 1;
  textWidth = 1;
  at: typeof ActivityTypes = ActivityTypes;

  @Input() updateMessage: UpdateMessage;
  @Input() endStateText: string;
  @Input() endAudio;
  @Input() timer: Timer;
  @Input() timerOffset: number;
  @Input() attentionOverlay = false;

  @Output() controlClicked = new EventEmitter<any>();

  totalTime: number;
  remainingTime: number;

  timerInterval;
  audioStarted = false;
  showAttentionTimer = false;
  constructor(public contextService: ContextService, private utilsService: UtilsService) {}

  ngOnInit() {
    this.contextService.activityTimer$.subscribe((timer: Timer) => {
      if (timer) {
        this.timer = timer;
        this.contextService.showTimerSubject = true;
      }
    });
    this.timerInterval = setInterval(() => this.update(), 100);
  }

  update() {
    if (this.timer) {
      this.totalTime = this.timer.total_seconds * 1000;

      if (
        this.timer.status === 'paused' ||
        this.timer.status === 'cancelled' ||
        this.timer.status === 'ended'
      ) {
        this.remainingTime = this.timer.remaining_seconds * 1000;
      } else {
        let offset;
        if (this.timerOffset !== null && this.timerOffset !== undefined) {
          offset = this.timerOffset;
        } else {
          offset = 0;
        }
        // console.log(this.timer.end_time, this.timer.end_time.replace(/ /, 'T'));
        this.remainingTime = Date.parse(this.timer.end_time.replace(/ /, 'T')) - Date.now() - offset;
        if (this.remainingTime < 0) {
          this.remainingTime = 0;
        }
        if (this.remainingTime === 0 && this.endAudio && !this.audioStarted) {
          this.audioStarted = true;
          const audio = new Audio('../../../assets/audio/' + this.endAudio);
          audio.load();
          audio.play();
        }
        // if (this.remainingTime < 10000 && this.attentionOverlay) {
        //   this.showAttentionTimer = true;
        // }
      }
    } else {
      this.totalTime = 1;
      this.remainingTime = 0;
    }
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  get_min_sec() {
    const secondsRemaining = Math.floor(this.remainingTime / 1000);
    const min = Math.floor(secondsRemaining / 60);
    const sec = secondsRemaining - 60 * min;

    if (min < 0) {
      return { min: 0, sec: 0 };
    } else {
      return { min: min, sec: sec };
    }
  }

  pctRemaining() {
    const pctRemaining = (100 * this.remainingTime) / this.totalTime;
    // if (pctRemaining < 0.2) {
    //   const snackBarRef = this.utilsService.openTimerComplete();
    //   snackBarRef.onAction().subscribe(($event) => {
    //     console.log($event);
    //   });
    // }
    return pctRemaining;
  }

  resumeClicked() {
    if (this.updateMessage.activity_type === this.at.mcq) {
      this.controlClicked.emit('resume');
    } else {
      const timer = this.contextService.activityTimer;
      const x = timer.remaining_seconds;
      const end_time = moment().add(x, 'seconds').format();

      this.contextService.activityTimer = {
        ...this.contextService.activityTimer,
        status: 'running',
        end_time: end_time,
      };
    }
  }

  pauseClicked() {
    if (this.updateMessage.activity_type === this.at.mcq) {
      this.controlClicked.emit('pause');
    } else {
      this.contextService.activityTimer = {
        ...this.contextService.activityTimer,
        status: 'paused',
        remaining_seconds: this.remainingTime / 1000,
        end_time: null,
      };
    }
  }

  cancelClicked() {
    this.contextService.activityTimer = { status: 'cancelled' } as Timer;
    // this.contextService.activityTimer = {
    //   ...this.contextService.activityTimer,
    //   status: 'paused',
    //   remaining_seconds: this.remainingTime / 1000,
    // };
  }

  addSeconds(seconds: number) {
    const timer = this.contextService.activityTimer;
    const x = timer.remaining_seconds;
    const end_time = moment(timer.end_time).add(seconds, 'seconds').format();

    this.contextService.activityTimer = {
      ...this.contextService.activityTimer,
      end_time: end_time,
      remaining_seconds: seconds + this.remainingTime / 1000,
      total_seconds: timer.total_seconds + seconds,
    };
  }
}
