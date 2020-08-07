import React from 'react';
import PropTypes from 'prop-types';
import { Modal, message } from 'antd';
import { injectIntl } from 'react-intl';
import { upperFirst } from 'lodash';
import moment from 'moment';

import ReduxInfiniteScroll from '../vendor/ReduxInfiniteScroll';
import Loading from '../components/Icon/Loading';
import WalletTransaction from './WalletTransaction';
import { guestUserRegex } from '../helpers/regexHelpers';
import { getTransferDetails } from '../../waivioApi/ApiClient';

import './UserWalletTransactions.less';

@injectIntl
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
    intl: PropTypes.shape({
      formatMessage: PropTypes.func.isRequired,
    }).isRequired,
    isErrorLoading: PropTypes.bool,
    operationNum: PropTypes.number,
    isloadingMoreTransactions: PropTypes.bool,
    isloadingMoreDemoTransactions: PropTypes.bool,
  };

  static defaultProps = {
    currentUsername: '',
    transactions: [],
    hasMore: false,
    getMoreUserTransactionHistory: () => {},
    demoTransactions: [],
    actions: [],
    isErrorLoading: false,
    operationNum: -1,
    isloadingMoreTransactions: false,
    isloadingMoreDemoTransactions: false,
  };

  state = {
    isOpenDetailsModal: false,
    transferDetails: null,
  };

  getWithDrawDetails = key => {
    getTransferDetails(key).then(data => {
      this.setState(() => ({
        transferDetails: data,
        isOpenDetailsModal: true,
      })).catch(e => message.error(e.message));
    });
  };

  isGuestPage = () => guestUserRegex.test(this.props.user && this.props.user.name);

  handleLoadMore = () => {
    const {
      currentUsername,
      operationNum,
      isloadingMoreTransactions,
      isloadingMoreDemoTransactions,
    } = this.props;
    let skip = 0;
    const limit = 10;
    if (this.isGuestPage()) {
      if (this.props.actions.length >= limit) {
        skip = this.props.actions.length;
      }
      // eslint-disable-next-line no-unused-expressions
      !isloadingMoreDemoTransactions &&
        this.props.getMoreUserAccountHistory(currentUsername, skip, limit);
    } else {
      // eslint-disable-next-line no-unused-expressions
      !isloadingMoreTransactions &&
        this.props.getMoreUserTransactionHistory(currentUsername, limit, operationNum);
    }
  };

  toggleDetailsModal = () =>
    this.setState(prevState => ({ isOpenDetailsModal: !prevState.isOpenDetailsModal }));

  getTransactionStatus = () => {
    const { transferDetails } = this.state;

    if (transferDetails.status && transferDetails.status === 'success') {
      return transferDetails.confirmed ? transferDetails.status : 'pending';
    }

    return transferDetails.status;
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
      intl,
      isErrorLoading,
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
                    handleDetailsClick={this.getWithDrawDetails}
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
                    handleDetailsClick={this.getWithDrawDetails}
                  />
                ))}
          </ReduxInfiniteScroll>
        </div>
        {transferDetails && (
          <Modal
            visible={isOpenDetailsModal}
            title={intl.formatMessage({
              id: 'transaction_details',
              defaultMessage: 'Transaction details',
            })}
            onCancel={this.toggleDetailsModal}
            footer={null}
          >
            <div className="UserWalletTransactions__modal-row">
              <div className="UserWalletTransactions__modal-subtitle">
                {intl.formatMessage({
                  id: 'transaction_state',
                  defaultMessage: 'Transaction State',
                })}
              </div>
              <div>{upperFirst(this.getTransactionStatus())}</div>
            </div>
            {transferDetails.confirmed && (
              <div className="UserWalletTransactions__modal-row">
                <div className="UserWalletTransactions__modal-subtitle">
                  {intl.formatMessage({
                    id: 'time_local',
                    defaultMessage: 'Time (local)',
                  })}
                </div>
                <div>{moment(transferDetails.confirmed).format('MMMM Do YYYY, h:mm:ss a')}</div>
              </div>
            )}
            <div className="UserWalletTransactions__modal-row">
              <div className="UserWalletTransactions__modal-subtitle">
                {intl.formatMessage({
                  id: 'send_amount',
                  defaultMessage: 'Send Amount',
                })}
              </div>
              <div>{transferDetails.amount || transferDetails.sendAmount} HIVE</div>
            </div>
            {transferDetails.outputAmount && transferDetails.outputCoinType && (
              <div className="UserWalletTransactions__modal-row">
                <div className="UserWalletTransactions__modal-subtitle">
                  {intl.formatMessage({
                    id: 'receive_amount',
                    defaultMessage: 'Receive Amount',
                  })}
                </div>
                <div>{`${
                  transferDetails.outputAmount
                } ${transferDetails.outputCoinType.toUpperCase()}`}</div>
              </div>
            )}
            <div className="UserWalletTransactions__modal-row">
              <div className="UserWalletTransactions__modal-subtitle">
                {intl.formatMessage({
                  id: 'receive_address',
                  defaultMessage: 'Receive Address',
                })}
              </div>
              <div>{transferDetails.address || transferDetails.receiveAddress}</div>
            </div>
            {transferDetails.account && (
              <div className="UserWalletTransactions__modal-row">
                <div className="UserWalletTransactions__modal-subtitle">
                  {intl.formatMessage({
                    id: 'deposit_account',
                    defaultMessage: 'Deposit account',
                  })}
                </div>
                <div>{transferDetails.account}</div>
              </div>
            )}
            {transferDetails.transactionHash && (
              <div className="UserWalletTransactions__modal-row">
                <div className="UserWalletTransactions__modal-subtitle">
                  {intl.formatMessage({
                    id: 'deposit_transaction_hash',
                    defaultMessage: 'Deposit Transaction Hash',
                  })}
                </div>
                <div>{transferDetails.transactionHash}</div>
              </div>
            )}
            {transferDetails.usdValue && (
              <div className="UserWalletTransactions__modal-row">
                <div className="UserWalletTransactions__modal-subtitle">
                  {intl.formatMessage({
                    id: 'deposit_usd_value',
                    defaultMessage: 'Deposit USD Value',
                  })}
                </div>
                <div>{transferDetails.usdValue}</div>
              </div>
            )}
            {transferDetails.memo && (
              <div className="UserWalletTransactions__modal-row">
                <div className="UserWalletTransactions__modal-subtitle">
                  {intl.formatMessage({
                    id: 'memo',
                    defaultMessage: 'Memo',
                  })}
                </div>
                <div>{transferDetails.memo}</div>
              </div>
            )}
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export default UserWalletTransactions;
