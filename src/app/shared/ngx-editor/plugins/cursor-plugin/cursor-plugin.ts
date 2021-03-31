import { Plugin } from 'prosemirror-state'; // eslint-disable-line
import { Decoration, DecorationSet } from 'prosemirror-view'; // eslint-disable-line
import { Participant } from 'src/app/services/backend/schema/course_details';
import { TeamUser, User } from 'src/app/services/backend/schema/user';
import {
  absolutePositionToRelativePosition,
  relativePositionToAbsolutePosition,
  setMeta,
} from 'y-prosemirror';
import { yCursorPluginKey, ySyncPluginKey } from 'y-prosemirror';
import { Awareness } from 'y-protocols/awareness.js'; // eslint-disable-line
import * as Y from 'yjs';

import * as math from 'lib0/math.js';

/**
 * Default generator for a cursor element
 *
 * @param {any} user user data
 * @return HTMLElement
 */
export const defaultCursorBuilder = (user) => {
  // console.log(user);
  const cursor = document.createElement('span');
  cursor.classList.add('ProseMirror-yjs-cursor');
  cursor.setAttribute('style', `border-color: ${user.color}`);
  const userDiv = document.createElement('div');
  userDiv.setAttribute('style', `background-color: ${user.backgroundColor}; color: ${user.color}`);
  // userDiv.setAttribute('style', `color: ${user.color}`);
  userDiv.insertBefore(document.createTextNode(user.name), null);
  cursor.insertBefore(userDiv, null);
  return cursor;
};

/**
 * @param {any} state
 * @param {Awareness} awareness
 * @return {any} DecorationSet
 */
export const createDecorations = (state, awareness, createCursor) => {
  const ystate = ySyncPluginKey.getState(state);
  const y = ystate.doc;
  const decorations = [];
  if (ystate.snapshot != null || ystate.prevSnapshot != null || ystate.binding === null) {
    // do not render cursors while snapshot is active
    return DecorationSet.create(state.doc, []);
  }
  awareness.getStates().forEach((aw, clientId) => {
    if (aw.user) {
      if (aw.user.name === 'mahin2') {
        console.log(aw.user['typing']);
      }
    }
    // console.log(JSON.stringify(aw.user));
    if (clientId === y.clientID) {
      return;
    }
    if (aw.cursor != null) {
      const user = aw.user || {};
      console.log(JSON.stringify(user));
      if (user.color == null) {
        user.color = '#ffa500';
      }
      if (user.name == null) {
        user.name = `User: ${clientId}`;
      }
      if (!user['typing']) {
        user.name = '';
      }
      let anchor = relativePositionToAbsolutePosition(
        y,
        ystate.type,
        Y.createRelativePositionFromJSON(aw.cursor.anchor),
        ystate.binding.mapping
      );
      let head = relativePositionToAbsolutePosition(
        y,
        ystate.type,
        Y.createRelativePositionFromJSON(aw.cursor.head),
        ystate.binding.mapping
      );
      if (anchor !== null && head !== null) {
        const maxsize = math.max(state.doc.content.size - 1, 0);
        anchor = math.min(anchor, maxsize);
        head = math.min(head, maxsize);
        decorations.push(Decoration.widget(head, () => createCursor(user), { side: 10 }));
        const from = math.min(anchor, head);
        const to = math.max(anchor, head);
        decorations.push(
          Decoration.inline(
            from,
            to,
            { style: `background-color: ${user.color}70` },
            { inclusiveEnd: true, inclusiveStart: false }
          )
        );
      }
    }
  });
  return DecorationSet.create(state.doc, decorations);
};

/**
 * A prosemirror plugin that listens to awareness information on Yjs.
 * This requires that a `prosemirrorPlugin` is also bound to the prosemirror.
 *
 * @public
 * @param {Awareness} awareness
 * @param {object} [opts]
 * @param {function(any):HTMLElement} [opts.cursorBuilder]
 * @param {function(any):any} [opts.getSelection]
 * By default all editor bindings use the awareness 'cursor' field to propagate cursor information.
 * @param {string} [opts.cursorStateField]
 * @return {any}
 */
