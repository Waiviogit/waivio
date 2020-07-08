import React from 'react';
import PropTypes from 'prop-types';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import Loading from '../components/Icon/Loading';
import WalletTransaction from './WalletTransaction';
import { guestUserRegex } from '../helpers/regexHelpers';
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

  isGuestPage = () => guestUserRegex.test(this.props.user && this.props.user.name);

  handleLoadMore = () => {
    const { currentUsername } = this.props;
    let skip = 0;
    const limit = 50;
    if (this.isGuestPage()) {
      if (this.props.actions.length >= limit) {
        skip = this.props.actions.length;
      }
      this.props.getMoreUserAccountHistory(currentUsername, skip, limit);
    } else {
      if (this.props.transactions.length >= limit) {
        skip = this.props.transactions.length;
      }
      this.props.getMoreUserTransactionHistory(currentUsername, skip, limit);
    }
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
    } = this.props;

    return (
      <div className="UserWalletTransactions">
        <ReduxInfiniteScroll
          loadMore={this.handleLoadMore}
          hasMore={this.isGuestPage() ? demoHasMoreActions : hasMore}
          elementIsScrollable={false}
          threshold={500}
          loader={
            <div className="UserWalletTransactions__loader">
              <Loading />
            </div>
          }
        >
          <div />
          {this.isGuestPage()
            ? demoTransactions.map(demoTransaction => (
                <WalletTransaction
                  isGuestPage={this.isGuestPage()}
                  key={`${demoTransaction.trx_id}${demoTransaction.actionCount}`}
                  transaction={demoTransaction}
                  currentUsername={currentUsername}
                  totalVestingShares={totalVestingShares}
                  totalVestingFundSteem={totalVestingFundSteem}
                />
              ))
            : transactions.map(transaction => (
                <WalletTransaction
                  isGuestPage={this.isGuestPage()}
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
