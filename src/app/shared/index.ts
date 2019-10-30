export * from './components';
export * from './directives';
export * from './dialogs';

import { CmpComponents, CmpEntryComponents } from './components';
import { Dialogs } from './dialogs';
import { Directives } from './directives';

export const Components = [...CmpComponents, ...Directives, ...Dialogs];

export const EntryComponents = [...Dialogs, ...CmpEntryComponents];
