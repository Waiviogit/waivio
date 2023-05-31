import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './PopoverMenuItem.less';

const PopoverMenuItem = ({
  itemKey,
  children,
  onClick,
  bold,
  disabled,
  fullScreenHidden,
  topNav,
  invisible,
  active,
}) => (
  <li
    className={classNames('PopoverMenuItem', {
      'PopoverMenuItem--bold': bold,
      'PopoverMenuItem--active': active,
      'PopoverMenuItem--invisible': invisible,
      'PopOverMenuItem__full-screen-hidden': fullScreenHidden,
      PopOverMenuitem__topNav: topNav,
    })}
  >
    <a
      role="presentation"
      disabled={disabled}
      onClick={e => {
        e.preventDefault();
        onClick(itemKey);
      }}
    >
      {children}
    </a>
  </li>
);

PopoverMenuItem.propTypes = {
  children: PropTypes.node,
  itemKey: PropTypes.string,
  onClick: PropTypes.func,
  bold: PropTypes.bool,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  fullScreenHidden: PropTypes.bool,
  topNav: PropTypes.bool,
  invisible: PropTypes.bool,
};

PopoverMenuItem.defaultProps = {
  children: null,
  itemKey: '',
  onClick: () => {},
  bold: true,
  disabled: false,
  active: false,
  fullScreenHidden: false,
  topNav: false,
  invisible: false,
};

export default PopoverMenuItem;
