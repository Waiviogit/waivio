import React from 'react';
import PropTypes from 'prop-types';
import PopoverMenuItem from './PopoverMenuItem';
import './PopoverMenu.less';

const PopoverMenu = ({ children, onSelect, bold }) => (
  <ul className="PopoverMenu">
    {/* eslint-disable-next-line consistent-return */}
    {React.Children.map(children, child => {
      if (child) {
        const { children: itemChildren, ...otherProps } = child.props;
        return (
          <PopoverMenuItem
            key={child.key}
            {...otherProps}
            itemKey={child.key}
            bold={bold}
            onClick={() => onSelect(child.key)}
          >
            {child.props.children}
          </PopoverMenuItem>
        );
      }
    })}
  </ul>
);

PopoverMenu.propTypes = {
  children: PropTypes.node,
  onSelect: PropTypes.func,
  bold: PropTypes.bool,
};

PopoverMenu.defaultProps = {
  children: null,
  onSelect: () => {},
  bold: true,
};

export default PopoverMenu;
export { PopoverMenuItem };
