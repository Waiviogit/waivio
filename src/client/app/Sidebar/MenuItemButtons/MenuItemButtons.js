import React from 'react';
import { isEmpty } from 'lodash';
import MenuItemButton from './MenuItemButton';
import './MenuItemButtons.less';

const MenuItemButtons = ({ menuItem }) =>
  !isEmpty(menuItem) && menuItem?.map(item => <MenuItemButton key={item.permlink} item={item} />);

export default MenuItemButtons;
