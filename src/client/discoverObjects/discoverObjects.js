import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { injectIntl } from 'react-intl';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';
import RightSidebar from '../app/Sidebar/RightSidebar';
import requiresLogin from '../auth/requiresLogin';
import TopNavigation from '../components/Navigation/TopNavigation';

const Activity = ({ intl, userName }) => (
  <React.Fragment>
    <Helmet>
      <title>{intl.formatMessage({ id: 'activity', defaultMessage: 'Activity' })} - Waivio</title>
    </Helmet>
    <div className="feed-layout container">
      <TopNavigation authenticated userName={userName} />
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
      <div className="center">Discover Objects</div>
    </div>
  </React.Fragment>
);

Activity.propTypes = {
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
};

export default requiresLogin(injectIntl(Activity));
