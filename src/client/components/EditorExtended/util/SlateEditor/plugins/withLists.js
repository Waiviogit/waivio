import { Editor, Range, Element, Transforms, Node } from 'slate';

const withLists = editor => {
  const { deleteBackward } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.deleteBackward = unit => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [list] = Editor.nodes(editor, {
        match: n =>
          (!Editor.isEditor(n) && Element.isElement(n) && n.type === 'orderedList') ||
          n.type === 'unorderedList',
      });
      const selectedLeaf = Node.descendant(editor, editor.selection.anchor.path);

      if (list && selectedLeaf.text === '') {
        Transforms.setNodes(editor, { type: 'paragraph' });
        Transforms.liftNodes(editor);

        return;
      }
    }
    deleteBackward(unit);
  };

  return editor;
};

export default withLists;
