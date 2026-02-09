import React from 'react';
import PropTypes from 'prop-types';
import PopoverMenuItem from './PopoverMenuItem';
import './PopoverMenu.less';

const PopoverMenu = ({ children, onSelect, bold, hide }) => (
  <ul className="PopoverMenu">
    {React.Children.map(children, child => {
      if (!child || !child.props) return null;

      const { children: itemChildren, ...otherProps } = child.props;
      const onItemClick = () => {
        onSelect(child.key, child.props.data);
        hide();
      };

      return (
        <PopoverMenuItem
          key={child.key}
          {...otherProps}
          itemKey={child.key}
          bold={bold}
          onClick={onItemClick}
        >
          {child.props.children}
        </PopoverMenuItem>
      );
    })}
  </ul>
);

PopoverMenu.propTypes = {
  children: PropTypes.node,
  onSelect: PropTypes.func,
  bold: PropTypes.bool,
  hide: PropTypes.func,
};

PopoverMenu.defaultProps = {
  children: null,
  onSelect: () => {},
  bold: true,
  hide: () => {},
};

export default PopoverMenu;
export { PopoverMenuItem };
