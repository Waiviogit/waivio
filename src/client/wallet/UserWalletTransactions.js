import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import Loading from '../components/Icon/Loading';
import './UserWalletTransactions.less';
import WalletTransaction from './WalletTransaction';
import { getTransactions, getUserHasMore } from '../reducers';
import { getUserTransactionHistory } from './walletActions';

@connect(
  state => ({
    transactions: getTransactions(state),
    hasMore: getUserHasMore(state),
  }),
  {
    getUserTransactionHistory,
  },
)
// eslint-disable-next-line react/prefer-stateless-function
class UserWalletTransactions extends React.Component {
  static propTypes = {
    currentUsername: PropTypes.string,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.shape()),
    getUserTransactionHistory: PropTypes.func.isRequired,
    hasMore: PropTypes.bool,
    transactionsHistory: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    currentUsername: '',
    transactions: [],
    hasMore: false,
    transactionsHistory: [],
  };

  componentDidMount() {
    const { transactions, currentUsername } = this.props;
    if (!transactions.length) {
      this.props.getUserTransactionHistory(currentUsername);
    }
  }

  handleLoadMore = () => {
    const { currentUsername, transactions } = this.props;
    let skip = 0;
    const limit = 20;
    if (transactions.length >= limit) {
      skip = transactions.length;
    }
    this.props.getUserTransactionHistory(currentUsername, skip, limit);
  };

  render() {
    const {
      currentUsername,
      totalVestingShares,
      totalVestingFundSteem,
      transactions,
      hasMore,
      transactionsHistory,
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

          {transactionsHistory.map(transactionHistory => (
            <WalletTransaction
              key={`${transactionsHistory.trx_id}${transactionsHistory.actionCount}`}
              transactionHistory={transactionHistory.op[1]}
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
