import PropTypes from 'prop-types';
import React from 'react';
import { RichUtils } from 'draft-js';
import StyleButton from './stylebutton';

const isSelectedFullBlocks = editorState => {
  const currentContent = editorState.getCurrentContent();

  const selectionState = editorState.getSelection();
  const start = selectionState.getStartOffset();
  const end = selectionState.getEndOffset();
  const endKey = selectionState.getEndKey();

  const endBlock = currentContent.getBlockForKey(endKey);
  const textEndBlock = endBlock.getText().trim();

  return start === 0 && end === textEndBlock.length;
};

const BlockToolbar = props => {
  if (props.buttons.length < 1) {
    return null;
  }
  const { editorState } = props;
  const onToggleBlock = style => {
    if (style === 'code-block') {
      // setEditorState(removeAllInlineStyles(editorState));
    }
    props.onToggle(style);
  };
  const blockType = RichUtils.getCurrentBlockType(editorState);

  const isInline = !isSelectedFullBlocks(editorState);

  return (
    <div className="md-RichEditor-controls md-RichEditor-controls-block">
      {props.buttons.map(type => {
        const iconLabel = {};

        iconLabel.label = type.label;
        const isInlineCode = isInline && type.style === 'code-block' && type.style !== blockType;
        const onToggle = isInlineCode ? props.onToggleInline : onToggleBlock;
        const style = isInlineCode ? 'CODE' : type.style;

        return (
          <StyleButton
            {...iconLabel}
            key={type.style}
            active={type.style === blockType}
            onToggle={onToggle}
            style={style}
            description={type.description}
          />
        );
      })}
    </div>
  );
};

BlockToolbar.propTypes = {
  editorState: PropTypes.shape().isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape()),
  onToggleInline: PropTypes.func,
  onToggle: PropTypes.func,
  setEditorState: PropTypes.func,
};

BlockToolbar.defaultProps = {
  buttons: [],
  onToggle: () => {},
  onToggleInline: () => {},
  setEditorState: () => {},
};

export default BlockToolbar;
