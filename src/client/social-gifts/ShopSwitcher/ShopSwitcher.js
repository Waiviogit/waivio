import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Skeleton } from 'antd';
import Helmet from 'react-helmet';

import {
  getHelmetIcon,
  getMainObj,
  getShopSettings,
  getSiteName,
} from '../../../store/appStore/appSelectors';
import ShopMainForWobject from '../ShopMainForWobject/ShopMainForWobject';
import SocialGiftsLandingPage from '../../SocialGiftsLandingPage/SocialGiftsLandingPage';

import './ShopSwitcher.less';
import { useSeoInfo } from '../../../hooks/useSeoInfo';

const ShopSwitcher = () => {
  const shopSettings = useSelector(getShopSettings);
  const history = useHistory();
  const favicon = useSelector(getHelmetIcon);
  const siteName = useSelector(getSiteName);
  const mainObj = useSelector(getMainObj);
  const title = siteName;
  const desc = mainObj?.description;
  const { canonicalUrl } = useSeoInfo();

  const getCurrComp = () => {
    switch (shopSettings?.type) {
      case 'user': {
        history.push(`/user-shop/${shopSettings?.value}`);

        return (
          <React.Fragment>
            <Helmet>
              <title>{title}</title>
              <meta property="og:title" content={title} />
              <meta property="description" content={desc} />
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
            <Skeleton active />
          </React.Fragment>
        );
      }
      case 'object':
        return <ShopMainForWobject wobjPermlink={shopSettings?.value} />;

      default:
        return <SocialGiftsLandingPage />;
    }
  };

  return getCurrComp();
};

export default ShopSwitcher;
