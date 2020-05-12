import React from 'react';
import PropTypes from 'prop-types';
// import _ from 'lodash';
// import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
// import { defaultAccountLimit } from '../helpers/apiHelpers';
// import Loading from '../components/Icon/Loading';
import './UserWalletTransactions.less';
import WalletTransaction from './WalletTransaction';

// eslint-disable-next-line react/prefer-stateless-function
class UserWalletTransactions extends React.Component {
  static propTypes = {
    currentUsername: PropTypes.string,
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    // loadingMoreUsersAccountHistory: PropTypes.bool.isRequired,
    userHasMoreActions: PropTypes.bool.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.shape()),
    // getUserTransactionHistory: PropTypes.func,
  };

  static defaultProps = {
    currentUsername: '',
    transactions: [],
    getUserTransactionHistory: () => {},
  };

  render() {
    const {
      currentUsername,
      totalVestingShares,
      totalVestingFundSteem,
      // loadingMoreUsersAccountHistory,
      userHasMoreActions,
      transactions,
    } = this.props;

    const key = Math.random();

    if (transactions.length === 0 && !userHasMoreActions) {
      return null;
    }

    // const handleLoadMore = () => {
    //   console.log('transactionHistory: ', transactionHistory);
    //
    //   const lastAction = _.last(transactionHistory);
    //   const lastActionCount = lastAction ? transactionHistory.lastIndexOf(lastAction) : -1;
    //   let limit = lastActionCount < defaultAccountLimit ? lastActionCount : defaultAccountLimit;
    //
    //   if (lastActionCount === -1) {
    //     limit = defaultAccountLimit;
    //   }
    //
    //   this.props.getUserTransactionHistory(currentUsername, lastActionCount, limit);
    // };

    return (
      <div className="UserWalletTransactions">
        <React.Fragment>
          {transactions.map(transaction => (
            <WalletTransaction
              key={key}
              transaction={transaction}
              currentUsername={currentUsername}
              totalVestingShares={totalVestingShares}
              totalVestingFundSteem={totalVestingFundSteem}
            />
          ))}

          {/* <ReduxInfiniteScroll */}
          {/*  loadMore={handleLoadMore} */}
          {/*  hasMore={userHasMoreActions} */}
          {/*  elementIsScrollable={false} */}
          {/*  threshold={500} */}
          {/*  loader={ */}
          {/*    <div className="UserWalletTransactions__loader"> */}
          {/*      <Loading /> */}
          {/*    </div> */}
          {/*  } */}
          {/*  loadingMore={loadingMoreUsersAccountHistory} */}
          {/* > */}
          {/*  <div /> */}
          {/*  {transactionHistory.map(transaction => ( */}
          {/*    <WalletTransaction */}
          {/*      key={key} */}
          {/*      transaction={transaction} */}
          {/*      currentUsername={currentUsername} */}
          {/*      totalVestingShares={totalVestingShares} */}
          {/*      totalVestingFundSteem={totalVestingFundSteem} */}
          {/*    /> */}
          {/*  ))} */}
          {/* </ReduxInfiniteScroll> */}
        </React.Fragment>
      </div>
    );
  }
}

export default UserWalletTransactions;
