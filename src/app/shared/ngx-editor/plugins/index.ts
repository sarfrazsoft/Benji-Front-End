import { baseKeymap, toggleMark } from 'prosemirror-commands';
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { liftListItem, sinkListItem, splitListItem } from 'prosemirror-schema-list';
import { Plugin } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';

import { image, placeholder } from 'ngx-editor/plugins';

import schema from '../schema';
import { buildInputRules } from './input-rules';

import { Participant } from 'src/app/services/backend/schema/course_details';
import { TeamUser, User } from 'src/app/services/backend/schema/user';
import { yCursorPlugin as OrginalYCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { yCursorPlugin } from './cursor-plugin/cursor-plugin';

const isMacOs = /Mac/.test(navigator.platform);

export interface KeyMap {
  [key: string]: any;
}

const getHistoryKeyMap = (): KeyMap => {
  const historyMap: KeyMap = {};

  historyMap['Mod-z'] = undo;

  if (isMacOs) {
    historyMap['Shift-Mod-z'] = redo;
  } else {
    historyMap['Mod-y'] = redo;
  }

  return historyMap;
};

const getListKeyMap = (): KeyMap => {
  const listMap: KeyMap = {};

  listMap.Enter = splitListItem(schema.nodes.list_item);
  listMap['Mod-['] = liftListItem(schema.nodes.list_item);
  listMap['Mod-]'] = sinkListItem(schema.nodes.list_item);
  listMap.Tab = sinkListItem(schema.nodes.list_item);

  return listMap;
};

//
//
//
// image upload plugin
// TODO: should have it's own page/file
export const placeholderPlugin = new Plugin({
  state: {
    init() {
      return DecorationSet.empty;
    },
    apply(tr, set) {
      // Adjust decoration positions to changes made by the transaction
      set = set.map(tr.mapping, tr.doc);
      // See if the transaction adds or removes any placeholders
      const action = tr.getMeta(this);
      if (action && action.add) {
        const widget = document.createElement('placeholder');
        const deco = Decoration.widget(action.add.pos, widget, { id: action.add.id });
        set = set.add(tr.doc, [deco]);
      } else if (action && action.remove) {
        set = set.remove(set.find(null, null, (spec) => spec.id === action.remove.id));
      }
      return set;
    },
  },
  props: {
    decorations(state) {
      return this.getState(state);
    },
  },
});

//
//
//
//

const getPlugins = (): Plugin[] => {
  const historyKeyMap = getHistoryKeyMap();
  const listKeyMap = getListKeyMap();
  const plugins = [
    // yUndoPlugin(),
    // history(),
    keymap({
      'Mod-b': toggleMark(schema.marks.strong),
      'Mod-i': toggleMark(schema.marks.em),
      'Mod-`': toggleMark(schema.marks.code),
      'Ctrl-u': toggleMark(schema.marks.u),
    }),
    keymap(historyKeyMap),
    keymap(listKeyMap),
    keymap(baseKeymap),
    buildInputRules(schema),
    placeholder('Type Something here...'),
    image({
      resize: true,
    }),
    placeholderPlugin,
  ];

  return plugins;
};

export default getPlugins();

// // Get user's name for displaying in remote cursors
// export function getUserName() {
//   // const u: TeamUser = JSON.parse(localStorage.getItem('benji_user'));
//   // if (u) {
//   //   return u.first_name;
//   // } else {
//   const p: Participant = JSON.parse(localStorage.getItem('participant'));
//   if (p) {
//     return p.display_name;
//   }
//   // }
// }
