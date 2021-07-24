import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ActivitySettingsService {
  settings = SETTINGS;

  /**
   * Setting change
   */
  settingChange$ = new BehaviorSubject<any>(null);

  set settingChange(lessons: any) {
    this.settingChange$.next(lessons);
  }
  get settingChange(): any {
    return this.settingChange$.getValue();
  }
  constructor() {}
}

export const SETTINGS = {
  brainstorm: [
    { type: 'toggle', name: 'categorize', label: 'Toggle Categorization' },
    // { type: 'toggle', name: 'participantNames', label: 'Show Participants Names' },
    // // { type: 'toggle', name: 'cardSize', label: 'Case Size' },
    // {
    //   type: 'select',
    //   label: 'Card Size',
    //   name: 'cardSize',
    //   options: [
    //     { id: 1, name: 'small' },
    //     { id: 2, name: 'medium' },
    //     { id: 3, name: 'large' },
    //   ],
    // },
    // { type: 'toggle', label: 'Show vote tally' },
  ],
};
