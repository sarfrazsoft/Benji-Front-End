import { ActivityEvent } from '../messages';

export class StartTimerEvent extends ActivityEvent {
  event_name = 'StartTimerEvent';
  constructor(seconds: number) {
    super();
    this.extra_args = { timer_seconds: seconds };
  }
}

export class AddSecondsTimerEvent extends ActivityEvent {
  event_name = 'AddSecondsTimerEvent';
  constructor(seconds: number) {
    super();
    this.extra_args = { timer_seconds: seconds };
  }
}

export class PauseTimerEvent extends ActivityEvent {
  event_name = 'PauseTimerEvent';
}

export class ResumeTimerEvent extends ActivityEvent {
  event_name = 'ResumeTimerEvent';
}

export class DestroyTimerEvent extends ActivityEvent {
  event_name = 'DestroyTimerEvent';
}
