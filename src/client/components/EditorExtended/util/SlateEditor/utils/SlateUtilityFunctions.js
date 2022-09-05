import { Editor, Transforms, Element as SlateElement } from 'slate';
import { ReactEditor } from 'slate-react';
import { BLOCKQUOTE, CODE_BLOCK, HEADING_BLOCKS, INLINE_CODE, REMOVE_FORMAT } from './constants';
import defaultToolbarGroups from '../toolbar/toolbarGroups';

const inlineButtons = defaultToolbarGroups.filter(i => ['inline', 'link'].includes(i.type));

const alignment = ['alignLeft', 'alignRight', 'alignCenter'];
const list_types = ['orderedList', 'unorderedList'];

export const sizeMap = {
  small: '0.75em',
  normal: '1em',
  medium: '1.75em',
  huge: '2.5em',
};
export const fontFamilyMap = {
  sans: 'Helvetica,Arial, sans serif',
  serif: 'Georgia, Times New Roaman,serif',
  monospace: 'Monaco, Courier New,monospace',
};
export const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(editor, format);
  const isList = list_types.includes(format);
  const isIndent = alignment.includes(format);
  const isAligned = alignment.some(alignmentType => isBlockActive(editor, alignmentType));
  const isCode = format === CODE_BLOCK;

  if (isCode && !isActive) {
    Transforms.setNodes(editor, {
      type: format,
      lang: 'javascript',
    });

    return;
  }

  if (isAligned && isIndent) {
    Transforms.unwrapNodes(editor, {
      match: n => alignment.includes(!Editor.isEditor(n) && SlateElement.isElement(n) && n.type),
      split: true,
    });
  }

  if (isIndent) {
    Transforms.wrapNodes(editor, {
      type: format,
      children: [],
    });

    return;
  }

  if (isIndent) {
    Transforms.wrapNodes(editor, {
      type: format,
      children: [],
    });

    return;
  }
  Transforms.unwrapNodes(editor, {
    match: n => list_types.includes(!Editor.isEditor(n) && SlateElement.isElement(n) && n.type),
    split: true,
  });
  let type = '';

  if (isActive) type = 'paragraph';
  else if (isList) type = 'listItem';
  else type = format;

  Transforms.setNodes(editor, {
    type,
  });
  if (isList && !isActive) {
    Transforms.wrapNodes(editor, {
      type: format,
      children: [],
    });
  }
};
export const addMarkData = (editor, data) => {
  Editor.addMark(editor, data.format, data.value);
};

export const removeAllInlineFormats = editor => {
  [...inlineButtons, { format: INLINE_CODE }, { format: BLOCKQUOTE }].forEach(i => {
    Editor.removeMark(editor, i.format);
    if ( i.format === BLOCKQUOTE ) {
      toggleBlock(editor, BLOCKQUOTE);
    }
  });
};

export const toggleMark = (editor, format) => {
  const { selection } = editor;

  if (format === REMOVE_FORMAT) {
    removeAllInlineFormats(editor);
    const selected = editor.children[selection.anchor.path[0]];

    if (HEADING_BLOCKS.includes(selected.type)) {
      Transforms.setNodes(editor, {
        type: 'paragraph',
      });
    }

    return;
  }
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
  ReactEditor.focus(editor);
};
export const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor);

  return marks ? marks[format] === true : false;
};

export const isBlockActive = (editor, format) => {
  const [match] = Editor.nodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  });

  return !!match;
};

export const focusEditorToEnd = editor => {
  Transforms.select(editor, Editor.end(editor, []));
  Transforms.move(editor, { distance: 1, unit: 'line' });
  ReactEditor.focus(editor);
};

export const resetEditorState = editor => {
  Transforms.delete(editor, {
    at: {
      anchor: Editor.start(editor, []),
      focus: Editor.end(editor, []),
    },
  });
};
