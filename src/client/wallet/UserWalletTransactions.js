import React from 'react';
import PropTypes from 'prop-types';
import { last } from 'lodash';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import Loading from '../components/Icon/Loading';
import WalletTransaction from './WalletTransaction';
import { guestUserRegex } from '../helpers/regexHelpers';
import { defaultAccountLimit } from '../helpers/apiHelpers';
import './UserWalletTransactions.less';

// eslint-disable-next-line react/prefer-stateless-function
class UserWalletTransactions extends React.Component {
  static propTypes = {
    currentUsername: PropTypes.string,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.shape()),
    hasMore: PropTypes.bool,
    getMoreUserTransactionHistory: PropTypes.func,
    demoTransactions: PropTypes.arrayOf(PropTypes.shape()),
    demoHasMoreActions: PropTypes.bool.isRequired,
    user: PropTypes.shape().isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape()),
    getMoreUserAccountHistory: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentUsername: '',
    transactions: [],
    hasMore: false,
    getMoreUserTransactionHistory: () => {},
    demoTransactions: [],
    actions: [],
  };

  handleLoadMore = () => {
    const { currentUsername, transactions } = this.props;
    let skip = 0;
    const limit = 50;
    if (transactions.length >= limit) {
      skip = transactions.length;
    }
    this.props.getMoreUserTransactionHistory(currentUsername, skip, limit);
  };

  handleLoadMoreDemo = () => {
    const { currentUsername, actions } = this.props;
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
      currentUsername,
      totalVestingShares,
      totalVestingFundSteem,
      transactions,
      hasMore,
      demoHasMoreActions,
      demoTransactions,
      user,
    } = this.props;

    const isGuestPage = guestUserRegex.test(user && user.name);

    return (
      <div className="UserWalletTransactions">
        <ReduxInfiniteScroll
          loadMore={isGuestPage ? this.handleLoadMoreDemo : this.handleLoadMore}
          hasMore={isGuestPage ? demoHasMoreActions : hasMore}
          elementIsScrollable={false}
          threshold={500}
          loader={
            <div className="UserWalletTransactions__loader">
              <Loading />
            </div>
          }
        >
          <div />
          {isGuestPage
            ? demoTransactions.map(demoTransaction => (
                <WalletTransaction
                  isGuestPage={isGuestPage}
                  key={`${demoTransaction.trx_id}${demoTransaction.actionCount}`}
                  transaction={demoTransaction}
                  currentUsername={currentUsername}
                  totalVestingShares={totalVestingShares}
                  totalVestingFundSteem={totalVestingFundSteem}
                />
              ))
            : transactions.map(transaction => (
                <WalletTransaction
                  isGuestPage={isGuestPage}
                  key={transaction.timestamp}
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
