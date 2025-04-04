import { Transforms, Editor } from 'slate';

export const insertTable = editor => {
  const rows = 2;
  const columns = 2;
  const cellText = Array.from({ length: rows }, () => Array.from({ length: columns }, () => ''));
  const newTable = createTableNode(cellText);

  Transforms.insertNodes(editor, newTable, {
    at: editor.selection.anchor.path,
  });
  Transforms.insertNodes(
    editor,
    { type: 'paragraph', children: [{ text: '' }] },
    { mode: 'highest' },
  );
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
  children: [{ type: 'paragraph', children: [{ text: text || '' }] }],
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

export const isSingleEmptyCellTable = (editor, node) => {
  if (node.type !== 'table') return false;

  const [row] = node.children;

  if (row.children.length !== 1) return false;

  const [cell] = row.children;
  const [paragraph] = cell.children;

  return cell.children.length === 1 && (paragraph.text === '' || paragraph.children[0].text === '');
};
