import { ClickStopPropagationDirective } from './click-stop-propagation/click-stop-propagation.directive';
import { ClickOutsideDirective } from './clicked-outside/clicked-outside.directive';
import { HasPermissionDirective } from './has-permission/has-permission.directive';
import { HoverClassDirective } from './hover-class/hover-class';
import { InfiniteScrollerDirective } from './infinite-scroller/infinite-scroller.directive';

export { ClickStopPropagationDirective, InfiniteScrollerDirective };

export const Directives = [
  ClickStopPropagationDirective,
  HasPermissionDirective,
  InfiniteScrollerDirective,
  HoverClassDirective,
  ClickOutsideDirective,
];
