import React, { useEffect } from 'react';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { renderRoutes } from 'react-router-config';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';

import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import { getSettingsTitle } from './common/helpers';
import RightSidebar from '../app/Sidebar/RightSidebar';
import { getIsAuthenticated, getOwnWebsites, isGuestUser } from '../store/reducers';
import * as websiteAction from '../websites/websiteActions';

import './Settings.less';
import { getIsWaivio } from '../store/appStore/appSelectors';

const SettingsMain = props => {
  const host = props.match.params.site;
  const title = host ? `- ${host} ` : '';
  const isBookmark = props.match.url.includes('bookmarks');
  const containerClassList = classNames('container', {
    'feed-layout': isBookmark,
    'settings-layout': !isBookmark,
  });

  useEffect(() => {
    if (!props.auth || (host && (props.isGuest || !props.isWaivio))) props.history.push('/');

    props.getOwnWebsites().then(({ value }) => {
      if (host && !value.some(website => website.host === host)) props.history.push('/');
    });
  }, [props.auth]);

  return (
    <div className="shifted">
      <Helmet>
        <title>
          {props.intl.formatMessage(getSettingsTitle(props.match))} {title} - Waivio
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
          {renderRoutes(props.route.routes)}
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
  auth: PropTypes.bool.isRequired,
  isGuest: PropTypes.bool.isRequired,
  isWaivio: PropTypes.bool.isRequired,
  getOwnWebsites: PropTypes.func.isRequired,
};

export default connect(
  state => ({
    myWebsites: getOwnWebsites(state),
    auth: getIsAuthenticated(state),
    isGuest: isGuestUser(state),
    isWaivio: getIsWaivio(state),
  }),
  {
    getOwnWebsites: websiteAction.getOwnWebsite,
  },
)(injectIntl(SettingsMain));
