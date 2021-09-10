import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import * as moment from 'moment';
import { ActivityTitles, ActivityTypes } from 'src/app/globals';
import { ContextService } from 'src/app/services';
import {
  AddSecondsTimerEvent,
  DestroyTimerEvent,
  PauseTimerEvent,
  ResumeTimerEvent,
  StartTimerEvent,
  UpdateMessage,
} from 'src/app/services/backend/schema';
import { UtilsService } from 'src/app/services/utils.service';
import { Timer } from '../../services/backend/schema/utils';
@Component({
  selector: 'benji-dynamic-timer',
  templateUrl: './dynamic-timer.component.html',
})
export class DynamicTimerComponent implements OnInit, OnDestroy, OnChanges {
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
  @Output() propagate = new EventEmitter<any>();

  totalTime: number;
  remainingTime: number;

  timerInterval;
  audioStarted = false;
  showAttentionTimer = false;
  constructor(public contextService: ContextService, private utilsService: UtilsService) {}

  ngOnInit() {
    // this.contextService.activityTimer$.subscribe((timer: Timer) => {
    //   if (timer) {
    //     this.timer = timer;
    //     this.contextService.showTimerSubject = true;
    //   }
    // });
    this.timerInterval = setInterval(() => this.update(), 100);

    if (!this.timer) {
      const startTime = moment().format();
      const endTime = moment(startTime).add(0, 'seconds').format();

      this.contextService.activityTimer = {
        end_time: endTime,
        id: 57,
        remaining_seconds: 0,
        start_time: startTime,
        status: 'paused',
        total_seconds: 0,
        editor: false,
      };
    }

    if (this.getTimerTool()) {
      this.contextService.activityTimer = this.getTimerTool();
    }
  }

  ngOnChanges() {
    if (this.updateMessage.mcqactivity) {
      const as = this.updateMessage;
      if (
        as.mcqactivity.question_timer &&
        (as.mcqactivity.question_timer.status === 'running' ||
          as.mcqactivity.question_timer.status === 'paused')
      ) {
        this.timer = as.mcqactivity.question_timer;
        this.contextService.activityTimer = this.timer;
        // this.timer = this.getTimerTool();
      } else {
        const time = moment().format();
        this.timer = {
          end_time: time,
          id: 57,
          remaining_seconds: 0,
          start_time: time,
          status: 'paused',
          total_seconds: 0,
          editor: false,
        };
        this.contextService.activityTimer = this.timer;
      }
    } else {
      if (this.getTimerTool()) {
        this.contextService.activityTimer = this.getTimerTool();
        this.timer = this.getTimerTool();
      } else {
        const time = moment().format();
        this.timer = {
          end_time: time,
          id: 57,
          remaining_seconds: 0,
          start_time: time,
          status: 'paused',
          total_seconds: 0,
          editor: false,
        };
        this.contextService.activityTimer = this.timer;
      }
    }
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
        const rt = moment(this.timer.end_time).diff(moment());
        this.remainingTime = rt;
        if (this.remainingTime < 0) {
          this.remainingTime = 0;
        }
        // if (this.remainingTime === 0 && this.endAudio && !this.audioStarted) {
        //   this.audioStarted = true;
        //   const audio = new Audio('../../../assets/audio/' + this.endAudio);
        //   audio.load();
        //   audio.play();
        // }
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
    let secondsRemaining = this.remainingTime / 1000;
    secondsRemaining = Math.ceil(secondsRemaining);
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
    if (pctRemaining < 0.2) {
      //   const snackBarRef = this.utilsService.openTimerComplete();
      //   snackBarRef.onAction().subscribe(($event) => {
      //     console.log($event);
      //   });
      this.cancelClicked();
    }
    return pctRemaining;
  }

  resumeClicked() {
    if (this.updateMessage.activity_type === this.at.mcq) {
      this.controlClicked.emit('resume');
    } else {
      // const timer = this.contextService.activityTimer;
      // const x = timer.remaining_seconds;
      // const end_time = moment().add(x, 'seconds').format();
      // if (x) {
      //   console.log('continuing');
      // this.propagate.emit(new StartTimerEvent(x));
      // } else {
      //   console.log('starting');
      this.propagate.emit(new ResumeTimerEvent());
      // }

      // this.contextService.activityTimer = {
      //   ...this.contextService.activityTimer,
      //   status: 'running',
      //   end_time: end_time,
      // };
    }
  }

  pauseClicked() {
    if (this.updateMessage.activity_type === this.at.mcq) {
      this.controlClicked.emit('pause');
    } else {
      // this.contextService.activityTimer = {
      //   ...this.contextService.activityTimer,
      //   status: 'paused',
      //   remaining_seconds: this.remainingTime / 1000,
      //   end_time: null,
      // };

      this.propagate.emit(new PauseTimerEvent());
    }
  }

  cancelClicked() {
    // const time = moment().format();
    // this.contextService.activityTimer = {
    //   end_time: time,
    //   id: 57,
    //   remaining_seconds: 0,
    //   start_time: time,
    //   status: 'paused',
    //   total_seconds: 0,
    //   editor: false,
    // };
    this.propagate.emit(new DestroyTimerEvent());
  }

  resetTimer() {
    const time = moment().format();
    this.timer = {
      end_time: time,
      id: 57,
      remaining_seconds: 0,
      start_time: time,
      status: 'paused',
      total_seconds: 0,
      editor: false,
    };
    this.propagate.emit(new DestroyTimerEvent());
  }

  addSeconds(seconds: number) {
    this.propagate.emit(new AddSecondsTimerEvent(seconds));

    // const timer = this.contextService.activityTimer;
    // if (timer && timer.status !== 'cancelled') {
    //   const x = timer.remaining_seconds;
    //   const end_time = moment(timer.end_time).add(seconds, 'seconds').format();

    //   this.contextService.activityTimer = {
    //     ...this.contextService.activityTimer,
    //     end_time: end_time,
    //     remaining_seconds: seconds + this.remainingTime / 1000,
    //     total_seconds: timer.total_seconds + seconds,
    //   };
    //   this.propagate.emit(new AddSecondsTimerEvent(seconds));
    // } else {
    //   const startTime = moment().format();
    //   const endTime = moment(startTime).add(seconds, 'seconds').format();

    //   this.contextService.activityTimer = {
    //     end_time: endTime,
    //     id: 57,
    //     remaining_seconds: seconds,
    //     start_time: startTime,
    //     status: 'paused',
    //     total_seconds: seconds,
    //     editor: false,
    //   };
    // }
  }

  getTimerTool() {
    const sm = this.updateMessage;
    if (sm && sm.running_tools && sm.running_tools.timer_tool) {
      return sm.running_tools.timer_tool;
    } else {
      return sm.running_tools.timer_tool;
    }
  }
}
