import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './PopoverMenuItem.less';

const PopoverMenuItem = ({
  itemKey,
  children,
  onClick,
  disabled,
  fullScreenHidden,
  mobileScreenHidden,
  hideItem,
}) => (
  <li
    className={classNames('PopoverMenuItem', {
      'PopOverMenuItem__full-screen-hidden': fullScreenHidden,
      'PopOverMenuItem__mobile-screen-hidden': mobileScreenHidden,
      'screen-hidden': hideItem,
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
  disabled: PropTypes.bool,
  fullScreenHidden: PropTypes.bool,
  mobileScreenHidden: PropTypes.bool,
  hideItem: PropTypes.bool,
};

PopoverMenuItem.defaultProps = {
  children: null,
  itemKey: '',
  onClick: () => {},
  disabled: false,
  fullScreenHidden: false,
  mobileScreenHidden: false,
  hideItem: false,
};

export default PopoverMenuItem;
