import React from 'react';
import PropTypes from 'prop-types';
import { last } from 'lodash';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import { defaultAccountLimit } from '../helpers/apiHelpers';
import WalletTransaction from './WalletTransaction';
import UserDynamicListLoading from '../user/UserDynamicListLoading';
import './UserWalletTransactions.less';

class UserWalletTransactions extends React.Component {
  static propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape()),
    actions: PropTypes.arrayOf(PropTypes.shape()),
    getMoreUserAccountHistory: PropTypes.func.isRequired,
    currentUsername: PropTypes.string,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
    userHasMoreActions: PropTypes.bool.isRequired,
    isGuestPage: PropTypes.bool,
    demoHasMoreActions: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    transactions: [],
    actions: [],
    currentUsername: '',
    isGuestPage: false,
  };

  handleLoadMore = () => {
    const { currentUsername, actions, isGuestPage } = this.props;
    if (isGuestPage) {
      let skip = 0;
      const limit = 50;
      if (actions.length >= limit) {
        skip = actions.length;
      }
      this.props.getMoreUserAccountHistory(currentUsername, skip, limit);
    }

    const lastAction = last(actions);
    const lastActionCount = lastAction ? lastAction.actionCount : -1;
    let limit = lastActionCount < defaultAccountLimit ? lastActionCount : defaultAccountLimit;
    if (lastActionCount === -1) {
      limit = defaultAccountLimit;
    }
    this.props.getMoreUserAccountHistory(currentUsername, lastActionCount, limit);
  };

  render() {
    const {
      transactions,
      currentUsername,
      totalVestingShares,
      totalVestingFundSteem,
      loadingMoreUsersAccountHistory,
      userHasMoreActions,
      isGuestPage,
      demoHasMoreActions,
    } = this.props;

    if (transactions.length === 0 && !userHasMoreActions) {
      return null;
    }

    return (
      <div className="UserWalletTransactions">
        <ReduxInfiniteScroll
          loadMore={this.handleLoadMore}
          hasMore={isGuestPage ? demoHasMoreActions : userHasMoreActions}
          elementIsScrollable={false}
          threshold={500}
          loader={
            <div className="UserWalletTransactions__loader">
              <UserDynamicListLoading />
            </div>
          }
          loadingMore={loadingMoreUsersAccountHistory}
        >
          <div />
          {transactions.map(transaction => (
            <WalletTransaction
              isGuestUser={isGuestPage}
              key={`${transaction.trx_id}${transaction.actionCount}`}
              transaction={transaction}
              currentUsername={currentUsername}
              totalVestingShares={totalVestingShares}
              totalVestingFundSteem={totalVestingFundSteem}
            />
          ))}
        </ReduxInfiniteScroll>
      </div>
    );
  }
}

export default UserWalletTransactions;
