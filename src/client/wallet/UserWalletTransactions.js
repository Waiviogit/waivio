import React from 'react';
import PropTypes from 'prop-types';
import { last } from 'lodash';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
// import { defaultAccountLimit } from '../helpers/apiHelpers';
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

  handleLoadMoreNew = transactionHistory => {
    const { currentUsername } = this.props;
    const actionCount = transactionHistory[0];
    const lastAction = last(transactionHistory);
    const lastActionCount = lastAction ? actionCount : -1;
    let limit = lastActionCount < 500 ? lastActionCount : 500;
    console.log('transactionHistory: ', transactionHistory);

    if (lastActionCount === -1) {
      limit = 500;
    }

    this.props.getUserTransactionHistory(currentUsername, lastActionCount, limit);
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

    // todo добавить skipLimit. сделать оображение времени

    // eslint-disable-next-line array-callback-return
    // transactionHistory.map(transaction => {
    //   console.log('transaction.type: ', transaction.type)
    //   console.log('transaction', transaction)
    // })

    const getMore = this.handleLoadMoreNew(transactionHistory);

    return (
      <div className="UserWalletTransactions">
        <React.Fragment>
          <ReduxInfiniteScroll
            loadMore={getMore}
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
