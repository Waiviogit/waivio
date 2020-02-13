import React from 'react';
import PropTypes from 'prop-types';
import ObjectExpertise from '../../components/Sidebar/ObjectExpertise';
import ForecastBlock from '../../components/ForecastBlock';
import MostProfitableUsers from '../../components/Sidebar/mostProfitableUsers/mostProfitableUsers';

const RightObjectSidebar = ({ username, wobject, quoteSecurity }) => (
  <React.Fragment>
    <ObjectExpertise username={username} wobject={wobject} />
    {quoteSecurity && (
      <ForecastBlock
        username={username}
        renderPlace={'rightObjectSidebar'}
        quoteSecurity={quoteSecurity}
      />
    )}
    {wobject.chartid && <MostProfitableUsers chartid={wobject.chartid} />}
  </React.Fragment>
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
