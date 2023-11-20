import PropTypes from 'prop-types';
import React from 'react';

import Stylebutton from './stylebutton';

const Inlinetoolbar = props => {
  if (props.buttons.length < 1) {
    return null;
  }
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="md-RichEditor-controls md-RichEditor-controls-inline">
      {props.buttons.map(type => {
        const iconLabel = {};

        iconLabel.label = type.label;

        return (
          <Stylebutton
            {...iconLabel}
            key={type.style}
            active={currentStyle.has(type.style)}
            onToggle={props.onToggle}
            style={type.style}
            description={type.description}
          />
        );
      })}
    </div>
  );
};

Inlinetoolbar.propTypes = {
  editorState: PropTypes.shape().isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape()),
  onToggle: PropTypes.func,
};

Inlinetoolbar.defaultProps = {
  buttons: [],
  onToggle: () => {},
};

export default Inlinetoolbar;
