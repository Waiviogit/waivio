import React from 'react';
import PropTypes from 'prop-types';

import { renderRoutes } from 'react-router-config';
import Affix from '../components/Utils/Affix';
import LeftSidebar from '../app/Sidebar/LeftSidebar';

const RewardsMainPage = props => (
  <div className="container settings-layout container">
    <Affix className={'leftContainer'} stickPosition={77}>
      <div className="left">
        <LeftSidebar />
      </div>
    </Affix>
    <div className={'center'} style={{ padding: '20px 0 0' }}>
      {renderRoutes(props.route.routes)}
    </div>
  </div>
);

RewardsMainPage.propTypes = {
  route: PropTypes.shape({ routes: PropTypes.shape({}) }).isRequired,
};

export default RewardsMainPage;
