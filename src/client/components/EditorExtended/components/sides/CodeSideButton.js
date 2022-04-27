import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { EditorState, genKey, ContentBlock, SelectionState } from 'draft-js';
import { ReactSVG } from 'react-svg';
import { addEmptyBlock } from '../codebuttonbar';

const insertNewBlockToContentState = (contentState, editorState) => {
  const blockMap = contentState.getBlockMap();
  const key = genKey();
  const newBlock = new ContentBlock({
    text: '',
    type: 'code-block',
    hasFocus: true,
    key,
  });
  const newBlockMap = blockMap
    .toSeq()
    .concat([[newBlock.getKey(), newBlock]])
    .toOrderedMap();

  const newEditorState = EditorState.push(
    editorState,
    contentState.merge({
      blockMap: newBlockMap,
    }),
  );

  return moveCursorToKey(newEditorState, key);
};

const moveCursorToKey = (editorState, key) => {
  const newSelection = new SelectionState({
    anchorKey: key,
    anchorOffset: 0,
    focusKey: key,
    isBackward: false,
  });

  const newEditorState = EditorState.acceptSelection(editorState, newSelection);

  return EditorState.forceSelection(newEditorState, newEditorState.getSelection());
};

const CodeSideButton = props => {
  const onClick = () => {
    const editorState = props.getEditorState();

    const content = editorState.getCurrentContent();
    const newContent = insertNewBlockToContentState(content, editorState);

    props.setEditorState(addEmptyBlock(newContent));
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
  setEditorState: PropTypes.func,
  getEditorState: PropTypes.func,
  close: PropTypes.func,
};

CodeSideButton.defaultProps = {
  setEditorState: () => {},
  getEditorState: () => {},
  close: () => {},
};
