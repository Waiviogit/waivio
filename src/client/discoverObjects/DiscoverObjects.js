import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import DiscoverObjectsContent from './DiscoverObjectsContent';
import './DiscoverObjects.less';

const DiscoverObjects = ({ intl, match }) => (
  <div className="shifted">
    <Helmet>
      <title>
        {intl.formatMessage({ id: 'objects_title', defaultMessage: 'Discover objects' })} - Waivio
      </title>
    </Helmet>
    <div className="feed-layout container">
      <Affix className="leftContainer" stickPosition={77}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <Affix className="rightContainer" stickPosition={77}>
        <div className="right">
          <RightSidebar />
        </div>
      </Affix>
      <div className="center">
        {<DiscoverObjectsContent typeName={match.params.typeName} key={match.url} intl={intl} />}
      </div>
    </div>
  </div>
);

DiscoverObjects.propTypes = {
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
};

export default injectIntl(DiscoverObjects);
