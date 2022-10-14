import { MentionsListComponent } from './extensions/mentions/mentions.component';
import {
  NodeViewComponents,
  NodeviewCounterComponent,
  NodeviewEditableComponent,
  NodeviewImageComponent,
} from './node-views';
import { TiptapEditorComponent } from './tiptap-editor.component';

import { BubbleMenuDirective } from './directives/bubble-menu.directive';

export const TipTapEditorComponents = [
  BubbleMenuDirective,
  MentionsListComponent,
  TiptapEditorComponent,
  ...NodeViewComponents,
];
