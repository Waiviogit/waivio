import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { ReactSVG } from 'react-svg';
import { Editor, Node, Transforms } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { createEmptyNode } from '../../util/SlateEditor/utils/embed';
import { insertTable } from '../../util/SlateEditor/utils/table';

const isNestedTable = editor => {
  const { selection } = editor;

  if (selection) {
    const [, path] = Editor.node(editor, selection);

    // Traverse up the node hierarchy to check for nested tables
    for (let i = path.length - 1; i >= 0; i--) {
      const ancestorPath = path.slice(0, i);
      const ancestorNode = Node.get(editor, ancestorPath);

      if (ancestorNode.type === 'table') {
        return true; // Found a nested table
      }
    }
  }

  return false; // No nested table found
};

const TableSideButton = props => {
  const editor = useSlate();
  const [anchorPath, setAnchor] = useState(editor.selection.anchor.path[0]);

  const onClick = () => {
    insertTable(editor);
    createEmptyNode(editor);

    setAnchor(editor.selection.anchor.path[0] ? editor.selection.anchor.path[0] - 1 : 0);
    setTimeout(() => {
      Transforms.select(editor, [anchorPath, 0, 0, 0]);
      ReactEditor.focus(editor);
      props.close();
    }, 0);
  };

  return (
    <button
      className="md-sb-button action-btn"
      onClick={onClick}
      title={props.intl.formatMessage({
        id: 'table',
        defaultMessage: 'Insert table',
      })}
      disabled={isNestedTable(editor)}
    >
      <ReactSVG src={'/images/icons/table.svg'} wrapper={'span'} />
      <span className="action-btn__caption">
        {props.intl.formatMessage({ id: 'table', defaultMessage: 'Table' })}
      </span>
    </button>
  );
};

export default injectIntl(TableSideButton);

TableSideButton.propTypes = {
  intl: PropTypes.shape().isRequired,
  close: PropTypes.func,
};

TableSideButton.defaultProps = {
  setEditorState: () => {},
  getEditorState: () => {},
  close: () => {},
};
