import PropTypes from 'prop-types';
import React from 'react';
import { RichUtils } from 'draft-js';

import Stylebutton from './stylebutton';

const Blocktoolbar = props => {
  if (props.buttons.length < 1) {
    return null;
  }
  const { editorState } = props;
  const blockType = RichUtils.getCurrentBlockType(editorState);

  return (
    <div className="md-RichEditor-controls md-RichEditor-controls-block">
      {props.buttons.map(type => {
        const iconLabel = {};

        iconLabel.label = type.label;

        return (
          <Stylebutton
            {...iconLabel}
            key={type.style}
            active={type.style === blockType}
            onToggle={props.onToggle}
            style={type.style}
            description={type.description}
          />
        );
      })}
    </div>
  );
};

Blocktoolbar.propTypes = {
  editorState: PropTypes.shape().isRequired,
  buttons: PropTypes.arrayOf(PropTypes.shape()),
  onToggle: PropTypes.func,
};

Blocktoolbar.defaultProps = {
  buttons: [],
  onToggle: () => {},
};

export default Blocktoolbar;
