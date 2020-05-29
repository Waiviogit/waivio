import React from 'react';
import PropTypes from 'prop-types';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import Loading from '../components/Icon/Loading';
import './UserWalletTransactions.less';
import WalletTransaction from './WalletTransaction';

// eslint-disable-next-line react/prefer-stateless-function
class UserWalletTransactions extends React.Component {
  static propTypes = {
    currentUsername: PropTypes.string,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.shape()),
    hasMore: PropTypes.bool,
    getMoreUserTransactionHistory: PropTypes.func,
  };

  static defaultProps = {
    currentUsername: '',
    transactions: [],
    hasMore: false,
    getMoreUserTransactionHistory: () => {},
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

  render() {
    const {
      currentUsername,
      totalVestingShares,
      totalVestingFundSteem,
      transactions,
      hasMore,
    } = this.props;

    if (!transactions.length) {
      return null;
    }

    return (
      <div className="UserWalletTransactions">
        <ReduxInfiniteScroll
          loadMore={this.handleLoadMore}
          hasMore={hasMore}
          elementIsScrollable={false}
          threshold={500}
          loader={
            <div className="UserWalletTransactions__loader">
              <Loading />
            </div>
          }
        >
          <div />
          {transactions.map(transaction => (
            <WalletTransaction
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
