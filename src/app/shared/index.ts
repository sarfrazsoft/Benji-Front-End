export * from './components';
export * from './directives';
export * from './dialogs';

import { CmpComponents, CmpEntryComponents } from './components';
import { Dialogs } from './dialogs';
import { Directives } from './directives';

import { BTwemojiComponent } from '../ui-components/b-twemoji/b-twemoji.component';
export const Components = [...CmpComponents, ...Directives, ...Dialogs, BTwemojiComponent];

export const EntryComponents = [...Dialogs, ...CmpEntryComponents];
