import { Editor, Range, Element, Transforms, Node, Path } from 'slate';

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
      try {
        if (!Node.has(editor, editor.selection.anchor.path)) {
          deleteBackward(unit);
          return;
        }
        const selectedLeaf = Node.descendant(editor, editor.selection.anchor.path);

        if (list && selectedLeaf.text === '') {
          Transforms.setNodes(editor, { type: 'paragraph' });
          Transforms.liftNodes(editor);

          return;
        }

        // Handle case when cursor is at the beginning of an empty paragraph before an image
        const { path, offset } = selection.anchor;

        if (offset === 0) {
          const selectedElementPath = path.slice(0, -1);

          if (!Node.has(editor, selectedElementPath)) {
            deleteBackward(unit);
            return;
          }
          const selectedElement = Node.descendant(editor, selectedElementPath);

          if (selectedElement.type === 'paragraph' && selectedElement.children?.[0]?.text === '') {
            const prevPath = selectedElementPath.every(p => !p)
              ? [0]
              : Path.previous(selectedElementPath);
            const [prevNode] = Node.has(editor, prevPath) ? Editor.node(editor, prevPath) : [null];

            // If previous node is an image/video or next node is image/video,
            // prevent default behavior to let the main handleKeyCommand handle this case
            if (prevNode && ['image', 'video'].includes(prevNode.type)) {
              return; // Let the main handleKeyCommand handle this case
            }

            // Also check if next node is image/video
            const nextPath = Path.next(selectedElementPath);
            const [nextNode] = Node.has(editor, nextPath) ? Editor.node(editor, nextPath) : [null];

            if (nextNode && ['image', 'video'].includes(nextNode.type)) {
              return; // Let the main handleKeyCommand handle this case
            }
          }
        }
      } catch (error) {
        console.warn('Error in withLists deleteBackward:', error);
      }
    }
    deleteBackward(unit);
  };

  return editor;
};

export default withLists;
