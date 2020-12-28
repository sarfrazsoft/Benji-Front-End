import { marks as basicMarks, nodes as basicNodes } from 'ngx-editor';
import { Node as ProsemirrorNode, NodeSpec, Schema } from 'prosemirror-model';

const codeBlock: NodeSpec = {
  group: 'block',
  attrs: {
    text: { default: '' },
    language: { default: 'text/javascript' },
  },
  parseDOM: [
    {
      tag: 'pre',
      getAttrs: (dom: HTMLElement) => {
        return {
          text: dom.textContent,
          language: dom.getAttribute('data-language') || 'text/plain',
        };
      },
    },
  ],
  toDOM(node: ProsemirrorNode) {
    return ['pre', { 'data-language': node.attrs.language }, node.attrs.text];
  },
};

const nodes = Object.assign({}, basicNodes, {
  code_mirror: codeBlock,
});

const schema = new Schema({
  nodes,
  marks: basicMarks,
});

export default schema;
