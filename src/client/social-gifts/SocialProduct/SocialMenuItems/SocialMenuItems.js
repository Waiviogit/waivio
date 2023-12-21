import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { has, isEmpty } from 'lodash';
import SocialMenuItem from './SocialMenuItem';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';

import './SocialMenuItems.less';

export const prepareMenuItems = menuItem => {
  const menuItemList = [];

  menuItem?.forEach(async curr => {
    const itemBody = JSON.parse(curr.body);

    if (itemBody.linkToObject && !has(itemBody, 'title')) {
      const res = await getObjectInfo([itemBody.linkToObject]);

      menuItemList.push({
        ...curr,
        body: JSON.stringify({ ...itemBody, title: res.wobjects[0].name }),
      });
    } else {
      menuItemList.push(curr);
    }
  });

  return menuItemList;
};

const SocialMenuItems = ({ menuItem }) => {
  const [menuItems, setMenuItems] = useState(prepareMenuItems(menuItem));

  useEffect(() => {
    setMenuItems(prepareMenuItems(menuItem));
  }, [menuItem.length]);

  if (isEmpty(menuItems)) return null;

  return (
    <div className="SocialMenuItems">
      <div>
        {menuItems?.map((item, index) => (
          <SocialMenuItem key={item._id} item={item} isOpen={index === 0} />
        ))}
      </div>
    </div>
  );
};

SocialMenuItems.propTypes = {
  menuItem: PropTypes.arrayOf(),
};

export default SocialMenuItems;
