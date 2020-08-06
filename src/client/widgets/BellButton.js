import React from 'react';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getAuthenticatedUserName } from '../reducers';
import { bellNotifications } from '../user/userActions';

const BellButton = ({ bellUserNotifications, authUserName, user }) => {
  const bellStyle = user.bell ? 'filled' : 'outlined';

  return (
    <div
      onClick={() => bellUserNotifications(authUserName, user.name)}
      className="UserHeader__bell"
      role="presentation"
    >
      {user.bellLoading ? <Icon type="loading" /> : <Icon type="bell" theme={bellStyle} />}
    </div>
  );
};

BellButton.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    bellLoading: PropTypes.bool,
    bell: PropTypes.bool,
  }),
  bellUserNotifications: PropTypes.func.isRequired,
  authUserName: PropTypes.string,
};

BellButton.defaultProps = {
  user: {
    name: '',
    bellLoading: false,
    bell: false,
  },
  authUserName: '',
};

export default connect(
  state => ({
    authUserName: getAuthenticatedUserName(state),
  }),
  {
    bellUserNotifications: bellNotifications,
  },
)(BellButton);
