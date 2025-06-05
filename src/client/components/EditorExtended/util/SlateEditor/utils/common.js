import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { createObjectNode } from './embed';

export const isAllBlockSelected = editor => {
  const { selection } = editor;
  const selectedText = Editor.string(editor, selection);
  let textBlock;

  if (selection !== null && selection.anchor !== null) {
    textBlock = editor.children[selection?.anchor?.path?.[0]]?.children?.reduce(
      (acc, current) => acc + current.text,
      '',
    );
  }

  return selectedText?.trim() === textBlock?.trim();
};

export const insertObject = (editor, url, text, withFocus) => {
  Transforms.insertNodes(editor, [createObjectNode(url, text), { text: ' ' }]);
  if (withFocus) ReactEditor.focus(editor);
};
