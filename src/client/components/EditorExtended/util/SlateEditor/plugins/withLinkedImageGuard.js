import { Editor, Transforms, Element as SlateElement } from 'slate';

const isLinkedVoidImage = editor => {
  if (!editor.selection) return null;
  const linkEntry = Editor.above(editor, {
    match: n => SlateElement.isElement(n) && n.type === 'link',
  });

  if (!linkEntry) return null;

  const [linkNode] = linkEntry;
  const hasOnlyImage =
    (linkNode.children || []).length === 1 &&
    SlateElement.isElement(linkNode.children[0]) &&
    linkNode.children[0].type === 'image';

  return hasOnlyImage ? linkEntry : null;
};

const withLinkedImageGuard = editor => {
  const { insertText, insertBreak } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.insertText = text => {
    const linkEntry = isLinkedVoidImage(editor);

    if (linkEntry) {
      const [, linkPath] = linkEntry;
      const after = Editor.after(editor, linkPath);

      if (after) Transforms.select(editor, after);
    }
    insertText(text);
  };

  // eslint-disable-next-line no-param-reassign
  editor.insertBreak = () => {
    const linkEntry = isLinkedVoidImage(editor);

    if (linkEntry) {
      const [, linkPath] = linkEntry;
      const after = Editor.after(editor, linkPath);

      if (after) Transforms.select(editor, after);

      return;
    }
    insertBreak();
  };

  return editor;
};

export default withLinkedImageGuard;
