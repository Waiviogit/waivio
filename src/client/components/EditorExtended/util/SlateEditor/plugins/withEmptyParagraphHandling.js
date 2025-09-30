import { Editor, Range, Transforms, Node, Path } from 'slate';

const ZW = /\u200B/g;
const isParagraph = n => Element.isElement(n) && n.type === 'paragraph';
const isVisuallyEmptyParagraph = node =>
  isParagraph(node) &&
  Node.string(node)
    .replace(ZW, '')
    .trim() === '';

const withEmptyParagraphHandling = editor => {
  const { deleteBackward, deleteForward } = editor;

  // eslint-disable-next-line no-param-reassign,consistent-return
  editor.deleteBackward = unit => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const { path } = selection.anchor;
      const selectedElementPath = path.slice(0, -1);

      try {
        if (!Node.has(editor, selectedElementPath)) return deleteBackward(unit);

        const selectedElement = Node.descendant(editor, selectedElementPath);

        // ⬇️ Курсор саме на початку абзацу, і абзац «візуально порожній»
        if (
          Editor.isStart(editor, selection.anchor, selectedElementPath) &&
          isVisuallyEmptyParagraph(selectedElement)
        ) {
          const isOnlyParagraph = editor.children.length === 1 && selectedElementPath[0] === 0;

          const prevPath = Path.hasPrevious(selectedElementPath)
            ? Path.previous(selectedElementPath)
            : null;
          const [prevNode] =
            prevPath && Node.has(editor, prevPath) ? Editor.node(editor, prevPath) : [null];

          const nextPath = Path.next(selectedElementPath);
          const [nextNode] = Node.has(editor, nextPath) ? Editor.node(editor, nextPath) : [null];

          const isBeforeImage = nextNode && ['image', 'video'].includes(nextNode.type);

          // якщо перед зображенням/відео і це перший абзац — виділяємо наступний блок замість видалення плейсхолдера
          if (isBeforeImage && selectedElementPath[0] === 0) {
            // якщо картинка вже виділена — просто прибираємо пустий абзац
            const isImageSelected =
              editor.selection &&
              Range.isExpanded(editor.selection) &&
              editor.selection.anchor.path[0] === nextPath[0] &&
              editor.selection.focus.path[0] === nextPath[0];

            if (isImageSelected) {
              Transforms.removeNodes(editor, { at: selectedElementPath });

              // eslint-disable-next-line consistent-return
              return;
            }
            Transforms.select(editor, Editor.range(editor, nextPath));

            // eslint-disable-next-line consistent-return
            return;
          }

          if (prevNode && !['image', 'video'].includes(prevNode.type) && !isOnlyParagraph) {
            Transforms.removeNodes(editor, { at: selectedElementPath });

            const newPath = prevPath;
            const endPoint = Editor.end(editor, newPath);

            Transforms.select(editor, { anchor: endPoint, focus: endPoint });

            // eslint-disable-next-line consistent-return
            return;
          }
        }
      } catch (e) {
        console.warn('Error in withEmptyParagraphHandling deleteBackward:', e);
      }
    }

    deleteBackward(unit);
  };

  // eslint-disable-next-line consistent-return,no-param-reassign
  editor.deleteForward = unit => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const { path } = selection.anchor;
      const selectedElementPath = path.slice(0, -1);

      try {
        if (!Node.has(editor, selectedElementPath)) return deleteForward(unit);

        const selectedElement = Node.descendant(editor, selectedElementPath);

        if (
          Editor.isEnd(editor, selection.anchor, selectedElementPath) &&
          isVisuallyEmptyParagraph(selectedElement)
        ) {
          const isOnlyParagraph = editor.children.length === 1 && selectedElementPath[0] === 0;

          const nextPath = Path.next(selectedElementPath);
          const [nextNode] = Node.has(editor, nextPath) ? Editor.node(editor, nextPath) : [null];

          if (nextNode && ['image', 'video'].includes(nextNode.type) && !isOnlyParagraph) {
            Transforms.removeNodes(editor, { at: selectedElementPath });

            const newPath = Path.hasPrevious(nextPath) ? Path.previous(nextPath) : null;

            if (newPath) {
              const endPoint = Editor.end(editor, newPath);

              Transforms.select(editor, { anchor: endPoint, focus: endPoint });
            } else {
              Transforms.select(editor, Editor.start(editor, []));
            }

            // eslint-disable-next-line consistent-return
            return;
          }
        }
      } catch (e) {
        console.warn('Error in withEmptyParagraphHandling deleteForward:', e);
      }
    }

    deleteForward(unit);
  };

  return editor;
};

export default withEmptyParagraphHandling;
