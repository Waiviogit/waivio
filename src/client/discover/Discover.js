import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl, FormattedMessage } from 'react-intl';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import DiscoverContent from './DiscoverContent';
import Affix from '../components/Utils/Affix';
import MobileNavigation from '../components/Navigation/MobileNavigation/MobileNavigation';
import './Discover.less';

const Discover = ({ intl }) => (
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
      <meta
        property="og:image"
        content={
          'https://cdn.steemitimages.com/DQmWxwUb1hpd3X2bSL9VrWbJvNxKXDS2kANWoGTkwi4RdwV/unknown.png'
        }
      />
    </Helmet>
    <div className="feed-layout container">
      <Affix className="leftContainer" stickPosition={77}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <div className="Objects">
        <MobileNavigation />
        <div className="Discover__title">
          <FormattedMessage
            id="discover_more_people_info"
            defaultMessage="Discover the most reputable users of this platform"
          />
        </div>
        <div className="Objects__content">
          <DiscoverContent />
        </div>
      </div>
    </div>
  </div>
);

Discover.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(Discover);
