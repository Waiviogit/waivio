import React from 'react';
import PropTypes from 'prop-types';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import { defaultAccountLimit } from '../helpers/apiHelpers';
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
    getUserTransactionHistory: PropTypes.func.isRequired,
  };

  static defaultProps = {
    currentUsername: '',
    transactions: [],
  };

  handleLoadMore = () => {
    const { getUserTransactionHistory, currentUsername, transactions } = this.props;
    console.log('transactions: ', transactions);
    let skip = 0;
    if (transactions.length >= 5) {
      skip = transactions.length;
    }
    return getUserTransactionHistory(currentUsername, skip, defaultAccountLimit);
  };

  render() {
    const { currentUsername, totalVestingShares, totalVestingFundSteem, transactions } = this.props;

    const key = Math.random();

    if (!transactions.length) {
      return null;
    }

    return (
      <div className="UserWalletTransactions">
        <React.Fragment>
          <ReduxInfiniteScroll
            loadMore={this.handleLoadMore}
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
