import React from 'react';
import PropTypes from 'prop-types';
import RightSidebarLoading from '../../../client/app/Sidebar/RightSidebarLoading';
import ObjectExpertise from '../../components/Sidebar/ObjectExpertise';
import ForecastBlock from '../../object/ForecastBlock';

const RightObjectSidebar = ({ username, wobject }) =>
  wobject.users ? (
    <React.Fragment>
      {' '}
      <ObjectExpertise username={username} wobject={wobject} />{' '}
      <ForecastBlock username={username} />{' '}
    </React.Fragment>
  ) : (
    <RightSidebarLoading />
  );

RightObjectSidebar.propTypes = {
  username: PropTypes.string.isRequired,
  wobject: PropTypes.shape().isRequired,
};

export default RightObjectSidebar;
