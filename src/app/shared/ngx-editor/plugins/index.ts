import { baseKeymap, toggleMark } from 'prosemirror-commands';
import { history, redo, undo } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { liftListItem, sinkListItem, splitListItem } from 'prosemirror-schema-list';
import { Plugin } from 'prosemirror-state';

import { image, placeholder } from 'ngx-editor/plugins';

import schema from '../schema';
import { buildInputRules } from './input-rules';

import { Participant } from 'src/app/services/backend/schema/course_details';
import { TeamUser, User } from 'src/app/services/backend/schema/user';
import { yCursorPlugin as OrginalYCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { yCursorPlugin } from './cursor-plugin/cursor-plugin';

const ydoc = new Y.Doc();
const provider = new WebsocketProvider('wss://prosemirror-collab.glitch.me/', 'prosemirror-demo1', ydoc);
const type = ydoc.getXmlFragment('prosemirror');

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
// Remote cursor user's name
//
//
//
const awareness = provider.awareness;
// get participant information here
const userName = getUserName();

awareness.setLocalStateField('user', {
  // Define a print name that should be displayed
  name: userName ? userName : 'Panda',
  // Define a color that should be associated to the user:
  color: '#ffb61e', // should be a hex color
  // typing: false,
});

const getPlugins = (): Plugin[] => {
  const historyKeyMap = getHistoryKeyMap();
  const listKeyMap = getListKeyMap();

  const plugins = [
    // ySyncPlugin(type),
    // OrginalYCursorPlugin(provider.awareness),
    yCursorPlugin(provider.awareness),
    yUndoPlugin(),
    history(),
    keymap({
      'Mod-b': toggleMark(schema.marks.strong),
      'Mod-i': toggleMark(schema.marks.em),
      'Mod-`': toggleMark(schema.marks.code),
    }),
    keymap(historyKeyMap),
    keymap(listKeyMap),
    keymap(baseKeymap),
    buildInputRules(schema),
    placeholder('Type Something here...'),
    image({
      resize: true,
    }),
  ];

  return plugins;
};

export default getPlugins();

// Get user's name for displaying in remote cursors
export function getUserName() {
  const u: TeamUser = JSON.parse(localStorage.getItem('benji_user'));
  if (u) {
    return u.first_name;
  } else {
    const p: Participant = JSON.parse(localStorage.getItem('participant'));
    if (p) {
      return p.display_name;
    }
  }
}
