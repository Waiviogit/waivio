import { Editor, createEditor, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { ReactEditor, withReact } from 'slate-react';
import withEmbeds from '../plugins/withEmbeds';
import withTables from '../plugins/withTable';
import withLinks from '../plugins/withLinks';
import { createObjectNode } from './embed';

export const isAllBlockSelected = editor => {
  const { selection } = editor;
  const selectedText = Editor.string(editor, selection);
  let textBlock;

  if (selection !== null && selection.anchor !== null) {
    textBlock = editor.children[selection.anchor.path[0]]?.children?.reduce(
      (acc, current) => acc + current.text,
      '',
    );
  }

  return selectedText?.trim() === textBlock?.trim();
};

export const createSlateEditor = () =>
  withHistory(withEmbeds(withTables(withLinks(withReact(createEditor())))));

export const insertObject = (editor, url, text) => {
  Transforms.insertNodes(editor, [createObjectNode(url, text), { text: ' ' }]);
  ReactEditor.focus(editor);
};
