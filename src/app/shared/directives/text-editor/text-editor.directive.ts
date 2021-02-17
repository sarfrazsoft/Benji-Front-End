import { Directive, Injector, OnInit, ViewContainerRef } from '@angular/core';

import crel from 'crelt';
import { collab, getVersion, receiveTransaction, sendableSteps } from 'prosemirror-collab';
import { buildMenuItems, exampleSetup } from 'prosemirror-example-setup';
import { history } from 'prosemirror-history';
import { Dropdown, MenuItem } from 'prosemirror-menu';
import { DOMParser as PDOMParser, Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { EditorState } from 'prosemirror-state';
import {
  addColumnAfter,
  addColumnBefore,
  addRowAfter,
  addRowBefore,
  deleteColumn,
  deleteRow,
  deleteTable,
  goToNextCell,
  mergeCells,
  setCellAttr,
  splitCell,
  toggleHeaderCell,
  toggleHeaderColumn,
  toggleHeaderRow,
} from 'prosemirror-tables';
import { columnResizing, fixTables, tableEditing, tableNodes } from 'prosemirror-tables';
import { Step } from 'prosemirror-transform';
import { EditorView } from 'prosemirror-view';
import { redo, undo, yCursorPlugin, ySyncPlugin, yUndoPlugin } from 'y-prosemirror';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { addAnnotation, annotationIcon, commentPlugin, commentUI } from './comment';
import { GET, POST } from './http';
import { Reporter } from './reporter';

// const nodes = addListNodes(schema.spec.nodes, 'paragraph block*', 'block');

// const mySchema = new Schema({
//   nodes: nodes.append({
//     example: {
//       attrs: {
//         value: { default: 'in the app and in ProseMirror' },
//         random: { default: -1 },
//       },
//       inline: false,
//       draggable: true,
//       selectable: true,
//       atom: false,
//       group: 'block',
//       toDOM(nodex) {
//         return ['div', { 'data-type': 'example', value: nodex.attrs.value }, ''];
//       },
//       parseDOM: [
//         {
//           // you could use my-element as a tag, but we want
//           //  some additional features that come with the node view
//           // the custom element would then completely t
//           // ake over the node and only communicate through its attributes
//           tag: 'div[data-type=example]',
//           getAttrs(dom) {
//             return {};
//           },
//         },
//       ],
//     },
//   }),
//   marks: schema.spec.marks,
// });

// const schema2 = new Schema({
//   nodes: nodes.append(
//     tableNodes({
//       tableGroup: 'block',
//       cellContent: 'block+',
//       cellAttributes: {
//         background: {
//           default: null,
//           getFromDOM(dom: any) {
//             return (dom.style && dom.style.backgroundColor) || null;
//           },
//           setDOMAttr(value, attrs) {
//             if (value) {
//               attrs.style = (attrs.style || '') + `background-color: ${value};`;
//             }
//           },
//         },
//       },
//     })
//   ),
//   marks: schema.spec.marks,
// });

// const menu = buildMenuItems(schema).fullMenu;
// function item(label, cmd) {
//   return new MenuItem({ label, select: cmd, run: cmd });
// }
// const tableMenu = [
//   item('Insert column before', addColumnBefore),
//   item('Insert column after', addColumnAfter),
//   item('Delete column', deleteColumn),
//   item('Insert row before', addRowBefore),
//   item('Insert row after', addRowAfter),
//   item('Delete row', deleteRow),
//   item('Delete table', deleteTable),
//   item('Merge cells', mergeCells),
//   item('Split cell', splitCell),
//   item('Toggle header column', toggleHeaderColumn),
//   item('Toggle header row', toggleHeaderRow),
//   item('Toggle header cells', toggleHeaderCell),
//   item('Make cell green', setCellAttr('background', '#dfd')),
//   item('Make cell not-green', setCellAttr('background', null)),
// ];
// menu.splice(2, 0, [new Dropdown(tableMenu, { label: 'Table' })]);
// const parser = new DOMParser();
// const doc = PDOMParser.fromSchema(schema).parse(
//   parser.parseFromString(
//     `<table>
//   <tr><th colspan="3" data-colwidth="100,0,0">Wide header</th></tr>
//   <tr><td>One</td><td>Two</td><td>Three</td></tr>
//   <tr><td>Four</td><td>Five</td><td>Six</td></tr>
// </table>`,
//     'text/xml'
//   ).documentElement
// );

// const node = mySchema.node.bind(mySchema);
// const text = mySchema.text.bind(mySchema);
// const example = mySchema.nodes.example;
// const paragraph = mySchema.nodes.paragraph;
// const heading = mySchema.nodes.heading;

// const ydoc = new Y.Doc();
// const provider = new WebsocketProvider('wss://demos.yjs.dev', 'prosemirror-demo', ydoc);
// const type = ydoc.getXmlFragment('prosemirror');

// @Directive({
//   // tslint:disable-next-line:directive-selector
//   selector: '[benjiTextEditor]',
// })
// export class TextEditorDirective implements OnInit {
//   view = new EditorView(this.viewContainerRef.element.nativeElement, {
//     state: EditorState.create({
//       schema,
//       // doc: node('doc', {}, [
//       //   heading.create({}, [text('Test document')]),
//       //   example.create({}, []),
//       //   paragraph.create({}, [text('Some paragraph to drag after')]),
//       // ]),
//       plugins: [ySyncPlugin(type), yCursorPlugin(provider.awareness), yUndoPlugin()].concat(
//         exampleSetup({ schema })
//       ),
//     }),
//     // nodeViews: {
//     //   example: (node, nodeView, getPos) =>
//     //     new CustomView(node, nodeView, getPos, this.injector),
//     // },
//   });

//   constructor(public viewContainerRef: ViewContainerRef, private injector: Injector) {}
//   ngOnInit() {
//     const awareness = provider.awareness;
//     // get participant information here
//     const benji_user = JSON.parse(localStorage.getItem('benji_user'));
//     console.log(benji_user);

//     awareness.setLocalStateField('user', {
//       // Define a print name that should be displayed
//       name: benji_user.first_name,
//       // Define a color that should be associated to the user:
//       color: '#ffb61e', // should be a hex color
//     });
//     // console.log(ydoc);
//     // console.log(
//     //   node('doc', {}, [
//     //     heading.create({}, [text('Test document')]),
//     //     example.create({}, []),
//     //     paragraph.create({}, [text('Some paragraph to drag after')]),
//     //   ])
//     // );
//   }
// }

// export class EditorConnection {
//   report: any;
//   url: any;
//   state: State;
//   request: any;
//   backOff: number;
//   view: any;
//   nativeElement;

//   constructor(reportx, url, nativeElement) {
//     this.report = reportx;
//     this.url = url;
//     this.nativeElement = nativeElement;
//     this.state = new State(null, 'start');
//     this.request = null;
//     this.backOff = 0;
//     this.view = null;
//     this.dispatch = this.dispatch.bind(this);
//     this.start();
//   }

//   // All state changes go through this
//   dispatch(action) {
//     let newEditState = null;
//     if (action.type === 'loaded') {
//       // info.users.textContent = userString(action.users) // FIXME ewww
//       const editState = EditorState.create({
//         doc: action.doc,
//         plugins: exampleSetup({
//           schema,
//           history: false,
//           menuContent: menu.fullMenu,
//         }).concat([
//           history({ preserveItems: true }),
//           collab({ version: action.version }),
//           commentPlugin,
//           commentUI((transaction) => this.dispatch({ type: 'transaction', transaction })),
//         ]),
//         comments: action.comments,
//       });
//       this.state = new State(editState, 'poll');
//       this.poll();
//     } else if (action.type === 'restart') {
//       this.state = new State(null, 'start');
//       this.start();
//     } else if (action.type === 'poll') {
//       this.state = new State(this.state.edit, 'poll');
//       this.poll();
//     } else if (action.type === 'recover') {
//       if (action.error.status && action.error.status < 500) {
//         this.report.failure(action.error);
//         this.state = new State(null, null);
//       } else {
//         this.state = new State(this.state.edit, 'recover');
//         this.recover(action.error);
//       }
//     } else if (action.type === 'transaction') {
//       newEditState = this.state.edit.apply(action.transaction);
//     }

//     if (newEditState) {
//       let sendable;
//       if (newEditState.doc.content.size > 40000) {
//         if (this.state.comm !== 'detached') {
//           this.report.failure('Document too big. Detached.');
//         }
//         this.state = new State(newEditState, 'detached');
//       } else if (
//         (this.state.comm === 'poll' || action.requestDone) &&
//         (sendable = this.sendable(newEditState))
//       ) {
//         this.closeRequest();
//         this.state = new State(newEditState, 'send');
//         this.send(newEditState, sendable);
//       } else if (action.requestDone) {
//         this.state = new State(newEditState, 'poll');
//         this.poll();
//       } else {
//         this.state = new State(newEditState, this.state.comm);
//       }
//     }

//     // Sync the editor with this.state.edit
//     if (this.state.edit) {
//       if (this.view) {
//         this.view.updateState(this.state.edit);
//       } else {
//         this.setView(
//           new EditorView(this.nativeElement, {
//             state: this.state.edit,
//             dispatchTransaction: (transaction) => this.dispatch({ type: 'transaction', transaction }),
//           })
//         );
//       }
//     } else {
//       this.setView(null);
//     }
//   }

//   // Load the document from the server and start up
//   start() {
//     this.run(GET(this.url)).then(
//       (data) => {
//         data = JSON.parse(data);
//         this.report.success();
//         this.backOff = 0;
//         this.dispatch({
//           type: 'loaded',
//           doc: schema.nodeFromJSON(data.doc),
//           version: data.version,
//           users: data.users,
//           comments: { version: data.commentVersion, comments: data.comments },
//         });
//       },
//       (err) => {
//         this.report.failure(err);
//       }
//     );
//   }

//   // Send a request for events that have happened since the version
//   // of the document that the client knows about. This request waits
//   // for a new version of the document to be created if the client
//   // is already up-to-date.
//   poll() {
//     const query =
//       'version=' +
//       getVersion(this.state.edit) +
//       '&commentVersion=' +
//       commentPlugin.getState(this.state.edit).version;
//     this.run(GET(this.url + '/events?' + query)).then(
//       (data) => {
//         this.report.success();
//         data = JSON.parse(data);
//         this.backOff = 0;
//         if (data.steps && (data.steps.length || data.comment.length)) {
//           const tr = receiveTransaction(
//             this.state.edit,
//             data.steps.map((j) => Step.fromJSON(schema, j)),
//             data.clientIDs
//           );
//           tr.setMeta(commentPlugin, {
//             type: 'receive',
//             version: data.commentVersion,
//             events: data.comment,
//             sent: 0,
//           });
//           this.dispatch({
//             type: 'transaction',
//             transaction: tr,
//             requestDone: true,
//           });
//         } else {
//           this.poll();
//         }
//         // info.users.textContent = userString(data.users);
//       },
//       (err) => {
//         if (err.status === 410 || badVersion(err)) {
//           // Too far behind. Revert to server state
//           // this.report.failure(err);
//           // this.dispatch({ type: 'restart' });
//         } else if (err) {
//           // this.dispatch({ type: 'recover', error: err });
//         }
//       }
//     );
//   }

//   sendable(editState) {
//     const steps = sendableSteps(editState);
//     const comments = commentPlugin.getState(editState).unsentEvents();
//     if (steps || comments.length) {
//       return { steps, comments };
//     }
//   }

//   // Send the given steps to the server
//   send(editState, { steps, comments }) {
//     const json = JSON.stringify({
//       version: getVersion(editState),
//       steps: steps ? steps.steps.map((s) => s.toJSON()) : [],
//       clientID: steps ? steps.clientID : 0,
//       comment: comments || [],
//     });
//     console.log(this.url);
//     this.run(POST(this.url + '/events', json, 'application/json')).then(
//       (data) => {
//         this.report.success();
//         this.backOff = 0;
//         const tr = steps
//           ? receiveTransaction(this.state.edit, steps.steps, repeat(steps.clientID, steps.steps.length))
//           : this.state.edit.tr;
//         tr.setMeta(commentPlugin, {
//           type: 'receive',
//           version: JSON.parse(data).commentVersion,
//           events: [],
//           sent: comments.length,
//         });
//         this.dispatch({
//           type: 'transaction',
//           transaction: tr,
//           requestDone: true,
//         });
//       },
//       (err) => {
//         if (err.status === 409) {
//           // The client's document conflicts with the server's version.
//           // Poll for changes and then try again.
//           // this.backOff = 0;
//           // this.dispatch({ type: 'poll' });
//         } else if (badVersion(err)) {
//           // this.report.failure(err);
//           // this.dispatch({ type: 'restart' });
//         } else {
//           // this.dispatch({ type: 'recover', error: err });
//         }
//       }
//     );
//   }

//   // Try to recover from an error
//   recover(err) {
//     const newBackOff = this.backOff ? Math.min(this.backOff * 2, 6e4) : 200;
//     if (newBackOff > 1000 && this.backOff < 1000) {
//       this.report.delay(err);
//     }
//     this.backOff = newBackOff;
//     setTimeout(() => {
//       if (this.state.comm === 'recover') {
//         this.dispatch({ type: 'poll' });
//       }
//     }, this.backOff);
//   }

//   closeRequest() {
//     if (this.request) {
//       this.request.abort();
//       this.request = null;
//     }
//   }

//   run(request) {
//     return (this.request = request);
//   }

//   close() {
//     this.closeRequest();
//     this.setView(null);
//   }

//   setView(view) {
//     if (this.view) {
//       this.view.destroy();
//     }
//     // this.view = window.view = view;
//     this.view = view;
//   }
// }

// @Directive({
//   // tslint:disable-next-line:directive-selector
//   selector: '[benjiTextEditor]',
// })
// export class TextEditorDirective implements OnInit {
//   connection = null;
//   constructor(public viewContainerRef: ViewContainerRef, private injector: Injector) {}

//   ngOnInit() {
//     if (this.connectFromHash()) {
//     } else {
//       location.hash = '#edit-Example';
//     }
//   }

//   connectFromHash() {
//     const isID = /^#edit-(.+)/.exec(location.hash);
//     if (isID) {
//       if (this.connection) {
//         this.connection.close();
//       }
//       this.connection = new EditorConnection(
//         report,
//         '/collab-backend/docs/' + isID[1],
//         this.viewContainerRef.element.nativeElement
//       );
//       this.connection.request.then(() => this.connection.view.focus());
//       return true;
//     }
//   }
// }

// //
// // collab.js

// const report = new Reporter();

// function badVersion(err) {
//   return err.status === 400 && /invalid version/i.test(err);
// }

// class State {
//   edit: any;
//   comm: any;
//   constructor(edit, comm) {
//     this.edit = edit;
//     this.comm = comm;
//   }
// }

// function repeat(val, n) {
//   const result = [];
//   for (let i = 0; i < n; i++) {
//     result.push(val);
//   }
//   return result;
// }

// const annotationMenuItem = new MenuItem({
//   title: 'Add an annotation',
//   run: addAnnotation,
//   select: (state) => addAnnotation(state),
//   icon: annotationIcon,
// });

// const menu = buildMenuItems(schema);
// menu.fullMenu[0].push(annotationMenuItem);

// const info = {
//   name: 'edit-Example',
//   users: document.querySelector('#users'),
// };
// // document.querySelector('#changedoc').addEventListener('click', (e) => {
// //   GET('/collab-backend/docs/').then(
// //     (data) => showDocList(e.target, JSON.parse(data)),
// //     (err) => report.failure(err)
// //   );
// // });

// function userString(n) {
//   return '(' + n + ' user' + (n === 1 ? '' : 's') + ')';
// }
// let docList;
// function showDocList(nodex, list) {
//   if (docList) {
//     docList.parentNode.removeChild(docList);
//   }

//   const ul = (docList = document.body.appendChild(crel('ul', { class: 'doclist' })));
//   list.forEach((doc) => {
//     ul.appendChild(crel('li', { 'data-name': doc.id }, doc.id + ' ' + userString(doc.users)));
//   });
//   ul.appendChild(
//     crel(
//       'li',
//       {
//         'data-new': 'true',
//         style: 'border-top: 1px solid silver; margin-top: 2px',
//       },
//       'Create a new document'
//     )
//   );

//   const rect = nodex.getBoundingClientRect();
//   ul.style.top = rect.bottom + 10 + pageYOffset - ul.offsetHeight + 'px';
//   ul.style.left = rect.left - 5 + pageXOffset + 'px';

//   ul.addEventListener('click', (e: any) => {
//     if (e.target.nodeName === 'LI') {
//       ul.parentNode.removeChild(ul);
//       docList = null;
//       if (e.target.hasAttribute('data-name')) {
//         location.hash = '#edit-' + encodeURIComponent(e.target.getAttribute('data-name'));
//       } else {
//         newDocument();
//       }
//     }
//   });
// }

// document.addEventListener('click', () => {
//   if (docList) {
//     docList.parentNode.removeChild(docList);
//     docList = null;
//   }
// });

// function newDocument() {
//   const name = prompt('Name the new document', '');
//   if (name) {
//     location.hash = '#edit-' + encodeURIComponent(name);
//   }
// }
