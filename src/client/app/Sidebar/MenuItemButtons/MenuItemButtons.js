import React from 'react';
import MenuItemButton from './MenuItemButton';
import './MinuItemButtons.less';

const MenuItemButtons = ({ menuItem }) =>
  menuItem.map(item => <MenuItemButton key={item.author_permlink} item={item} />);

export default MenuItemButtons;
