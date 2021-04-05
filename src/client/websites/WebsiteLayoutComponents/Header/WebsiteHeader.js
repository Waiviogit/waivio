import React from 'react';
import store from 'store';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { get, upperFirst } from 'lodash';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Icon } from 'antd';

import HeaderButton from '../../../components/HeaderButton/HeaderButton';
import WebsiteSearch from '../../../search/WebsitesSearch/WebsiteSearch';
import { getObjectType } from '../../../helpers/wObjectHelper';
import { getConfigurationValues, getCurrPage, getObject } from '../../../reducers';

import './WebsiteHeader.less';

const WebsiteHeader = ({ currPage, wobj, history, config, intl, location }) => {
  const pathName = location.pathname;
  const isMainPage = pathName === '/';
  let setHrefBackButton = () => history.push('/');
  let currentPage = currPage || store.get('currentPage');
  const backgroundColor = get(config, ['colors', 'header']) || 'fafbfc';

  if (pathName.includes('/object/')) {
    currentPage = getObjectType(wobj);
    const query = store.get('query');

    if (query)
      setHrefBackButton = () => {
        history.push(`/?${query}`);
        store.remove('query');
      };
  }

  if (pathName.includes('/@')) {
    currentPage = 'Profile';
  }

  if (pathName.includes('/editor')) {
    currentPage = 'Editor';
  }

  if (pathName.includes('/rewards')) {
    currentPage = 'Rewards';
  }

  return (
    <div className="WebsiteHeader" style={{ backgroundColor: `#${backgroundColor}` }}>
      <div className="topnav-layout isWebsiteView">
        {isMainPage ? (
          <WebsiteSearch history={history} />
        ) : (
          <React.Fragment>
            <div
              role="presentation"
              className="WebsiteHeader__link left"
              onClick={setHrefBackButton}
            >
              <Icon type="left" />{' '}
              <span>
                {intl.formatMessage({
                  id: 'home',
                  defaultMessage: 'Home',
                })}
              </span>
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
};

WebsiteHeader.defaultProps = {
  config: {},
};

export default connect(state => ({
  currPage: getCurrPage(state),
  config: getConfigurationValues(state),
  wobj: getObject(state),
}))(withRouter(injectIntl(WebsiteHeader)));
