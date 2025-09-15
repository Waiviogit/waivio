import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { Transforms, Range, Editor, Element } from 'slate';
import { ReactEditor } from 'slate-react';
import { insertCells, getParentTable } from '../utils/table';

const TableToolbar = props => {
  const { editor, editorNode, intl } = props;
  const tableToolbarRef = useRef(null);
  const { selection } = editor;
  const [isTableFocused, setIsTableFocused] = useState(false);

  const checkTableFocus = () => {
    if (!selection) {
      setIsTableFocused(false);

      return false;
    }

    try {
      const [tableNode] = Editor.nodes(editor, {
        match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
      });

      const isInTable = !!tableNode;

      setIsTableFocused(isInTable);

      return isInTable;
    } catch (error) {
      console.warn('Error checking table focus:', error);
      setIsTableFocused(false);

      return false;
    }
  };

  useEffect(() => {
    if (!tableToolbarRef.current || !editorNode) return;

    const isInTable = checkTableFocus();

    if (!isInTable) {
      tableToolbarRef.current.classList.add('hidden');

      return;
    }

    if (typeof window !== 'undefined') {
      const toolbarNode = tableToolbarRef.current;

      try {
        const [tableNode] = Editor.nodes(editor, {
          match: n => !Editor.isEditor(n) && Element.isElement(n) && n.type === 'table',
        });

        if (!tableNode) {
          toolbarNode.classList.add('hidden');

          return;
        }

        const tableDomNode = ReactEditor.toDOMNode(editor, tableNode[0]);

        if (!tableDomNode) {
          toolbarNode.classList.add('hidden');

          return;
        }

        const tableBoundary = tableDomNode.getBoundingClientRect();
        const parentBoundary = editorNode.getBoundingClientRect();
        const left = tableBoundary.left - parentBoundary.left;

        toolbarNode.style.top = `${tableBoundary.top - parentBoundary.top - 55}px`;
        toolbarNode.style.left = `${left}px`;
        toolbarNode.style.position = 'absolute';
        toolbarNode.style.zIndex = '1000';
        toolbarNode.classList.remove('hidden');
      } catch (error) {
        console.warn('Error positioning table toolbar:', error);
        toolbarNode.classList.add('hidden');
      }
    }
  }, [editor, selection]);

  useEffect(() => {
    if (!tableToolbarRef.current || !editorNode || !isTableFocused) return;

    const handleResize = () => {
      const isInTable = checkTableFocus();

      if (isInTable) {
        const currentSelection = editor.selection;

        if (currentSelection) {
          Transforms.select(editor, currentSelection);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // eslint-disable-next-line consistent-return
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [editor, editorNode, isTableFocused]);

  const handleRemoveTable = e => {
    const [, path] = getParentTable(selection.anchor.path, editor);

    Transforms.removeNodes(editor, {
      at: path,
      mode: 'highest',
    });

    if (e) ReactEditor.focus(editor);
  };

  const handleInsertRow = () => {
    if (!!selection && Range.isCollapsed(selection)) {
      const [oldTable, path] = getParentTable(selection.anchor.path, editor);
      const [start] = Range.edges(selection);

      handleRemoveTable();
      insertCells(editor, oldTable, path, 'row');

      Transforms.select(editor, {
        anchor: { path: selection.anchor.path, offset: start.offset },
        focus: { path: selection.anchor.path, offset: start.offset },
      });
      ReactEditor.focus(editor);
    }
  };

  const handleInsertColumn = () => {
    if (!!selection && Range.isCollapsed(selection)) {
      const [table, path] = getParentTable(selection.anchor.path, editor);
      const [start] = Range.edges(selection);

      handleRemoveTable();
      insertCells(editor, table, path, 'columns');

      Transforms.select(editor, {
        anchor: { path: selection.anchor.path, offset: start.offset },
        focus: { path: selection.anchor.path, offset: start.offset },
      });
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
  editorNode: PropTypes.node,
  intl: PropTypes.shape().isRequired,
};

TableToolbar.defaultProps = {
  onToggle: () => {},
};

export default TableToolbar;
