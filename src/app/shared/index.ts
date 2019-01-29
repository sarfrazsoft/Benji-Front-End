export * from './components';
export * from './directives';

import { CmpComponents } from './components';
import { Directives } from './directives';

export const Components = [...CmpComponents, ...Directives];
