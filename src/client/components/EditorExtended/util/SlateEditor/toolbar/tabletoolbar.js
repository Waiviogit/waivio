import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { Editor, Transforms, Range } from 'slate';
import { ReactEditor } from 'slate-react';
import { insertCells } from '../utils/table';
import { getSelection } from '../../index';

const TableToolbar = props => {
  const { editor, editorNode, intl } = props;
  const tableToolbarRef = useRef(null);
  const { selection } = editor;

  useEffect(() => {
    if (!tableToolbarRef.current || !editorNode) return;
    if (typeof window !== 'undefined') {
      const toolbarNode = tableToolbarRef.current;
      const nativeSelection = getSelection(window);
      const nodeFocused = nativeSelection.focusNode;
      const table = nodeFocused?.parentNode.closest('table');

      if (!table) return;
      const tableBoundary = table.getBoundingClientRect();
      const parentBoundary = editorNode.getBoundingClientRect();
      const left = tableBoundary.left - parentBoundary.left;

      toolbarNode.style.top = `${tableBoundary.top - parentBoundary.top - 55}px`;
      toolbarNode.style.left = left;
      toolbarNode.style.position = 'absolute';
    }
  }, [editor, selection]);

  const handleRemoveTable = e => {
    const [, path] = getParentTable(selection.anchor.path);

    Transforms.removeNodes(editor, {
      at: path,
      mode: 'highest',
    });

    if (e) ReactEditor.focus(editor);
  };

  const handleInsertRow = () => {
    if (!!selection && Range.isCollapsed(selection)) {
      const [oldTable, path] = getParentTable(selection.anchor.path);

      handleRemoveTable();
      insertCells(editor, oldTable, path, 'row');

      Transforms.select(editor, selection.anchor.path);
      ReactEditor.focus(editor);
    }
  };

  const getParentTable = path => {
    const parent = Editor.parent(editor, path);

    if (parent[0].type === 'table') {
      return parent;
    }

    return getParentTable(parent[1]);
  };

  const handleInsertColumn = () => {
    if (!!selection && Range.isCollapsed(selection)) {
      const [table, path] = getParentTable(selection.anchor.path);

      handleRemoveTable(); // Assuming this function removes the table structure
      insertCells(editor, table, path, 'columns');

      Transforms.select(editor, selection.anchor.path);
      ReactEditor.focus(editor);
    }
  };

  return (
    <div className="table-toolbar" ref={tableToolbarRef}>
      <div className="table-toolbar_item" onClick={handleInsertRow}>
        {intl.formatMessage({
          id: 'add_row',
          defaultMessage: '+Row',
        })}
      </div>
      <div className="table-toolbar_item" onClick={handleInsertColumn}>
        {intl.formatMessage({
          id: 'add_column',
          defaultMessage: '+Column',
        })}
      </div>
      <div className="table-toolbar_item" onClick={handleRemoveTable}>
        {' '}
        {intl.formatMessage({
          id: 'remove_table',
          defaultMessage: 'Remove table',
        })}
      </div>
    </div>
  );
};

TableToolbar.propTypes = {
  editor: PropTypes.shape().isRequired,
  editorNode: PropTypes.node.isRequired,
  intl: PropTypes.shape().isRequired,
};

TableToolbar.defaultProps = {
  onToggle: () => {},
};

export default TableToolbar;
