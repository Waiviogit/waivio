import { Transforms } from 'slate';

export const insertTable = (editor, at) => {
  const rows = 2;
  const columns = 2;
  const cellText = Array.from({ length: rows }, () => Array.from({ length: columns }, () => ''));
  const newTable = createTableNode(cellText);

  if (at) {
    Transforms.insertNodes(editor, newTable);
  } else {
    Transforms.insertNodes(editor, newTable);
    Transforms.insertNodes(
      editor,
      { type: 'paragraph', children: [{ text: '' }] },
      { mode: 'highest' },
    );
  }
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

export const insertNestedTable = editor => {
  const { selection } = editor;

  if (selection) {
    const { path } = selection.anchor;
    const node = editor.children[path[0]]?.children[path[1]].children[path[2]];

    if (node.type === 'tableCell') {
      insertTable(editor, path);
    }
  }
};
