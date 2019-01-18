import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './IconButton.less';

const IconButton = props => {
  const { icon, caption, className } = props;
  return (
    <div
      className={classNames('icon-button', { [className]: Boolean(className) })}
      role="presentation"
    >
      <div className="icon-button__icon">{icon}</div>
      <div className="icon-button__text">{caption}</div>
    </div>
  );
};

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  caption: PropTypes.oneOfType(PropTypes.node, PropTypes.string),
  className: PropTypes.string,
};

IconButton.defaultProps = {
  caption: null,
  className: '',
};

export default IconButton;
