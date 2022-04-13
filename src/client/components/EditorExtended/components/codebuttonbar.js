import PropTypes from 'prop-types';
import React from 'react';
import { EditorState, Modifier, RichUtils } from 'draft-js';
import StyleButton from './stylebutton';

export const handleClearInlineFormatting = (editorState) => {
  const styles = [
    'BOLD',
    'ITALIC',
    'UNDERLINE',
    'STRIKETHROUGH',
    'CODE'
  ];

  const contentWithoutStyles = styles.reduce( (newContentState, style) => (
    Modifier.removeInlineStyle(
      newContentState,
      editorState.getSelection(),
      style
    )
  ), editorState.getCurrentContent());

  return EditorState.push(
    editorState,
    contentWithoutStyles,
    'change-inline-style'
  );
};

const isSelectedFullBlocks = (editorState) => {
  const currentContent = editorState.getCurrentContent();

  const selectionState = editorState.getSelection();
  const start = selectionState.getStartOffset();
  const end = selectionState.getEndOffset();
  const endKey = selectionState.getEndKey();

  const endBlock = currentContent.getBlockForKey(endKey);
  const textEndBlock = endBlock.getText().trim();

  return start === 0 && end === textEndBlock.length
}

const CodeButton = props => {
  if (props.buttons.length < 1) {
    return null;
  }
  const { editorState, setEditorState } = props;
  const onToggleBlock = (style) => {
    queueMicrotask(() => props.onToggle(style) );
    if (style === 'code-block') {
      setEditorState(handleClearInlineFormatting(editorState));
    }
  }
  const blockType = RichUtils.getCurrentBlockType(editorState);

  const isInline = !isSelectedFullBlocks(editorState);

  return (
    <div className="md-RichEditor-controls md-RichEditor-controls-block">
      {props.buttons.map(type => {
        const iconLabel = {};

        iconLabel.label = type.label;
        const isInlineCode = isInline && type.style === 'code-block' && type.style !== blockType;
        const onToggle =  isInlineCode ? props.onToggleInline : onToggleBlock;
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

CodeButton.propTypes = {
  editorState: PropTypes.shape().isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape()),
  onToggleInline: PropTypes.func,
  onToggle: PropTypes.func,
  setEditorState: PropTypes.func,
};

CodeButton.defaultProps = {
  buttons: [],
  onToggle: () => {},
  onToggleInline: () => {},
  setEditorState: () => {},
};

export default CodeButton;
