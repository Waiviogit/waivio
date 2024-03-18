import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import {
  getUserAccountHistory,
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

  useEffect(() => {
    const username = match.params.name;

    if (isEmpty(usersAccountHistory[username])) {
      props.getUserAccountHistory(username);
    }

    if (isEmpty(currentDisplayedActions)) {
      props.setInitialCurrentDisplayedActions(username);
    }

    props.updateAccountHistoryFilter({
      username,
      accountHistoryFilter: [],
    });
  }, []);

  return (
    <div>
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
  getUserAccountHistory: PropTypes.func.isRequired,
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
      getUserAccountHistory,
      getMoreUserAccountHistory,
      updateAccountHistoryFilter,
      setInitialCurrentDisplayedActions,
    },
  )(UserActivity),
);
