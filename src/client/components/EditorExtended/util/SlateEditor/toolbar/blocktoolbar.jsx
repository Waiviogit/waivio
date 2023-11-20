import PropTypes from 'prop-types';
import React from 'react';

import StyleButton from './stylebutton';
import { isBlockActive, toggleBlock } from '../utils/SlateUtilityFunctions';

const BlockToolbar = props => {
  const { editor } = props;

  const onToggleBlock = format => {
    toggleBlock(editor, format);
  };

  return (
    <div className="md-RichEditor-controls md-RichEditor-controls-block">
      {props.buttons.map(type => {
        const iconLabel = {};

        iconLabel.label = type.label;

        return (
          <StyleButton
            {...iconLabel}
            key={type.style}
            active={isBlockActive(editor, type.format)}
            onToggle={onToggleBlock}
            style={type.style}
            description={type.description}
            format={type.format}
          />
        );
      })}
    </div>
  );
};

BlockToolbar.propTypes = {
  editor: PropTypes.shape().isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape()),
  onToggle: PropTypes.func,
};

BlockToolbar.defaultProps = {
  buttons: [],
  onToggle: () => {},
};

export default BlockToolbar;
