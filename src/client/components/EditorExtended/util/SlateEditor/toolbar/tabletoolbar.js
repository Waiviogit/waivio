import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { Editor, Transforms, Range, Element } from 'slate';
import { insertCells } from '../utils/table';
import { getSelection } from '../../index';

const TableToolbar = props => {
  const { editor, editorNode, intl } = props;
  const tableToolbarRef = useRef(null);
  const { selection } = editor;

  useEffect(() => {
    if (!tableToolbarRef.current || !editorNode) return;
    const toolbarNode = tableToolbarRef.current;
    const nativeSelection = getSelection(window);
    const nodeFocused = nativeSelection.focusNode;
    const table = nodeFocused.parentNode.closest('table');

    if (!table) return;
    const tableBoundary = table.getBoundingClientRect();
    const parentBoundary = editorNode.getBoundingClientRect();
    const left = tableBoundary.left - parentBoundary.left;

    toolbarNode.style.top = `${tableBoundary.top - parentBoundary.top - 55}px`;
    toolbarNode.style.left = left;
    toolbarNode.style.position = 'absolute';
  }, [editor, selection]);

  const handleRemoveTable = () => {
    Transforms.removeNodes(editor, {
      match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
      mode: 'highest',
    });
  };

  const handleInsertRow = () => {
    if (!!selection && Range.isCollapsed(selection)) {
      const [tableNode] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
      });

      if (tableNode) {
        const [oldTable, path] = tableNode;

        handleRemoveTable();
        insertCells(editor, oldTable, path, 'row');
      }
    }
  };

  const handleInsertColumn = () => {
    if (!!selection && Range.isCollapsed(selection)) {
      const [tableNode] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
      });

      if (tableNode) {
        const [oldTable, path] = tableNode;

        handleRemoveTable();
        insertCells(editor, oldTable, path, 'columns');
      }
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
