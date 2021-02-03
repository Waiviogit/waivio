import React from 'react';
import store from 'store';
import { injectIntl } from 'react-intl';
import { get, upperFirst } from 'lodash';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import HeaderButton from '../../../components/HeaderButton/HeaderButton';
import WebsiteSearch from '../../../search/WebsitesSearch/WebsiteSearch';
import { getObjectType } from '../../../helpers/wObjectHelper';

import './WebsiteHeader.less';

const WebsiteHeader = ({ currPage, wobj, history, config, intl }) => {
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
      <div className="topnav-layout isWebsiteView">
        {isMainPage ? (
          <WebsiteSearch history={history} />
        ) : (
          <React.Fragment>
            <Link className="WebsiteHeader__link left" to={'/'}>
              <Icon type="left" />{' '}
              {intl.formatMessage({
                id: 'back',
                defaultMessage: 'Back',
              })}
            </Link>
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
  history: PropTypes.shape().isRequired,
  config: PropTypes.shape().isRequired,
  intl: PropTypes.shape().isRequired,
};

export default withRouter(injectIntl(WebsiteHeader));
