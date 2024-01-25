import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  getHelmetIcon,
  getMainObj,
  getShopSettings,
  getSiteName,
} from '../../../store/appStore/appSelectors';
import Affix from '../../components/Utils/Affix';
import FiltersForMobile from '../../newRewards/Filters/FiltersForMobile';
import DepartmentsMobile from '../../Shop/ShopDepartments/DepartmentsMobile';
import DepartmentsUser from '../../Shop/ShopDepartments/DepartmentsUser';
import UserFilters from '../../Shop/ShopFilters/UserFilters';
import UserShoppingList from '../../Shop/ShopList/UserShoppingList';
import ShopMainForWobject from '../ShopMainForWobject/ShopMainForWobject';
import { useSeoInfo } from '../../../hooks/useSeoInfo';

import './ShopSwitcher.less';

const ShopSwitcher = ({ intl }) => {
  const shopSettings = useSelector(getShopSettings);
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const mainObj = useSelector(getMainObj);
  const [visible, setVisible] = useState();
  const [visibleFilter, setVisibleFilter] = useState();
  const title = siteName;
  const desc = mainObj?.description;
  const { canonicalUrl } = useSeoInfo();

  const firstPage = () => {
    switch (shopSettings?.type) {
      case 'user':
        return (
          <div className="shifted">
            <div className="feed-layout container Shop shifted">
              <Affix className="leftContainer" stickPosition={77}>
                <div className="left">
                  <DepartmentsUser name={shopSettings?.value} isSocial />
                  <UserFilters name={shopSettings?.value} />
                </div>
              </Affix>
              <div className="center center--withoutRigth">
                <h3 className={'ShopSwitcher__breadCrumbs'}>
                  {intl.formatMessage({ id: 'departments', defaultMessage: 'Departments' })}
                </h3>
                <DepartmentsMobile
                  type={shopSettings?.type}
                  visible={visible}
                  setVisible={vis => setVisible(vis)}
                  name={shopSettings?.value}
                  isSocial
                />
                <FiltersForMobile
                  setVisible={vis => setVisibleFilter(vis)}
                  visible={visibleFilter}
                  type={shopSettings?.type}
                  user={shopSettings?.value}
                />
                <UserShoppingList name={shopSettings?.value} isSocial />
              </div>
            </div>
          </div>
        );
      case 'object':
        return <ShopMainForWobject />;

      default:
        return <Skeleton active />;
    }
  };

  return (
    <div className={'ShopSwitcher'}>
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <meta name="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={'@waivio'} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:image" content={favicon} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={favicon} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content={siteName} />
        <link rel="image_src" href={favicon} />
        <link id="favicon" rel="icon" href={favicon} type="image/x-icon" />
      </Helmet>
      {firstPage()}
    </div>
  );
};

ShopSwitcher.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ShopSwitcher);
