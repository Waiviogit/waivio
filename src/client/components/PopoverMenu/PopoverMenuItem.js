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
  mobileScreenHidden,
}) => (
  <li
    className={classNames('PopoverMenuItem', {
      'PopoverMenuItem--bold': bold,
      'PopOverMenuItem__full-screen-hidden': fullScreenHidden,
      'PopOverMenuItem__mobile-screen-hidden': mobileScreenHidden,
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
  fullScreenHidden: PropTypes.bool,
  mobileScreenHidden: PropTypes.bool,
};

PopoverMenuItem.defaultProps = {
  children: null,
  itemKey: '',
  onClick: () => {},
  bold: true,
  disabled: false,
  fullScreenHidden: false,
  mobileScreenHidden: false,
};

export default PopoverMenuItem;
