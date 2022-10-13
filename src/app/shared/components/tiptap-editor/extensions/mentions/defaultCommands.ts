import { SlashMenuGroups, SlashMenuItem } from './SlashMenuItem';

export const defaultCommands: Array<Array<SlashMenuItem>> = [
  [
    new SlashMenuItem(
      'Image',
      SlashMenuGroups.MEDIA,
      (editor, range) => {
        const lessonRunCode = editor.options?.editorProps?.attributes?.['lessonRunCode'];

        return editor
          .chain()
          .focus()
          .deleteRange(range)
          .insertContent(`<benji-nodeview-image lessonRunCode="${lessonRunCode}"></benji-nodeview-image>`)
          .run();
      },
      ['image', 'picture'],
      'image.svg',
      'Display an image'
    ),

    // new SlashMenuItem(
    //   'Embed',
    //   SlashMenuGroups.MEDIA,
    //   (editor, range) => {
    //     const lessonRunCode = editor.options?.editorProps?.attributes?.['lessonRunCode'];

    //     return editor
    //       .chain()
    //       .focus()
    //       .deleteRange(range)
    //       .insertContent(`<angular-component-iframe></angular-component-iframe>`)
    //       .run();
    //   },
    //   ['iframe', 'link'],
    //   'embed.svg',
    //   'Display an iframe'
    // ),
  ],
  [
    // Command for creating a level 1 heading
    new SlashMenuItem(
      'Heading',
      SlashMenuGroups.HEADINGS,
      (editor: any, range) => {
        return editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run();
      },
      ['h', 'heading1', 'h1'],
      'large-heading.svg',
      'Used for a top-level heading'
    ),

    // Command for creating a level 2 heading
    new SlashMenuItem(
      'Heading 2',
      SlashMenuGroups.HEADINGS,
      (editor: any, range) => {
        return editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run();
      },
      ['h2', 'heading2', 'subheading'],
      'medium-heading.svg',
      'Used for key sections'
    ),

    // Command for creating a level 3 heading
    new SlashMenuItem(
      'Heading 3',
      SlashMenuGroups.HEADINGS,
      (editor: any, range) => {
        return editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run();
      },
      ['h3', 'heading3', 'subheading'],
      'small-heading.svg',
      'Used for subsections and group headings'
    ),

    // Command for creating an ordered list
    new SlashMenuItem(
      'Numbered List',
      SlashMenuGroups.BASIC_BLOCKS,
      (editor: any, range) => {
        return editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
      ['li', 'list', 'numberedlist', 'numbered list'],
      'numbered-list.svg',
      'Used to display a numbered list'
    ),

    // Command for creating a bullet list
    new SlashMenuItem(
      'Bulleted List',
      SlashMenuGroups.BASIC_BLOCKS,
      (editor: any, range) => {
        return editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
      ['ul', 'list', 'bulletlist', 'bullet list'],
      'bulleted-list.svg',
      'Used to display an unordered list'
    ),

    // Command for creating a task list
    new SlashMenuItem(
      'To-do list',
      SlashMenuGroups.BASIC_BLOCKS,
      (editor: any, range) => {
        return editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
      ['ul', 'list', 'bulletlist', 'bullet list'],
      'todo-list.svg',
      'Used to display an unordered list'
    ),
  ],
  // Command for creating a paragraph (pretty useless)
  // paragraph: new SlashMenuItem(
  //   'Paragraph',
  //   SlashMenuGroups.BASIC_BLOCKS,
  //   (editor: any, range) => {
  //     return editor.chain().focus().deleteRange(range).addNewBlockAsSibling().run();
  //   },
  //   ['p'],
  //   'RiText',
  //   'Used for the body of your document'
  // ),

  //     replaceRangeWithNode(editor, range, node);

  //     return true;
  //   },
  //   ["ol", "orderedlist"],
  //   OrderedListIcon,
  //   "Used to display an ordered (enumerated) list item"
  // ),

  // Command for creating a blockquote
  // blockquote: new SlashCommand(
  //   "Block Quote",
  //   CommandGroup.BASIC_BLOCKS,
  //   (editor, range) => {
  //     const paragraph = editor.schema.node("paragraph");
  //     const node = editor.schema.node(
  //       "blockquote",
  //       { "block-id": uniqueId.generate() },
  //       paragraph
  //     );

  //     replaceRangeWithNode(editor, range, node);

  //     return true;
  //   },
  //   ["quote", "blockquote"],
  //   QuoteIcon,
  //   "Used to make a quote stand out",
  //   "Ctrl+Shift+B"
  // ),

  // Command for creating a horizontal rule
  // horizontalRule: new SlashCommand(
  //   "Horizontal Rule",
  //   CommandGroup.BASIC_BLOCKS,
  //   (editor, range) => {
  //     const node = editor.schema.node("horizontalRule", {
  //       "block-id": uniqueId.generate(),
  //     });

  //     // insert horizontal rule, create a new block after the horizontal rule if applicable
  //     // and put the cursor in the block after the horizontal rule.
  //     editor
  //       .chain()
  //       .focus()
  //       .replaceRangeAndUpdateSelection(range, node)
  //       .command(({ tr, dispatch }) => {
  //         if (dispatch) {
  //           // the node immediately after the cursor
  //           const nodeAfter = tr.selection.$to.nodeAfter;

  //           // the position of the cursor
  //           const cursorPos = tr.selection.$to.pos;

  //           // check if there is no node after the cursor (end of document)
  //           if (!nodeAfter) {
  //             // create a new block of the default type (probably paragraph) after the cursor
  //             const { parent } = tr.selection.$to;
  //             const node = parent.type.contentMatch.defaultType?.create();

  //             if (node) {
  //               tr.insert(cursorPos, node);
  //             }
  //           }

  //           // try to put the cursor at the start of the node directly after the inserted horizontal rule
  //           tr.doc.nodesBetween(cursorPos, cursorPos + 1, (node, pos) => {
  //             if (node.type.name !== "horizontalRule") {
  //               tr.setSelection(TextSelection.create(tr.doc, pos));
  //             }
  //           });
  //         }

  //         return true;
  //       })
  //       .scrollIntoView()
  //       .run();
  //     return true;
  //   },
  //   ["hr", "horizontalrule"],
  //   SeparatorIcon,
  //   "Used to separate sections with a horizontal line"
  // ),

  // Command for creating a table
  // table: new SlashCommand(
  //   "Table",
  //   CommandGroup.BASIC_BLOCKS,
  //   (editor, range) => {
  //     editor.chain().focus().deleteRange(range).run();
  //     // TODO: add blockid, pending https://github.com/ueberdosis/tiptap/pull/1469
  //     editor
  //       .chain()
  //       .focus()
  //       .insertTable({ rows: 1, cols: 2, withHeaderRow: false })
  //       .scrollIntoView()
  //       .run();
  //     return true;
  //   },
  //   ["table", "database"],
  //   TableIcon,
  //   "Used to create a simple table"
  // ),
];

export default defaultCommands;
