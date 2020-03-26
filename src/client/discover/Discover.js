import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import { Tag } from 'antd';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverContent from './DiscoverContent';
import Affix from '../components/Utils/Affix';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';

import './Discover.less';

const Discover = ({ intl, match, history }) => (
  <div className="shifted">
    <Helmet>
      <meta
        property="og:title"
        content={`${intl.formatMessage({
          id: 'discover',
          defaultMessage: 'Discover',
        })}{' '}
        - Waivio`}
      />
      <meta property="og:type" content="article" />
      <meta
        property="og:image"
        content={
          'https://cdn.steemitimages.com/DQmWxwUb1hpd3X2bSL9VrWbJvNxKXDS2kANWoGTkwi4RdwV/unknown.png'
        }
      />
      <meta property="og:site_name" content="Waivio" />
      <title>
        {intl.formatMessage({
          id: 'discover_more_people',
          defaultMessage: 'discover_more_people',
        })}{' '}
        - Waivio
      </title>
    </Helmet>
    <div className="feed-layout container">
      <Affix className="leftContainer" stickPosition={77}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <div className="Objects center">
        {match.params.search && (
          <div className="Objects__tags">
            <Tag closable onClose={() => history.push('/discover')}>
              {match.params.search}
            </Tag>
          </div>
        )}

        <MobileNavigation />
        <div className="Objects__content">
          <DiscoverContent searchString={match.params.search} />
        </div>
      </div>
    </div>
  </div>
);

Discover.propTypes = {
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      search: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape().isRequired,
};

export default injectIntl(Discover);
