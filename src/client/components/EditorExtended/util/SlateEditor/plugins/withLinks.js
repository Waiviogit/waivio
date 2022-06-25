import { Transforms, Editor, Path, Range } from 'slate';

const withLinks = editor => {
  const { isInline, insertBreak } = editor;

  /* eslint-disable no-param-reassign */
  editor.isInline = element => (element.type === 'link' ? true : isInline(element));

  editor.insertBreak = () => {
    const [selectedElement, path] = Editor.parent(editor, editor.selection);

    if (selectedElement.type === 'link') {
      const endPoint = Range.end(editor.selection);
      const [selectedLeaf] = Editor.node(editor, endPoint);

      if (selectedLeaf.text.length === endPoint.offset) {
        if (Range.isExpanded(editor.selection)) {
          Transforms.delete(editor);
        }
        Transforms.select(editor, Path.next(path));
      }
    }

    insertBreak();
  };

  return editor;
};

export default withLinks;
