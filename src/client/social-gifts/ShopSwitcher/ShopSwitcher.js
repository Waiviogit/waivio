import React from 'react';
import { useSelector } from 'react-redux';
import { Skeleton } from 'antd';
import Helmet from 'react-helmet';
import { has, isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import {
  getHelmetIcon,
  getMainObj,
  getShopSettings,
  getSiteName,
  getWebsiteConfiguration,
} from '../../../store/appStore/appSelectors';
import ShopMainForWobject from '../ShopMainForWobject/ShopMainForWobject';
import { useSeoInfo } from '../../../hooks/useSeoInfo';
import { userMenuTabsList } from '../Header/TopNavigation/WebsiteTopNavigation';
import UserFirstPageSwitcher from '../UserFirstPageSwitcher/UserFirstPageSwitcher';
import './ShopSwitcher.less';

const ShopSwitcher = () => {
  const shopSettings = useSelector(getShopSettings);
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const mainObj = useSelector(getMainObj);
  const config = useSelector(getWebsiteConfiguration);
  const title = siteName;
  const desc = mainObj?.description;
  const { canonicalUrl } = useSeoInfo();
  const tabsSorting =
    has(config, 'tabsSorting') && !isEmpty(config?.tabsSorting)
      ? config?.tabsSorting.find(tab => !config.tabsFilter?.includes(tab))
      : userMenuTabsList.find(tab => !config.tabsFilter?.includes(tab));

  const type = tabsSorting || 'Shop';

  const firstPage = () => {
    switch (shopSettings?.type) {
      case 'user':
        return <UserFirstPageSwitcher type={type} />;

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

export default injectIntl(ShopSwitcher);
