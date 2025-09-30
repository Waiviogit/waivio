import { Editor, Range, Transforms, Node, Path, Element } from 'slate';

const ZW = /\u200B/g;
const isParagraph = n => Element.isElement(n) && n.type === 'paragraph';
const isCodeBlock = n => Element.isElement(n) && n.type === 'code';
const isVisuallyEmptyParagraph = node =>
  isParagraph(node) &&
  Node.string(node)
    .replace(ZW, '')
    .trim() === '';
const isVisuallyEmptyCodeBlock = node =>
  isCodeBlock(node) &&
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
        if (!Node.has(editor, selectedElementPath)) {
          // Reset selection if path is invalid
          if (editor.children.length > 0) {
            Transforms.select(editor, Editor.start(editor, [0]));
          }

          return deleteBackward(unit);
        }

        const selectedElement = Node.descendant(editor, selectedElementPath);

        // Handle empty code blocks - convert to paragraph
        if (
          Editor.isStart(editor, selection.anchor, selectedElementPath) &&
          isVisuallyEmptyCodeBlock(selectedElement)
        ) {
          Transforms.setNodes(editor, { type: 'paragraph' }, { at: selectedElementPath });

          // eslint-disable-next-line consistent-return
          return;
        }

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
        // Reset selection if there's an error
        try {
          if (editor.children.length > 0) {
            Transforms.select(editor, Editor.start(editor, [0]));
          }
        } catch (resetError) {
          console.warn('Error resetting selection in deleteBackward:', resetError);
        }
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
        if (!Node.has(editor, selectedElementPath)) {
          // Reset selection if path is invalid
          if (editor.children.length > 0) {
            Transforms.select(editor, Editor.start(editor, [0]));
          }

          return deleteForward(unit);
        }

        const selectedElement = Node.descendant(editor, selectedElementPath);

        // Handle empty code blocks - convert to paragraph
        if (
          Editor.isEnd(editor, selection.anchor, selectedElementPath) &&
          isVisuallyEmptyCodeBlock(selectedElement)
        ) {
          Transforms.setNodes(editor, { type: 'paragraph' }, { at: selectedElementPath });

          // eslint-disable-next-line consistent-return
          return;
        }

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
        // Reset selection if there's an error
        try {
          if (editor.children.length > 0) {
            Transforms.select(editor, Editor.start(editor, [0]));
          }
        } catch (resetError) {
          console.warn('Error resetting selection in deleteForward:', resetError);
        }
      }
    }

    deleteForward(unit);
  };

  return editor;
};

export default withEmptyParagraphHandling;
