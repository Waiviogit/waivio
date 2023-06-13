import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Skeleton } from 'antd';

import { getShopSettings } from '../../../store/appStore/appSelectors';
import ShopMainForWobject from '../ShopMainForWobject/ShopMainForWobject';
import SocialGiftsLandingPage from '../../SocialGiftsLandingPage/SocialGiftsLandingPage';

import './ShopSwitcher.less';

const ShopSwitcher = () => {
  const shopSettings = useSelector(getShopSettings);
  const history = useHistory();

  switch (shopSettings?.type) {
    case 'user': {
      history.push(`/user-shop/${shopSettings?.value}`);

      return <Skeleton active />;
    }
    case 'object':
      return <ShopMainForWobject wobjPermlink={shopSettings?.value} />;

    default:
      return <SocialGiftsLandingPage />;
  }
};

export default ShopSwitcher;
