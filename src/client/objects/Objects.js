import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import ObjectsContainer from './ObjectsContainer';
import Affix from '../components/Utils/Affix';
import Seo from '../SEO/Seo';

const Objects = ({ intl }) => (
  <div className="shifted">
    <Seo title={intl.formatMessage({ id: 'objects_title' })} />
    <div className="feed-layout container">
      <Affix className="leftContainer" stickPosition={77}>
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
