import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import {
  getMoreUserAccountHistory,
  updateAccountHistoryFilter,
  setInitialCurrentDisplayedActions,
} from '../../store/walletStore/walletActions';
import Loading from '../components/Icon/Loading';
import UserActivityActions from './UserActivityActions';
import {
  getCurrentDisplayedActions,
  getUsersAccountHistory,
  getUsersAccountHistoryLoading,
} from '../../store/walletStore/walletSelectors';

const UserActivity = props => {
  const {
    usersAccountHistory,
    usersAccountHistoryLoading,
    currentDisplayedActions,
    isCurrentUser,
    match,
  } = props;
  const actions = get(usersAccountHistory, match.params.name, []);
  const username = match.params.name;

  useEffect(() => {
    if (isEmpty(currentDisplayedActions)) {
      props.setInitialCurrentDisplayedActions(username);
    }

    props.updateAccountHistoryFilter({
      username,
      accountHistoryFilter: [],
    });
  }, []);
  const description = `Track real-time ${username} interactions on our platform, powered by revolutionary open blockchain technology. Experience unparalleled transparency and authenticity as you witness the vibrant activity of our esteemed community members.`;

  return (
    <div>
      <Helmet>
        <meta name="description" content={description} />
        <meta name="twitter:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:description" content={description} />
      </Helmet>
      {actions.length === 0 || usersAccountHistoryLoading ? (
        <Loading style={{ marginTop: '20px' }} />
      ) : (
        <UserActivityActions isCurrentUser={isCurrentUser} />
      )}
    </div>
  );
};

UserActivity.propTypes = {
  usersAccountHistoryLoading: PropTypes.bool.isRequired,
  updateAccountHistoryFilter: PropTypes.func.isRequired,
  setInitialCurrentDisplayedActions: PropTypes.func.isRequired,
  match: PropTypes.shape().isRequired,
  usersAccountHistory: PropTypes.shape().isRequired,
  currentDisplayedActions: PropTypes.arrayOf(PropTypes.shape()),
  isCurrentUser: PropTypes.bool,
};

UserActivity.defaultProps = {
  currentDisplayedActions: [],
  isCurrentUser: false,
};

export default withRouter(
  connect(
    state => ({
      usersAccountHistory: getUsersAccountHistory(state),
      usersAccountHistoryLoading: getUsersAccountHistoryLoading(state),
      currentDisplayedActions: getCurrentDisplayedActions(state),
    }),
    {
      getMoreUserAccountHistory,
      updateAccountHistoryFilter,
      setInitialCurrentDisplayedActions,
    },
  )(UserActivity),
);
