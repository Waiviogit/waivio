import React from 'react';
import PropTypes from 'prop-types';
import RightSidebarLoading from '../../../client/app/Sidebar/RightSidebarLoading';
import ObjectExpertise from '../../components/Sidebar/ObjectExpertise';

const RightObjectSidebar = ({ users }) =>
  users.length ? <ObjectExpertise users={users} /> : <RightSidebarLoading />;

RightObjectSidebar.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape()),
};

RightObjectSidebar.defaultProps = {
  users: [],
};

export default RightObjectSidebar;
