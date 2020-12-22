import React from 'react';
import store from 'store';
import { FormattedMessage } from 'react-intl';
import { get } from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import HeaderButton from '../../../components/HeaderButton/HeaderButton';
import WebsiteSearch from '../../../search/WebsitesSearch/WebsiteSearch';
import { getObjectType } from '../../../helpers/wObjectHelper';

import './WebsiteHeader.less';

const WebsiteHeader = ({ currPage, wobj, history, config }) => {
  const isMainPage = location.pathname === '/';
  let currentPage = currPage || store.get('currentPage');

  if (location.pathname.includes('/object/')) {
    currentPage = getObjectType(wobj);
  }

  if (location.pathname.includes('/@')) {
    currentPage = 'Profile';
  }

  if (location.pathname.includes('/editor')) {
    currentPage = 'Editor';
  }

  return (
    <div
      className="WebsiteHeader"
      style={{ backgroundColor: `#${get(config, ['colors', 'header'], '')}` }}
    >
      <div className="topnav-layout">
        {isMainPage ? (
          <WebsiteSearch history={history} />
        ) : (
          <React.Fragment>
            <Link className="WebsiteHeader__link left" to={'/'}>
              {'< Back'}
            </Link>
            <span className="center WebsiteHeader__title">
              {currentPage && <FormattedMessage id={currentPage} defaultMessage={currentPage} />}
            </span>
          </React.Fragment>
        )}
        <div className="right">
          <HeaderButton isWebsite />
        </div>
      </div>
    </div>
  );
};

WebsiteHeader.propTypes = {
  currPage: PropTypes.string.isRequired,
  wobj: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  config: PropTypes.shape().isRequired,
};

export default withRouter(WebsiteHeader);
