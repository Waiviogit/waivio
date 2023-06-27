import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { has, indexOf } from 'lodash';
import SocialMenuItem from './SocialMenuItem';
import './SocialMenuItems.less';
import { getObjectInfo } from '../../../../waivioApi/ApiClient';

const SocialMenuItems = ({ menuItem }) => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    menuItem
      ?.reduce(async (acc, curr) => {
        const res = await acc;
        const itemBody = JSON.parse(curr.body);

        if (itemBody.linkToObject && !has(itemBody, 'title')) {
          const newObj = await getObjectInfo([itemBody.linkToObject]);

          return [
            ...res,
            { ...curr, body: JSON.stringify({ ...itemBody, title: newObj.wobjects[0].name }) },
          ];
        }

        return [...res, curr];
      }, [])
      .then(r => setMenuItems(r));
  }, [menuItem]);

  return (
    <div className="SocialMenuItems">
      <div>
        {menuItems?.map(item => (
          <SocialMenuItem
            key={menuItems[item]}
            item={item}
            isOpen={indexOf(menuItems, item) === 0}
          />
        ))}
      </div>
    </div>
  );
};

SocialMenuItems.propTypes = {
  menuItem: PropTypes.arrayOf(),
};

export default SocialMenuItems;
