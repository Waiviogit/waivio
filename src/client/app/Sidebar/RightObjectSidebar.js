import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import UsersWeightList from '../../components/Sidebar/UsersWeightList';
import Loading from '../../components/Icon/Loading';

const RightObjectSidebar = ({ users }) => {
  if (!users) {
    return <Loading />;
  }

  return <div>{_.size(users) > 0 && <UsersWeightList users={users} />}</div>;
};

RightObjectSidebar.propTypes = {
  users: PropTypes.arrayOf(PropTypes.shape({ name: PropTypes.string })),
};

RightObjectSidebar.defaultProps = {
  users: [],
};

export default RightObjectSidebar;
