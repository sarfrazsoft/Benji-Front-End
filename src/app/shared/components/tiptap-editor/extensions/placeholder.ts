import Placeholder from '@tiptap/extension-placeholder';

export function GetPlaceholderExtension() {
  return Placeholder.configure({
    emptyEditorClass: 'is-editor-empty',
    emptyNodeClass: 'is-empty',
    showOnlyWhenEditable: true,
    showOnlyCurrent: false,
    includeChildren: false,
    placeholder: ({ editor, node, pos, hasAnchor }) => {
      if (node.type.name === 'heading') {
        const level = node.attrs?.level ?? '';
        return 'Heading ' + level;
      }
      if (node.type.name === 'paragraph' && hasAnchor) {
        return 'Type / for commands';
      }
      if (node.type.name === 'paragraph' && !hasAnchor) {
        return '';
      }
      return 'Type / for commands';
    },
  });
}
