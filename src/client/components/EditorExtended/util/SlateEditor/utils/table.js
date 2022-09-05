import { Transforms } from 'slate';
import paragraph from './paragraph';

export const insertTable = editor => {
  const rows = 2;
  const columns = 2;

  const cellText = Array.from({ length: rows }, () => Array.from({ length: columns }, () => ''));
  const newTable = createTableNode(cellText);

  Transforms.insertNodes(editor, newTable);
  Transforms.insertNodes(
    editor,
    { type: 'paragraph', children: [{ text: '' }] },
    { mode: 'highest' },
  );
};

const createRow = cellText => {
  const newRow = Array.from(cellText, value => createTableCell(value));

  return {
    type: 'tableRow',
    children: newRow,
  };
};

const createTableCell = text => ({
  type: 'tableCell',
  children: [{ type: 'paragraph', children: [{ text }] }],
});

const createTableNode = cellText => {
  const tableChildren = Array.from(cellText, value => createRow(value));

  return { type: 'table', children: tableChildren };
};

export const insertCells = (editor, tableNode, path, action) => {
  let existingText = Array.from(tableNode.children, rows =>
    Array.from(rows.children, arr => arr.children[0].text),
  );
  const columns = existingText[0].length;

  if (action === 'row') {
    existingText.push(Array(columns).fill(''));
  } else {
    existingText = Array.from(existingText, item => {
      item.push('');

      return item;
    });
  }
  const newTable = createTableNode(existingText);

  Transforms.insertNodes(editor, newTable, {
    at: path,
  });
};
