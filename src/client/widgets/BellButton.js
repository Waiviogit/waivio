import React from 'react';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';

import { getAuthenticatedUserName } from '../reducers';
import { bellNotifications } from '../user/userActions';
import { wobjectBellNotification } from '../object/wobjActions';

const BellButton = ({ bellUserNotifications, authUserName, user, wobj, bellWobjNotification }) => {
  const type = !isEmpty(wobj) ? wobj : user;
  const bellStyle = type.bell ? 'filled' : 'outlined';

  const bellNotification = () => {
    if (!isEmpty(wobj.author_permlink)) {
      return bellWobjNotification(wobj.author_permlink);
    }
    return bellUserNotifications(authUserName, user.name);
  };

  return (
    <div onClick={bellNotification} className="UserHeader__bell" role="presentation">
      {type.bellLoading ? <Icon type="loading" /> : <Icon type="bell" theme={bellStyle} />}
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
  wobj: PropTypes.shape(),
  bellWobjNotification: PropTypes.func.isRequired,
};

BellButton.defaultProps = {
  user: {
    name: '',
    bellLoading: false,
    bell: false,
  },
  authUserName: '',
  wobj: {},
};

export default connect(
  state => ({
    authUserName: getAuthenticatedUserName(state),
  }),
  {
    bellUserNotifications: bellNotifications,
    bellWobjNotification: wobjectBellNotification,
  },
)(BellButton);
