import React from 'react';
import PropTypes from 'prop-types';
import RightSidebarLoading from '../../../client/app/Sidebar/RightSidebarLoading';
import ObjectExpertise from '../../components/Sidebar/ObjectExpertise';

const RightObjectSidebar = ({ username, wobject }) =>
  wobject.users ? (
    <ObjectExpertise username={username} wobject={wobject} />
  ) : (
    <RightSidebarLoading />
  );

RightObjectSidebar.propTypes = {
  username: PropTypes.string.isRequired,
  wobject: PropTypes.shape().isRequired,
};

export default RightObjectSidebar;
