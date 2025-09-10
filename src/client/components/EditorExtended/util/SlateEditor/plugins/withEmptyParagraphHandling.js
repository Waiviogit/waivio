import { Editor, Range, Transforms, Node, Path } from 'slate';

const withEmptyParagraphHandling = editor => {
  const { deleteBackward, deleteForward } = editor;

  // eslint-disable-next-line no-param-reassign
  editor.deleteBackward = unit => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const { path, offset } = selection.anchor;
      const selectedElementPath = path.slice(0, -1);

      try {
        if (!Node.has(editor, selectedElementPath)) {
          deleteBackward(unit);
          return;
        }
        const selectedElement = Node.descendant(editor, selectedElementPath);

        // Check if we're at the beginning of an empty paragraph
        if (
          offset === 0 &&
          selectedElement.type === 'paragraph' &&
          selectedElement.children?.[0]?.text === ''
        ) {
          const prevPath = selectedElementPath.every(p => !p)
            ? [0]
            : Path.previous(selectedElementPath);
          const [prevNode] = Node.has(editor, prevPath) ? Editor.node(editor, prevPath) : [null];

          // If previous node is not an image/video, remove the empty paragraph and keep cursor at the same visual position
          if (prevNode && !['image', 'video'].includes(prevNode.type)) {
            Transforms.removeNodes(editor, { at: selectedElementPath });

            // Position cursor at the end of the previous paragraph
            const newPath = Path.previous(selectedElementPath);

            if (newPath && newPath[0] >= 0) {
              const [newNode] = Editor.node(editor, newPath);

              if (newNode && newNode.children) {
                const lastChildIndex = newNode.children.length - 1;
                const lastChild = newNode.children[lastChildIndex];

                if (lastChild && lastChild.text !== undefined) {
                  Transforms.select(editor, {
                    anchor: { path: [...newPath, lastChildIndex], offset: lastChild.text.length },
                    focus: { path: [...newPath, lastChildIndex], offset: lastChild.text.length },
                  });
                } else {
                  Transforms.select(editor, Editor.end(editor, newPath));
                }
              } else {
                Transforms.select(editor, Editor.end(editor, newPath));
              }
            } else {
              Transforms.select(editor, Editor.start(editor, []));
            }

            return;
          }
        }
      } catch (error) {
        console.warn('Error in withEmptyParagraphHandling deleteBackward:', error);
      }
    }

    deleteBackward(unit);
  };

  // eslint-disable-next-line no-param-reassign
  editor.deleteForward = unit => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const { path, offset } = selection.anchor;
      const selectedElementPath = path.slice(0, -1);

      try {
        if (!Node.has(editor, selectedElementPath)) {
          deleteForward(unit);
          return;
        }
        const selectedElement = Node.descendant(editor, selectedElementPath);

        // Check if we're at the end of an empty paragraph
        if (
          offset === selectedElement.children?.[0]?.text?.length &&
          selectedElement.type === 'paragraph' &&
          selectedElement.children?.[0]?.text === ''
        ) {
          const nextPath = Path.next(selectedElementPath);
          const [nextNode] = Node.has(editor, nextPath) ? Editor.node(editor, nextPath) : [null];

          // If next node is an image/video, remove the empty paragraph and keep cursor at the same visual position
          if (nextNode && ['image', 'video'].includes(nextNode.type)) {
            Transforms.removeNodes(editor, { at: selectedElementPath });

            // Position cursor at the beginning of the next paragraph (if any)
            const newPath = Path.previous(selectedElementPath);

            if (newPath && newPath[0] >= 0) {
              const [newNode] = Editor.node(editor, newPath);

              if (newNode && newNode.children) {
                const lastChildIndex = newNode.children.length - 1;
                const lastChild = newNode.children[lastChildIndex];

                if (lastChild && lastChild.text !== undefined) {
                  Transforms.select(editor, {
                    anchor: { path: [...newPath, lastChildIndex], offset: lastChild.text.length },
                    focus: { path: [...newPath, lastChildIndex], offset: lastChild.text.length },
                  });
                } else {
                  Transforms.select(editor, Editor.end(editor, newPath));
                }
              } else {
                Transforms.select(editor, Editor.end(editor, newPath));
              }
            } else {
              Transforms.select(editor, Editor.start(editor, []));
            }

            return;
          }
        }
      } catch (error) {
        console.warn('Error in withEmptyParagraphHandling deleteForward:', error);
      }
    }

    deleteForward(unit);
  };

  return editor;
};

export default withEmptyParagraphHandling;
