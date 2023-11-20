import PropTypes from 'prop-types';
import React from 'react';

import { HYPERLINK } from '../../constants';

const StyleButton = props => {
  let className = 'md-RichEditor-styleButton';

  if (props.active) {
    className += ' md-RichEditor-activeButton';
  }
  className += ` md-RichEditor-styleButton-${props.style.toLowerCase()}`;

  if (props.style === HYPERLINK) {
    return null;
  }

  const handleClick = () => {
    props.onToggle(props.format);
  };

  return (
    <span
      className={`${className} hint--top`}
      role="presentation"
      onClick={handleClick}
      aria-label={props.description}
    >
      {props.icon ? <i className={`fa fa-${props.icon}`} /> : props.label}
    </span>
  );
};

StyleButton.propTypes = {
  style: PropTypes.string,
  active: PropTypes.bool,
  icon: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element, PropTypes.object]),
  description: PropTypes.string,
  format: PropTypes.string,
  onToggle: PropTypes.func,
};

StyleButton.defaultProps = {
  onToggle: () => {},
  style: '',
  active: false,
  icon: '',
  label: '',
  description: '',
  editor: {},
  format: '',
};

export default StyleButton;
