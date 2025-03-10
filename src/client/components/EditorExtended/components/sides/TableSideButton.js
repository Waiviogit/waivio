import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { ReactSVG } from 'react-svg';
import { Editor, Node } from 'slate';
import { ReactEditor, useSlate } from 'slate-react';
import { insertTable, insertNestedTable } from '../../util/SlateEditor/utils/table';
import { createEmptyNode } from '../../util/SlateEditor/utils/embed';

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

  const onClick = () => {
    const nestedTable = isNestedTable(editor);

    if (nestedTable) {
      insertNestedTable(editor);
    } else {
      insertTable(editor);
    }
    createEmptyNode(editor);
    ReactEditor.focus(editor);
    props.close();
  };

  return (
    <button
      className="md-sb-button action-btn"
      onClick={onClick}
      title={props.intl.formatMessage({
        id: 'table',
        defaultMessage: 'Insert table',
      })}
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
