import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import ObjectsContainer from './ObjectsContainer';
import Affix from '../components/Utils/Affix';

const Objects = ({ intl }) => (
  <div className="shifted">
    <Helmet>
      <title>
        {intl.formatMessage({ id: 'objects_title', defaultMessage: 'objects_title' })} - Waivio
      </title>
    </Helmet>
    <div className="feed-layout container">
      <Affix className="leftContainer" stickPosition={116}>
        <div className="left">
          <LeftSidebar />
        </div>
      </Affix>
      <ObjectsContainer />
    </div>
  </div>
);

Objects.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(Objects);
