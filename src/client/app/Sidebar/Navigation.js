import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getAuthenticatedUser } from '../../reducers';

import Sidenav from '../../components/Navigation/Sidenav';
import ObjectTypes from '../../components/Sidebar/ObjectTypes/ObjectTypes';

const Navigation = ({ authenticatedUser }) => (
  <div>
    <Sidenav username={authenticatedUser.name} />
    <ObjectTypes />
  </div>
);

Navigation.propTypes = {
  authenticatedUser: PropTypes.shape().isRequired,
};

export default connect(state => ({
  authenticatedUser: getAuthenticatedUser(state),
}))(Navigation);
