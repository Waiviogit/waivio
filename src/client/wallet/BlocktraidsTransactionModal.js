import { Modal } from 'antd';
import { upperFirst } from 'lodash';
import moment from 'moment';
import React from 'react';
import PropTypes from 'prop-types';
import { CRYPTO_FOR_VALIDATE_WALLET } from '../../common/constants/waivio';

const BlocktraidsTransactionModal = ({
  isOpenDetailsModal,
  intl,
  transferDetails,
  toggleDetailsModal,
  status,
}) => {
  const getLinkForBlockChair = (param, key = '') =>
    `https://blockchair.com/${
      CRYPTO_FOR_VALIDATE_WALLET[transferDetails.outputCoinType]
    }/${param}/${transferDetails[key || param]}`;

  return (
    <Modal
      visible={isOpenDetailsModal}
      title={intl.formatMessage({
        id: 'transaction_details',
        defaultMessage: 'Transaction details',
      })}
      onCancel={toggleDetailsModal}
      footer={null}
    >
      <div className="UserWalletTransactions__modal-row">
        <div className="UserWalletTransactions__modal-subtitle">
          {intl.formatMessage({
            id: 'transaction_state',
            defaultMessage: 'Transaction State',
          })}
        </div>
        <div>{upperFirst(status)}</div>
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
        <a href={getLinkForBlockChair('address')} target="_blank" rel="noopener noreferrer">
          {transferDetails.address}
        </a>
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
          <a
            href={getLinkForBlockChair('transaction', 'transactionHash')}
            target="_blank"
            rel="noopener noreferrer"
          >
            {transferDetails.transactionHash}
          </a>
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
  );
};

BlocktraidsTransactionModal.propTypes = {
  transferDetails: PropTypes.shape({
    confirmed: PropTypes.string,
    amount: PropTypes.string,
    sendAmount: PropTypes.string,
    outputAmount: PropTypes.string,
    outputCoinType: PropTypes.string,
    address: PropTypes.string,
    receiveAddress: PropTypes.string,
    account: PropTypes.string,
    transactionHash: PropTypes.string,
    usdValue: PropTypes.string,
    memo: PropTypes.string,
  }).isRequired,
  isOpenDetailsModal: PropTypes.bool.isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  toggleDetailsModal: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
};

export default BlocktraidsTransactionModal;
