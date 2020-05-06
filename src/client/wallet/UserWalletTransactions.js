import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import { defaultAccountLimit } from '../helpers/apiHelpers';
import Loading from '../components/Icon/Loading';
// import WalletTransaction from './WalletTransaction';
import './UserWalletTransactions.less';
import WalletTransactionNew from './WalletTransactionNew';

class UserWalletTransactions extends React.Component {
  static propTypes = {
    transactions: PropTypes.arrayOf(PropTypes.shape()),
    // actions: PropTypes.arrayOf(PropTypes.shape()),
    // getMoreUserAccountHistory: PropTypes.func.isRequired,
    currentUsername: PropTypes.string,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    // loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
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

  state = {
    hasMoreTransactions: true,
  };

  // handleLoadMore = () => {
  //   const { currentUsername, actions } = this.props;
  //   const lastAction = last(actions);
  //   const lastActionCount = lastAction ? lastAction.actionCount : -1;
  //   let limit = lastActionCount < defaultAccountLimit ? lastActionCount : defaultAccountLimit;
  //
  //   if (lastActionCount === -1) {
  //     limit = defaultAccountLimit;
  //   }
  //
  //   this.props.getMoreUserAccountHistory(currentUsername, lastActionCount, limit);
  // };

  render() {
    const {
      transactions,
      currentUsername,
      totalVestingShares,
      totalVestingFundSteem,
      // loadingMoreUsersAccountHistory,
      userHasMoreActions,
      transactionHistory,
    } = this.props;

    const { hasMoreTransactions } = this.state;

    if (transactions.length === 0 && !userHasMoreActions) {
      return null;
    }

    if (transactionHistory.length === 0 && !userHasMoreActions) {
      return null;
    }

    const key = Math.random();

    // todo добавить skipLimit. сделать оображение времени

    // eslint-disable-next-line array-callback-return
    // transactionHistory.map(transaction => {
    //   console.log('transaction.type: ', transaction.type)
    //   console.log('transaction', transaction)
    // })

    const handleLoadMoreNew = () => {
      console.log('transactionHistory: ', transactionHistory);
      const lastAction = _.last(transactionHistory);
      const lastIndex = transactionHistory.lastIndexOf(lastAction);

      console.log('index: ', lastIndex);
      if (transactionHistory.length === lastIndex) {
        this.setState({
          hasMoreTransactions: false,
        });
      }

      this.props.getUserTransactionHistory(currentUsername, lastIndex, defaultAccountLimit);
    };

    console.log('hasMoreTransactions: ', hasMoreTransactions);

    return (
      <div className="UserWalletTransactions">
        <React.Fragment>
          <ReduxInfiniteScroll
            loadMore={handleLoadMoreNew}
            hasMore={hasMoreTransactions}
            elementIsScrollable={false}
            threshold={500}
            loader={
              <div className="UserWalletTransactions__loader">
                <Loading />
              </div>
            }
          >
            <div />
            {transactionHistory.map(transaction => (
              <WalletTransactionNew
                key={key}
                transaction={transaction}
                currentUsername={currentUsername}
                totalVestingShares={totalVestingShares}
                totalVestingFundSteem={totalVestingFundSteem}
              />
            ))}
          </ReduxInfiniteScroll>

          {/* <ReduxInfiniteScroll */}
          {/* loadMore={this.handleLoadMore} */}
          {/* hasMore={userHasMoreActions} */}
          {/* elementIsScrollable={false} */}
          {/* threshold={500} */}
          {/* loader={ */}
          {/*   <div className="UserWalletTransactions__loader"> */}
          {/*     <Loading /> */}
          {/*   </div> */}
          {/* } */}
          {/* loadingMore={loadingMoreUsersAccountHistory} */}
          {/* > */}
          {/* <div /> */}
          {/* {transactions.map(transaction => ( */}
          {/*   <WalletTransaction */}
          {/*     key={`${transaction.trx_id}${transaction.actionCount}`} */}
          {/*     transaction={transaction} */}
          {/*     currentUsername={currentUsername} */}
          {/*     totalVestingShares={totalVestingShares} */}
          {/*     totalVestingFundSteem={totalVestingFundSteem} */}
          {/*   /> */}
          {/* ))} */}
          {/* </ReduxInfiniteScroll> */}
        </React.Fragment>
      </div>
    );
  }
}

export default UserWalletTransactions;
