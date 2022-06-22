import PropTypes from 'prop-types';
import React from 'react';

import StyleButton from './stylebutton';
import { isAllBlockSelected } from '../utils/common';
import {
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
} from '../utils/SlateUtilityFunctions';

const CodeButton = props => {
  const { editor } = props;
  const isBlock = isAllBlockSelected(editor);

  const onToggleBlock = format => {
    toggleBlock(editor, format);
  };

  const onToggleInline = () => {
    toggleMark(editor, 'inlineCode');
  };

  return (
    <div className="md-RichEditor-controls md-RichEditor-controls-block md-RichEditor-controls-code">
      <StyleButton
        key={props.style}
        onToggle={isBlock ? onToggleBlock : onToggleInline}
        style={props.style}
        description={props.description}
        icon={props.icon}
        label={props.label}
        format={props.format}
        active={isBlock ? isBlockActive(editor, props.format) : isMarkActive(editor, 'inlineCode')}
      />
    </div>
  );
};

CodeButton.propTypes = {
  editor: PropTypes.shape(),
  style: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.element,
  label: PropTypes.string,
  format: PropTypes.string,
};

CodeButton.defaultProps = {
  buttons: [],
  onToggle: () => {},
  editor: {},
  style: '',
  description: '',
  icon: '',
  label: '',
  format: 'code',
};

export default CodeButton;
