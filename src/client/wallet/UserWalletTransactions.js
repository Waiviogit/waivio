import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import { defaultAccountLimit } from '../helpers/apiHelpers';
import Loading from '../components/Icon/Loading';
import './UserWalletTransactions.less';
import WalletTransaction from './WalletTransaction';

// eslint-disable-next-line react/prefer-stateless-function
class UserWalletTransactions extends React.Component {
  static propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape()),
    currentUsername: PropTypes.string,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
    userHasMoreActions: PropTypes.bool.isRequired,
    transactionHistory: PropTypes.arrayOf(PropTypes.shape()),
    getUserTransactionHistory: PropTypes.func,
  };

  static defaultProps = {
    transactions: [],
    actions: [],
    currentUsername: '',
    transactionHistory: [],
    getUserTransactionHistory: () => {},
  };

  render() {
    const {
      transactions,
      currentUsername,
      totalVestingShares,
      totalVestingFundSteem,
      loadingMoreUsersAccountHistory,
      userHasMoreActions,
      transactionHistory,
    } = this.props;

    if (transactions.length === 0 && !userHasMoreActions) {
      return null;
    }

    if (transactionHistory.length === 0 && !userHasMoreActions) {
      return null;
    }

    const key = Math.random();

    const handleLoadMore = () => {
      console.log('transactionHistory: ', transactionHistory);

      const lastAction = _.last(transactionHistory);
      const lastActionCount = lastAction ? transactionHistory.lastIndexOf(lastAction) : -1;
      let limit = lastActionCount < defaultAccountLimit ? lastActionCount : defaultAccountLimit;

      if (lastActionCount === -1) {
        limit = defaultAccountLimit;
      }

      this.props.getUserTransactionHistory(currentUsername, lastActionCount, limit);
    };

    return (
      <div className="UserWalletTransactions">
        <React.Fragment>
          <ReduxInfiniteScroll
            loadMore={handleLoadMore}
            hasMore={userHasMoreActions}
            elementIsScrollable={false}
            threshold={500}
            loader={
              <div className="UserWalletTransactions__loader">
                <Loading />
              </div>
            }
            loadingMore={loadingMoreUsersAccountHistory}
          >
            <div />
            {transactionHistory.map(transaction => (
              <WalletTransaction
                key={key}
                transaction={transaction}
                currentUsername={currentUsername}
                totalVestingShares={totalVestingShares}
                totalVestingFundSteem={totalVestingFundSteem}
              />
            ))}
          </ReduxInfiniteScroll>
        </React.Fragment>
      </div>
    );
  }
}

export default UserWalletTransactions;
