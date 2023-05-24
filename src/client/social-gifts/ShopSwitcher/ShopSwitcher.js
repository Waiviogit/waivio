import React from 'react';
import { useSelector } from 'react-redux';
import { getShopSettings } from '../../../store/appStore/appSelectors';
import Affix from '../../components/Utils/Affix';
import DepartmentsUser from '../../Shop/ShopDepartments/DepartmentsUser';
import UserFilters from '../../Shop/ShopFilters/UserFilters';
import UserDepartmentsWobjList from '../../Shop/DepartmentsWobjList/UserDepartmentsWobjList';
import ShopMainForWobject from '../ShopMainForWobject/ShopMainForWobject';
import SocialGiftsLandingPage from '../../SocialGiftsLandingPage/SocialGiftsLandingPage';

import './ShopSwitcher.less';

const ShopSwitcher = () => {
  const shopSettings = useSelector(getShopSettings);

  switch (shopSettings?.type) {
    case 'user':
      return (
        <div className="feed-layout container Shop">
          <Affix className="leftContainer" stickPosition={77}>
            <div className="left">
              <DepartmentsUser userName={shopSettings.value} />
            </div>
          </Affix>
          <div className="center">
            <UserDepartmentsWobjList userName={shopSettings.value} />
          </div>
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <UserFilters userName={shopSettings.value} />
            </div>
          </Affix>
        </div>
      );
    case 'object':
      return <ShopMainForWobject wobjPermlink={shopSettings.value} />;

    default:
      return <SocialGiftsLandingPage />;
  }
};

export default ShopSwitcher;
