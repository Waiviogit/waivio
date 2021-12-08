import React from 'react';
import PropTypes from 'prop-types';
import { message } from 'antd';
import { injectIntl } from 'react-intl';
import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import Loading from '../components/Icon/Loading';
import WalletTransaction from './WalletTransaction';
import { guestUserRegex } from '../helpers/regexHelpers';
import { getTransferDetails } from '../../waivioApi/ApiClient';
import { handleLoadMoreTransactions } from './WalletHelper';
import BlocktraidsTransactionModal from './BlocktraidsTransactionModal';

import './UserWalletTransactions.less';

@injectIntl
class UserWalletTransactions extends React.Component {
  static propTypes = {
    totalVestingShares: PropTypes.string.isRequired,
    totalVestingFundSteem: PropTypes.string.isRequired,
    transactions: PropTypes.arrayOf(PropTypes.shape()),
    hasMore: PropTypes.bool,
    getMoreUserTransactionHistory: PropTypes.func,
    demoTransactions: PropTypes.arrayOf(PropTypes.shape()),
    demoHasMoreActions: PropTypes.bool.isRequired,
    user: PropTypes.string.isRequired,
    actions: PropTypes.arrayOf(PropTypes.shape()),
    getMoreUserAccountHistory: PropTypes.func.isRequired,
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    isErrorLoading: PropTypes.bool,
    operationNum: PropTypes.number,
    isloadingMoreTransactions: PropTypes.bool,
    isloadingMoreDemoTransactions: PropTypes.bool,
    isMobile: PropTypes.bool,
  };

  static defaultProps = {
    user: '',
    transactions: [],
    hasMore: false,
    getMoreUserTransactionHistory: () => {},
    demoTransactions: [],
    actions: [],
    isErrorLoading: false,
    operationNum: -1,
    isloadingMoreTransactions: false,
    isloadingMoreDemoTransactions: false,
    isMobile: false,
  };

  state = {
    isOpenDetailsModal: false,
    transferDetails: null,
  };

  getWithDrawDetails = key => {
    getTransferDetails(key)
      .then(data => {
        this.setState(() => ({
          transferDetails: data,
          isOpenDetailsModal: true,
        }));
      })
      .catch(e => message.error(e.message));
  };

  isGuestPage = () => guestUserRegex.test(this.props.user);

  toggleDetailsModal = () =>
    this.setState(prevState => ({ isOpenDetailsModal: !prevState.isOpenDetailsModal }));

  getTransactionStatus = () => {
    const { transferDetails } = this.state;

    if (transferDetails.status && transferDetails.status === 'success') {
      return transferDetails.confirmed ? transferDetails.status : 'pending';
    }

    return transferDetails.status;
  };

  handleLoadMore = () => {
    const {
      user,
      operationNum,
      isloadingMoreTransactions,
      isloadingMoreDemoTransactions,
      getMoreUserAccountHistory,
      getMoreUserTransactionHistory,
      actions,
    } = this.props;

    const values = {
      username: user,
      operationNumber: operationNum,
      isLoadingMore: isloadingMoreTransactions,
      demoIsLoadingMore: isloadingMoreDemoTransactions,
      getMoreFunction: getMoreUserTransactionHistory,
      getMoreDemoFunction: getMoreUserAccountHistory,
      transferActions: actions,
      isGuest: this.isGuestPage(),
      table: false,
    };

    return handleLoadMoreTransactions(values);
  };

  render() {
    const {
      user,
      totalVestingShares,
      totalVestingFundSteem,
      transactions,
      hasMore,
      demoHasMoreActions,
      demoTransactions,
      intl,
      isErrorLoading,
      isMobile,
    } = this.props;
    const { isOpenDetailsModal, transferDetails } = this.state;

    return (
      <React.Fragment>
        <div className="UserWalletTransactions">
          <ReduxInfiniteScroll
            loadMore={this.handleLoadMore}
            hasMore={this.isGuestPage() ? demoHasMoreActions : hasMore}
            elementIsScrollable={false}
            threshold={500}
            loader={
              !isErrorLoading && (
                <div className="UserWalletTransactions__loader">
                  <Loading />
                </div>
              )
            }
          >
            {this.isGuestPage()
              ? demoTransactions.map(demoTransaction => (
                  <WalletTransaction
                    isGuestPage
                    key={`${demoTransaction.trx_id}${demoTransaction.actionCount}`}
                    transaction={demoTransaction}
                    currentUsername={user}
                    totalVestingShares={totalVestingShares}
                    totalVestingFundSteem={totalVestingFundSteem}
                    handleDetailsClick={this.getWithDrawDetails}
                    isMobile={isMobile}
                  />
                ))
              : transactions.map(transaction => (
                  <WalletTransaction
                    key={`${transaction.timestamp}${transaction.operationNum}`}
                    transaction={transaction}
                    currentUsername={user}
                    totalVestingShares={totalVestingShares}
                    totalVestingFundSteem={totalVestingFundSteem}
                    handleDetailsClick={this.getWithDrawDetails}
                    isMobile={isMobile}
                  />
                ))}
          </ReduxInfiniteScroll>
        </div>
        {transferDetails && (
          <BlocktraidsTransactionModal
            isOpenDetailsModal={isOpenDetailsModal}
            transferDetails={transferDetails}
            intl={intl}
            toggleDetailsModal={this.toggleDetailsModal}
            status={this.getTransactionStatus()}
          />
        )}
      </React.Fragment>
    );
  }
}

export default UserWalletTransactions;
