import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { ReactSVG } from 'react-svg';
import { ReactEditor, useSlate } from 'slate-react';
import { Transforms } from 'slate';
import { createCodeBlock, createEmptyNode } from '../../util/SlateEditor/utils/embed';

const CodeSideButton = props => {
  const editor = useSlate();
  const onClick = () => {
    Transforms.insertNodes(editor, createCodeBlock());
    const prevSelection = editor.selection;

    Transforms.insertNodes(editor, createEmptyNode());
    Transforms.select(editor, prevSelection);
    ReactEditor.focus(editor);

    props.close();
  };

  return (
    <button
      className="md-sb-button action-btn"
      onClick={onClick}
      title={props.intl.formatMessage({
        id: 'add_code',
        defaultMessage: 'Add code',
      })}
    >
      <ReactSVG src={'/images/icons/code.svg'} wrapper={'span'} />
      <span className="action-btn__caption">
        {props.intl.formatMessage({ id: 'code', defaultMessage: 'Code' })}
      </span>
    </button>
  );
};

export default injectIntl(CodeSideButton);

CodeSideButton.propTypes = {
  intl: PropTypes.shape().isRequired,
  close: PropTypes.func,
};

CodeSideButton.defaultProps = {
  setEditorState: () => {},
  getEditorState: () => {},
  close: () => {},
};
