import React from 'react';
import PropTypes from 'prop-types';
import RightSidebarLoading from '../../../client/app/Sidebar/RightSidebarLoading';
import ObjectExpertise from '../../components/Sidebar/ObjectExpertise';
import ForecastBlock from '../../components/ForecastBlock';

const RightObjectSidebar = ({ username, wobject, quoteSecurity }) =>
  wobject.users ? (
    <React.Fragment>
      <ObjectExpertise username={username} wobject={wobject} />
      {quoteSecurity && <ForecastBlock
        username={username}
        renderPlace={'rightObjectSidebar'}
        quoteSecurity={quoteSecurity}
      />}
    </React.Fragment>
  ) : (
    <RightSidebarLoading />
  );

RightObjectSidebar.propTypes = {
  username: PropTypes.string.isRequired,
  wobject: PropTypes.shape().isRequired,
  quoteSecurity: PropTypes.string,
};

RightObjectSidebar.defaultProps = {
  quoteSecurity: '',
};
export default RightObjectSidebar;
