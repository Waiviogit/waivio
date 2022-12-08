import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import { renderRoutes } from 'react-router-config';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import ScrollToTop from '../components/Utils/ScrollToTop';
import ScrollToTopOnMount from '../components/Utils/ScrollToTopOnMount';
import DEFAULTS from '../object/const/defaultValues';
import { getAppUrl, getHelmetIcon, getWebsiteName } from '../../store/appStore/appSelectors';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';

const RewardsMainPage = props => {
  const helmetIcon = useSelector(getHelmetIcon);
  const siteName = useSelector(getWebsiteName);
  const appUrl = useSelector(getAppUrl);
  const desc = 'Reserve the reward for a few days. Share photos of the dish and get the reward!';
  const img = DEFAULTS.FAVICON;
  const urlCurr = `${appUrl}/rewards`;
  const title = `Rewards - ${siteName}`;

  return (
    <div className="Rewards-new container settings-layout container">
      <Helmet>
        <title>{title}</title>
        <meta property="og:title" content={title} />
        <link rel="canonical" href={urlCurr} />
        <meta property="description" content={desc} />
        <meta name="twitter:card" content={'summary_large_image'} />
        <meta name="twitter:site" content={`@${siteName}`} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={img} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={urlCurr} />
        <meta property="og:image" content={img} />
        <meta property="og:image:width" content="600" />
        <meta property="og:image:height" content="600" />
        <meta property="og:description" content={desc} />
        <meta property="og:site_name" content={siteName} />
        <link rel="image_src" href={img} />
        <link id="favicon" rel="icon" href={helmetIcon} type="image/x-icon" />
      </Helmet>
      <ScrollToTop />
      <ScrollToTopOnMount />
      <Affix className={'leftContainer'} stickPosition={77}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <div className={'center'} style={{ padding: '20px 0 0' }}>
        <MobileNavigation />
        {renderRoutes(props.route.routes)}
      </div>
    </div>
  );
};

RewardsMainPage.propTypes = {
  route: PropTypes.shape({ routes: PropTypes.shape({}) }).isRequired,
};

export default RewardsMainPage;
