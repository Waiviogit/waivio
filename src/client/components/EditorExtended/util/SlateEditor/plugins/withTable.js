import { Editor, Range, Point, Element } from 'slate';

const withTable = editor => {
  const { deleteForward, insertBreak } = editor;

  /* eslint-disable no-param-reassign */
  editor.deleteForward = unit => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [cell] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'tableCell',
      });

      const prevNodePath = Editor.after(editor, selection);
      const [tableNode] = Editor.nodes(editor, {
        at: prevNodePath,
        match: n => !Editor.isEditor(n) && Element.isElement && n.type === 'tableCell',
      });

      if (cell) {
        const [, cellPath] = cell;
        const end = Editor.end(editor, cellPath);

        if (Point.equals(selection.anchor, end)) {
          return;
        }
      }
      if (!cell && tableNode) {
        return;
      }
    }

    deleteForward(unit);
  };

  editor.insertBreak = () => {
    const { selection } = editor;

    if (selection) {
      const [table] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
      });

      if (table) {
        return;
      }
    }

    insertBreak();
  };

  return editor;
};

export default withTable;
