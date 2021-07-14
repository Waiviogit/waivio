import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import {
  getGlobalProperties,
  getUserEstAccountValue,
  getUserAccountHistory,
  getMoreUserAccountHistory,
  updateAccountHistoryFilter,
  setInitialCurrentDisplayedActions,
} from '../../store/walletStore/walletActions';
import { getUserAccount } from '../../store/usersStore/usersActions';
import Loading from '../components/Icon/Loading';
import UserActivityActions from './UserActivityActions';
import {
  getAuthenticatedUser,
  getAuthenticatedUserName,
} from '../../store/authStore/authSelectors';
import { getUser } from '../../store/usersStore/usersSelectors';
import {
  getAccountHistoryFilter,
  getCurrentDisplayedActions,
  getLoadingGlobalProperties,
  getTotalVestingFundSteem,
  getTotalVestingShares,
  getUsersAccountHistory,
  getUsersAccountHistoryLoading,
  getUsersEstAccountsValues,
} from '../../store/walletStore/walletSelectors';

@withRouter
@connect(
  (state, ownProps) => ({
    user: ownProps.isCurrentUser
      ? getAuthenticatedUser(state)
      : getUser(state, ownProps.match.params.name),
    authenticatedUserName: getAuthenticatedUserName(state),
    totalVestingShares: getTotalVestingShares(state),
    totalVestingFundSteem: getTotalVestingFundSteem(state),
    usersAccountHistory: getUsersAccountHistory(state),
    usersAccountHistoryLoading: getUsersAccountHistoryLoading(state),
    usersEstAccountsValues: getUsersEstAccountsValues(state),
    loadingGlobalProperties: getLoadingGlobalProperties(state),
    accountHistoryFilter: getAccountHistoryFilter(state),
    currentDisplayedActions: getCurrentDisplayedActions(state),
  }),
  {
    getGlobalProperties,
    getUserAccountHistory,
    getMoreUserAccountHistory,
    getUserAccount,
    getUserEstAccountValue,
    updateAccountHistoryFilter,
    setInitialCurrentDisplayedActions,
  },
)
class UserActivity extends React.Component {
  static propTypes = {
    usersAccountHistoryLoading: PropTypes.bool.isRequired,
    loadingGlobalProperties: PropTypes.bool.isRequired,
    getGlobalProperties: PropTypes.func.isRequired,
    getUserAccountHistory: PropTypes.func.isRequired,
    getUserEstAccountValue: PropTypes.func.isRequired,
    getUserAccount: PropTypes.func.isRequired,
    updateAccountHistoryFilter: PropTypes.func.isRequired,
    setInitialCurrentDisplayedActions: PropTypes.func.isRequired,
    location: PropTypes.shape().isRequired,
    user: PropTypes.shape().isRequired,
    usersAccountHistory: PropTypes.shape().isRequired,
    usersEstAccountsValues: PropTypes.shape().isRequired,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    currentDisplayedActions: PropTypes.arrayOf(PropTypes.shape()),
    isCurrentUser: PropTypes.bool,
    authenticatedUserName: PropTypes.string,
  };

  static defaultProps = {
    currentDisplayedActions: [],
    isCurrentUser: false,
    authenticatedUserName: '',
  };

  componentDidMount() {
    const {
      totalVestingShares,
      totalVestingFundSteem,
      usersEstAccountsValues,
      usersAccountHistory,
      user,
      isCurrentUser,
      authenticatedUserName,
      currentDisplayedActions,
    } = this.props;
    const username = isCurrentUser
      ? authenticatedUserName
      : this.props.location.pathname.match(/@(.*)(.*?)\//)[1];

    if (isEmpty(totalVestingFundSteem) || isEmpty(totalVestingShares)) {
      this.props.getGlobalProperties();
    }

    if (isEmpty(usersAccountHistory[username])) {
      this.props.getUserAccountHistory(username);
    }

    setTimeout(() => {
      if (isEmpty(usersAccountHistory[username])) {
        this.props.getUserAccountHistory(username);
      }
    }, 2000);

    if (isEmpty(user)) {
      this.props.getUserAccount(username);
    }

    if (isEmpty(usersEstAccountsValues[username]) && !isEmpty(user.name)) {
      this.props.getUserEstAccountValue(user);
    }

    if (isEmpty(currentDisplayedActions)) {
      this.props.setInitialCurrentDisplayedActions(user.name);
    }

    this.props.updateAccountHistoryFilter({
      username: user.name,
      accountHistoryFilter: [],
    });
  }

  render() {
    const {
      user,
      usersAccountHistory,
      usersAccountHistoryLoading,
      loadingGlobalProperties,
      isCurrentUser,
    } = this.props;
    const actions = get(usersAccountHistory, user.name, []);

    return (
      <div>
        {actions.length === 0 || usersAccountHistoryLoading || loadingGlobalProperties ? (
          <Loading style={{ marginTop: '20px' }} />
        ) : (
          <UserActivityActions isCurrentUser={isCurrentUser} />
        )}
      </div>
    );
  }
}

export default UserActivity;
