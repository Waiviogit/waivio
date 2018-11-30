import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl, FormattedMessage } from 'react-intl';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import ObjectContent from './ObjectContent';
import Affix from '../components/Utils/Affix';
import './Objects.less';

const Objects = ({ intl }) => (
  <div className="shifted">
    <Helmet>
      <title>
        {intl.formatMessage({ id: 'objects_title', defaultMessage: 'objects_title' })} - Waivio
      </title>
    </Helmet>
    <div className="feed-layout container">
      <Affix className="leftContainer" stickPosition={77}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <div className="Objects">
        <div className="Objects__title">
          <h1>
            <FormattedMessage id="objects_title" defaultMessage="Discover more objects" />
          </h1>
          <FormattedMessage
            id="discover_more_objects_info"
            defaultMessage="Discover the most reputable objects of this platform"
          />
        </div>
        <div className="Objects__content">
          <ObjectContent />
        </div>
      </div>
    </div>
  </div>
);

Objects.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(Objects);