export const yCursorPlugin = (
  awareness,
  { cursorBuilder = defaultCursorBuilder, getSelection = (state) => state.selection } = {},
  cursorStateField = 'cursor'
) =>
  new Plugin({
    key: yCursorPluginKey,
    state: {
      init(_, state) {
        return createDecorations(state, awareness, cursorBuilder);
      },
      apply(tr, prevState, oldState, newState) {
        // TOD move to it's own plugin
        localStorage.setItem('collabedit', newState.doc.textContent);
        const ystate = ySyncPluginKey.getState(newState);
        const yCursorState = tr.getMeta(yCursorPluginKey);
        if ((ystate && ystate.isChangeOrigin) || (yCursorState && yCursorState.awarenessUpdated)) {
          return createDecorations(newState, awareness, cursorBuilder);
        }
        return prevState.map(tr.mapping, tr.doc);
      },
    },
    props: {
      decorations: (state) => {
        return yCursorPluginKey.getState(state);
      },
      handleKeyDown: (view, event) => {
        // console.log('A key was pressed!');
        // console.log(awareness.getLocalState());
        typingStarted(awareness);
        typingStoped(awareness);
        return false;
      },
    },
    view: (view) => {
      const awarenessListener = () => {
        // @ts-ignore
        if (view.docView) {
          setMeta(view, yCursorPluginKey, { awarenessUpdated: true });
        }
      };
      const updateCursorInfo = () => {
        const ystate = ySyncPluginKey.getState(view.state);
        // @note We make implicit checks when checking for the cursor property
        const current = awareness.getLocalState() || {};
        if (view.hasFocus() && ystate.binding !== null) {
          const selection = getSelection(view.state);
          /**
           * @type {Y.RelativePosition}
           */
          const anchor = absolutePositionToRelativePosition(
            selection.anchor,
            ystate.type,
            ystate.binding.mapping
          );
          /**
           * @type {Y.RelativePosition}
           */
          const head = absolutePositionToRelativePosition(
            selection.head,
            ystate.type,
            ystate.binding.mapping
          );
          if (
            current.cursor == null ||
            !Y.compareRelativePositions(Y.createRelativePositionFromJSON(current.cursor.anchor), anchor) ||
            !Y.compareRelativePositions(Y.createRelativePositionFromJSON(current.cursor.head), head)
          ) {
            awareness.setLocalStateField(cursorStateField, {
              anchor,
              head,
            });
          }
        } else if (
          current.cursor != null &&
          relativePositionToAbsolutePosition(
            ystate.doc,
            ystate.type,
            Y.createRelativePositionFromJSON(current.cursor.anchor),
            ystate.binding.mapping
          ) !== null
        ) {
          // delete cursor information if current cursor information is owned by this editor binding
          awareness.setLocalStateField(cursorStateField, null);
        }
      };
      awareness.on('change', awarenessListener);
      view.dom.addEventListener('focusin', updateCursorInfo);
      view.dom.addEventListener('focusout', updateCursorInfo);
      return {
        update: updateCursorInfo,
        destroy: () => {
          awareness.off('change', awarenessListener);
          awareness.setLocalStateField(cursorStateField, null);
        },
      };
    },
  });

const userName = getUserName();
let usersNumber;

let typingTimer;
// on keyup, start the countdown
function typingStoped(awareness) {
  clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    doneTyping(awareness);
  }, 3000);
}

// on keydown, clear the countdown
function typingStarted(awareness) {
  awareness.setLocalStateField('user', {
    name: userName ? userName : 'Panda',
    color: colors[usersNumber].color, // should be a hex color
    backgroundColor: colors[usersNumber].backgroundColor, // should be a hex color
    typing: true,
  });
  clearTimeout(typingTimer);
}

function doneTyping(awareness) {
  console.log('done typing');
  awareness.setLocalStateField('user', {
    name: userName ? userName : 'Panda',
    color: colors[usersNumber].color, // should be a hex color
    backgroundColor: colors[usersNumber].backgroundColor, // should be a hex color
    typing: false,
  });
}

// Get user's name for displaying in remote cursors
function getUserName() {
  const p: Participant = JSON.parse(localStorage.getItem('participant'));
  if (p) {
    return p.display_name;
  }
}

export function setAwareness(provider, participantCode) {
  //
  //
  // Remote cursor user's name

  const one = String(participantCode).charAt(0);
  const oneAsNumber = Number(one);
  usersNumber = oneAsNumber;
  const awareness = provider.awareness;

  // const colorIndex = randomIntFromInterval(0, 19);
  awareness.setLocalStateField('user', {
    // Define a print name that should be displayed
    name: userName ? userName : 'Panda',
    // Define a color that should be associated to the user:
    color: colors[usersNumber].color, // should be a hex color
    backgroundColor: colors[usersNumber].backgroundColor, // should be a hex color
    // typing: false,
  });
}

const colors = [
  { color: '#ffffff', backgroundColor: '#686DDE' },
  { color: '#ffffff', backgroundColor: '#BD68DE' },
  { color: '#ffffff', backgroundColor: '#DE68A7' },
  { color: '#ffffff', backgroundColor: '#DE8268' },
  { color: '#ffffff', backgroundColor: '#DEDA68' },
  { color: '#ffffff', backgroundColor: '#8ADE68' },
  { color: '#ffffff', backgroundColor: '#68DE9F' },
  { color: '#ffffff', backgroundColor: '#68DE9F' },
  { color: '#ffffff', backgroundColor: '#68C4DE' },
  { color: '#ffffff', backgroundColor: '#68C4DE' },
];
const colors2 = [
  { color: '#ffffff', backgroundColor: '#e6194b' },
  { color: '#ffffff', backgroundColor: '#3cb44b' },
  { color: '#000000', backgroundColor: '#ffe119' },
  { color: '#ffffff', backgroundColor: '#4363d8' },
  { color: '#ffffff', backgroundColor: '#f58231' },
  { color: '#ffffff', backgroundColor: '#911eb4' },
  { color: '#000000', backgroundColor: '#46f0f0' },
  { color: '#ffffff', backgroundColor: '#f032e6' },
  { color: '#000000', backgroundColor: '#bcf60c' },
  { color: '#000000', backgroundColor: '#fabebe' },
  { color: '#ffffff', backgroundColor: '#469990' },
  { color: '#000000', backgroundColor: '#008080' },
  { color: '#000000', backgroundColor: '#e6beff' },
  { color: '#ffffff', backgroundColor: '#9a6324' },
  { color: '#000000', backgroundColor: '#fffac8' },
  { color: '#ffffff', backgroundColor: '#800000' },
  { color: '#000000', backgroundColor: '#aaffc3' },
  { color: '#ffffff', backgroundColor: '#808000' },
  { color: '#000000', backgroundColor: '#ffd8b1' },
  { color: '#ffffff', backgroundColor: '#000075' },
  { color: '#000000', backgroundColor: '#808080' },
  { color: '#000000', backgroundColor: '#ffffff' },
  { color: '#ffffff', backgroundColor: '#000000' },
  { color: '#ffffff', backgroundColor: '#a9a9a9' },
];
