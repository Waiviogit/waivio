import { isEmpty } from 'lodash';
import { Transforms, Editor, Path } from 'slate';
import { createEmptyNode } from './embed';

export const insertTable = editor => {
  if (!editor.selection) {
    // If no selection, insert at the end of the document
    const endPath = [editor.children.length];
    const newTable = createTableNode(
      Array.from({ length: 2 }, () => Array.from({ length: 2 }, () => '')),
    );

    Transforms.insertNodes(editor, createEmptyNode(editor), {
      at: endPath,
    });
    Transforms.insertNodes(editor, newTable, {
      at: endPath,
    });

    return;
  }

  const rows = 2;
  const columns = 2;
  const cellText = Array.from({ length: rows }, () => Array.from({ length: columns }, () => ''));
  const newTable = createTableNode(cellText);
  const nextPath = Path.next(editor.selection.anchor.path.slice(0, -1));

  Transforms.insertNodes(editor, createEmptyNode(editor), {
    at: nextPath,
  });
  Transforms.insertNodes(editor, newTable, {
    at: nextPath,
  });
};

const createRow = (cellText, action) => {
  const newRow = Array.from(cellText, value => createTableCell(value, action));

  return {
    type: 'tableRow',
    children: newRow,
  };
};

const createTableCell = text => ({
  type: 'tableCell',
  children: [{ type: 'paragraph', children: [{ text: text || ' ' }] }],
});

const createTableNode = cellText => {
  const tableChildren = Array.from(cellText, value => createRow(value));

  return { type: 'table', children: tableChildren };
};

export const insertCells = (editor, tableNode, path, action) => {
  const table = { ...tableNode };

  if (action === 'row') {
    table.children = [
      ...table.children,
      {
        type: 'tableRow',
        children: Array.from({ length: table.children[0].children.length }, () =>
          createTableCell(''),
        ),
      },
    ];
  } else {
    table.children = table.children.reduce((acc, row) => {
      const newRow = [...row.children, createTableCell('')];

      acc.push({ type: 'tableRow', children: newRow });

      return acc;
    }, []);
  }

  Transforms.insertNodes(editor, table, {
    at: path,
  });
};

export const getParentTable = (path, editor) => {
  const parent = Editor.parent(editor, path);

  if (parent[0].type === 'table') {
    return parent;
  }

  return getParentTable(parent[1], editor);
};

export const getParentList = (path, editor, listType) => {
  if (isEmpty(path)) return null;

  const parent = Editor.parent(editor, path);

  if (parent[0].type === listType) {
    return parent;
  }

  return getParentList(parent[1], editor, listType);
};

export const isSingleEmptyCellTable = (editor, node) => {
  if (node.type !== 'table') return false;

  const [row] = node.children;

  if (row.children.length !== 1) return false;

  const [cell] = row.children;
  const [paragraph] = cell.children;

  return cell.children.length === 1 && (paragraph.text === '' || paragraph.children[0].text === '');
};
