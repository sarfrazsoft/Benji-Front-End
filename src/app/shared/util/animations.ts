import {
  animate,
  group,
  query,
  sequence,
  stagger,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const openClose = (time: number = 300) =>
  trigger('openClose', [
    transition(':enter', [
      sequence([
        style({ height: '0px', opacity: '0', 'overflow-y': 'hidden' }),
        animate(`${time}ms ease-in`, style({ height: '*', opacity: 1 })),
        style({ 'overflow-y': 'auto', 'max-height': '50px' }),
      ]),
    ]),
    transition(
      ':leave',
      sequence([
        style({ overflow: 'hidden' }),
        animate(`${time}ms ease-in`, style({ height: '0px', opacity: 0 })),
      ])
    ),
  ]);

export const fade = (_fade: number = 1, time: number = 100) =>
  trigger('fade', [
    transition(':enter', [style({ opacity: '0' }), animate(`${time}ms ease-in`, style({ opacity: _fade }))]),
    transition(':leave', [animate(`${time}ms ease-in`, style({ opacity: 0 }))]),
  ]);

export const listAnimation = trigger('listAnimation', [
  transition('* <=> *', [
    query(
      ':enter',
      [style({ opacity: 0 }), stagger('60ms', animate('600ms ease-out', style({ opacity: 1 })))],
      { optional: true }
    ),
    query(':leave', animate('200ms', style({ opacity: 0 })), { optional: true }),
  ]),
]);

export const slideInOut = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('300ms ease-in', style({ transform: 'translateX(0%)' })),
  ]),
  transition(':leave', [animate('300ms ease-in', style({ transform: 'translateX(-100%)' }))]),
]);
