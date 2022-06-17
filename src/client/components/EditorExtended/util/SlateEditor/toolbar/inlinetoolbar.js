import PropTypes from 'prop-types';
import React from 'react';

import StyleButton from './stylebutton';
import { isMarkActive, toggleMark } from '../utils/SlateUtilityFunctions';

const InlineToolbar = props => {
  const { editor } = props;

  const onToggleInline = format => {
    toggleMark(editor, format);
  };

  return (
    <div className="md-RichEditor-controls md-RichEditor-controls-inline">
      {props.buttons.map(type => {
        const iconLabel = {};

        iconLabel.label = type.label;

        return (
          <StyleButton
            {...iconLabel}
            key={type.style}
            active={isMarkActive(editor, type.format)}
            onToggle={onToggleInline}
            style={type.style}
            description={type.description}
            format={type.format}
          />
        );
      })}
    </div>
  );
};

InlineToolbar.propTypes = {
  editor: PropTypes.shape().isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape()),
  onToggle: PropTypes.func,
};

InlineToolbar.defaultProps = {
  buttons: [],
  onToggle: () => {},
};

export default InlineToolbar;
