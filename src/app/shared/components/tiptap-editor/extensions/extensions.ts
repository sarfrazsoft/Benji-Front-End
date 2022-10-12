import { Injector } from '@angular/core';
import { mergeAttributes, Node } from '@tiptap/core';
import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { AngularNodeViewRenderer } from 'ngx-tiptap';
import {
  NodeviewCounterComponent,
  NodeviewEditableComponent,
  NodeviewIframeComponent,
  NodeviewImageComponent,
} from '../node-views';

export const CounterComponentExtension = (injector: Injector): Node => {
  return Node.create({
    name: 'angularCounterComponent',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
      return {
        count: {
          default: 0,
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: 'angular-component-counter',
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      return ['angular-component-counter', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
      return AngularNodeViewRenderer(NodeviewCounterComponent, { injector });
    },
  });
};

export const ImageComponentExtension = (injector: Injector): Node => {
  return Node.create({
    name: 'angularImageComponent',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
      return {
        lessonRunCode: {
          default: null,
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: 'benji-nodeview-image',
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      return ['benji-nodeview-image', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
      const renderer = AngularNodeViewRenderer(NodeviewImageComponent, { injector });
      return renderer;
    },
  });
};

export const IframeComponentExtension = (injector: Injector): Node => {
  return Node.create({
    name: 'angularIframeComponent',
    group: 'block',
    atom: true,
    draggable: true,

    addAttributes() {
      return {
        count: {
          default: 0,
        },
        lessonRunCode: {
          default: null,
        },
      };
    },

    parseHTML() {
      return [
        {
          tag: 'angular-component-iframe',
        },
      ];
    },

    renderHTML({ HTMLAttributes }) {
      return ['angular-component-iframe', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
      const renderer = AngularNodeViewRenderer(NodeviewIframeComponent, { injector });
      return renderer;
    },
  });
};

export const EditableComponentExtension = (injector: Injector): Node => {
  return Node.create({
    name: 'angularEditableComponent',
    group: 'block',
    content: 'inline*',

    parseHTML() {
      return [{ tag: 'angular-component-editable' }];
    },

    renderHTML({ HTMLAttributes }) {
      return ['angular-component-editable', mergeAttributes(HTMLAttributes), 0];
    },

    addNodeView() {
      return AngularNodeViewRenderer(NodeviewEditableComponent, { injector });
    },
  });
};
