import React from 'react';
import { isEmpty } from 'lodash';
import MenuItemButton from './MenuItemButton';
import './MenuItemButtons.less';

const MenuItemButtons = ({ menuItem, customSort }) =>
  !isEmpty(menuItem) &&
  menuItem?.map(item => (
    <MenuItemButton
      key={item.permlink}
      item={item}
      show={isEmpty(customSort) ? true : customSort?.includes(item.permlink)}
    />
  ));

export default MenuItemButtons;
