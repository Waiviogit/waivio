import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { useSelector } from 'react-redux';

import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';

import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import { getSettingsTitle } from './common/helpers';
import RightSidebar from '../app/Sidebar/RightSidebar';
import { getOwnWebsites } from '../reducers';

import './Settings.less';

const SettingsMain = ({ route, intl, match, history }) => {
  const myWebsites = useSelector(getOwnWebsites);
  const host = match.params.site;
  const title = host ? `- ${host} ` : '';
  const isBookmark = match.url.includes('bookmarks');
  const containerClassList = classNames('container', {
    'feed-layout': isBookmark,
    'settings-layout': !isBookmark,
  });
  console.log(myWebsites);
  useEffect(() => {
    if (!myWebsites.some(website => website.host === host) && host) history.push('/');
  }, [myWebsites]);

  return (
    <div className="shifted">
      <Helmet>
        <title>
          {intl.formatMessage(getSettingsTitle(match))} {title} - Waivio
        </title>
      </Helmet>
      <div className={containerClassList}>
        <Affix className="leftContainer" stickPosition={77}>
          <div className="left">
            <LeftSidebar />
          </div>
        </Affix>
        {isBookmark && (
          <Affix className="rightContainer" stickPosition={77}>
            <div className="right">
              <RightSidebar />
            </div>
          </Affix>
        )}
        <div className="center">
          <MobileNavigation />
          {renderRoutes(route.routes)}
        </div>
      </div>
    </div>
  );
};

SettingsMain.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  match: PropTypes.shape({
    url: PropTypes.string,
    params: PropTypes.shape({
      0: PropTypes.string,
      site: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};

export default injectIntl(SettingsMain);
