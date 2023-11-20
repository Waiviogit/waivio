import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { ReactSVG } from 'react-svg';
import { ReactEditor, useSlate } from 'slate-react';
import { insertTable } from '../../util/SlateEditor/utils/table';
import { createEmptyNode } from '../../util/SlateEditor/utils/embed';

const TableSideButton = props => {
  const editor = useSlate();

  const onClick = () => {
    createEmptyNode(editor);
    insertTable(editor);
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
