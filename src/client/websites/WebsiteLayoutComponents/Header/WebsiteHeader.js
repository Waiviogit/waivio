import React from 'react';
import store from 'store';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { get, upperFirst } from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import HeaderButton from '../../../components/HeaderButton/HeaderButton';
import WebsiteSearch from '../../../search/WebsitesSearch/WebsiteSearch';
import { getObjectType } from '../../../helpers/wObjectHelper';
import {
  getConfigurationValues,
  getCurrPage,
  getIsDiningGifts,
} from '../../../../store/appStore/appSelectors';
import { getObject } from '../../../../store/wObjectStore/wObjectSelectors';

import './WebsiteHeader.less';

const WebsiteHeader = ({ currPage, wobj, history, config, intl, location, isDiningGifts }) => {
  const pathName = location.pathname;
  const pageWithMapUrl = isDiningGifts ? '/map' : '/';
  const isPageWithMap = pathName === pageWithMapUrl;
  const backgroundColor = get(config, ['colors', 'header']) || 'fafbfc';
  const query = store.get('query');
  let currentPage = currPage || store.get('currentPage');

  const getHrefBackButton = (link = '') => {
    if (query) return `/${link}?${query}`;

    return `/${link}`;
  };

  if (pathName.includes('/object/')) currentPage = getObjectType(wobj);

  if (pathName.includes('/@')) currentPage = 'Profile';

  if (pathName.includes('/editor')) currentPage = 'Editor';

  if (pathName.includes('/rewards')) currentPage = 'Rewards';

  return (
    <div className="WebsiteHeader" style={{ backgroundColor: `#${backgroundColor}` }}>
      <div className="topnav-layout isWebsiteView">
        {isPageWithMap ? (
          <WebsiteSearch history={history} location={location} />
        ) : (
          <React.Fragment>
            <div
              role="presentation"
              className="WebsiteHeader__link left"
              onClick={() => localStorage.removeItem('query')}
            >
              <Link to={isDiningGifts ? '/' : getHrefBackButton()}>
                {intl.formatMessage({
                  id: 'home',
                  defaultMessage: 'Home',
                })}
              </Link>
              {isDiningGifts && (
                <Link to={getHrefBackButton('map')} className="WebsiteHeader__linkMap">
                  {intl.formatMessage({
                    id: 'map',
                    defaultMessage: 'Map',
                  })}
                </Link>
              )}
            </div>
            {currentPage && (
              <span className="center WebsiteHeader__title">
                {upperFirst(
                  intl.formatMessage({
                    id: currentPage,
                    defaultMessage: currentPage,
                  }),
                )}
              </span>
            )}
          </React.Fragment>
        )}
        <div className="right WebsiteHeader__button-block">
          <HeaderButton isWebsite />
        </div>
      </div>
    </div>
  );
};

WebsiteHeader.propTypes = {
  currPage: PropTypes.string.isRequired,
  wobj: PropTypes.shape().isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape().isRequired,
  config: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
  isDiningGifts: PropTypes.bool.isRequired,
};

WebsiteHeader.defaultProps = {
  config: {},
};

export default connect(state => ({
  currPage: getCurrPage(state),
  config: getConfigurationValues(state),
  wobj: getObject(state),
  isDiningGifts: getIsDiningGifts(state),
}))(withRouter(injectIntl(WebsiteHeader)));
