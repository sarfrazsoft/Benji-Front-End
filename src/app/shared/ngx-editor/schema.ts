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

const video: NodeSpec = {
  attrs: {
    src: {},
    poster: { default: null },
  },
  group: 'block',
  draggable: true,
  parseDOM: [
    {
      tag: 'video',
      getAttrs(dom: HTMLElement) {
        const source = dom.querySelector('source');
        return {
          src: source.getAttribute('src'),
          poster: dom.getAttribute('poster'),
        };
      },
    },
  ],
  toDOM(node) {
    const { src, poster } = node.attrs;
    return ['video', { controls: '', draggable: 'false', poster }, ['source', { src }]];
  },
};

const videoIframe: NodeSpec = {
  attrs: {
    src: {},
    poster: { default: null },
  },
  group: 'block',
  draggable: true,
  parseDOM: [
    {
      tag: 'iframe',
      getAttrs(dom: HTMLElement) {
        const source = dom.querySelector('source');
        return {
          src: source.getAttribute('src'),
          poster: dom.getAttribute('poster'),
        };
      },
    },
  ],
  toDOM(node) {
    const { src, poster } = node.attrs;
    return [
      'div',
      {
        class: 'video-iframe-container',
      },
      [
        'iframe',
        {
          class: 'responsive-iframe',
          controls: '',
          allowfullscreen: '',
          draggable: 'false',
          poster,
          src,
        },
        ['source', { src }],
      ],
    ];
  },
};

const nodes: any = Object.assign({}, basicNodes, {
  code_mirror: codeBlock,
  video: video,
  videoIframe: videoIframe,
});

const schema: any = new Schema({
  nodes,
  marks: basicMarks as any,
});

export default schema;
