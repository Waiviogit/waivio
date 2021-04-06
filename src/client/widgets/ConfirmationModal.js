import React, { useEffect, useState } from 'react';
import { Modal, message } from 'antd';
import { upperFirst } from 'lodash';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { estimateAmount, finalConfirmation } from '../../waivioApi/ApiClient';
import { CRYPTO_FOR_VALIDATE_WALLET } from '../../common/constants/waivio';
import { isGuestUser } from '../store/authStore/authSelectors';

const ConfirmationModal = ({ intl, history }) => {
  const [count, calculateAmount] = useState(0);
  const [isVisible, setVisible] = useState(true);
  const [isLoading, setLoading] = useState(false);

  const isGuest = useSelector(isGuestUser);

  const parseSearchParams = new URLSearchParams(history.location.search);
  const searchParams = {
    id: parseSearchParams.get('id'),
    reqAmount: parseSearchParams.get('reqAmount'),
    outputCoinType: parseSearchParams.get('outputCoinType'),
    depositAcc: parseSearchParams.get('depositAcc'),
    memo: parseSearchParams.get('memo'),
    token: parseSearchParams.get('token'),
    userName: parseSearchParams.get('userName'),
    commission: parseSearchParams.get('commission'),
  };
  const finalSumm = searchParams.reqAmount - searchParams.commission;
  const confirmTransaction = () => {
    setLoading(true);

    finalConfirmation(searchParams.token, isGuest)
      .then(res => {
        if (res.message) {
          message.error(res.message);
          history.push(`/@${searchParams.userName}`);
        } else {
          setTimeout(() => {
            message.success(
              intl.formatMessage({
                id: 'transaction_success',
                defaultMessage: 'Your transaction success',
              }),
            );
            history.push(`/@${searchParams.userName}/transfers`);
          }, 3000);
        }
      })
      .catch(e => message.error(e.message));
    localStorage.setItem('withdrawData', null);
  };

  const handleCloseConfirm = () => {
    history.push('/');
    setVisible(false);
  };

  const modalText = () => {
    switch (searchParams.id) {
      case 'unlinkEmailSuccess':
        return intl.formatMessage(
          {
            id: 'unlink_email_message',
            defaultMessage:
              'Email address was successfully unlinked from @{username} user account.',
          },
          {
            username: searchParams.userName,
          },
        );
      case 'confirmEmailSuccess':
        return intl.formatMessage(
          {
            id: 'saved_email_message',
            defaultMessage: 'Email address was successfully saved from @{username} user account.',
          },
          {
            username: searchParams.userName,
          },
        );
      default:
        return intl.formatMessage({
          id: 'address_not_valid',
          defaultMessage: 'Address is invalid',
        });
    }
  };

  useEffect(() => {
    estimateAmount(finalSumm, 'hive', searchParams.outputCoinType).then(res =>
      calculateAmount(res.outputAmount),
    );
  }, []);

  const currentModal = () => {
    switch (searchParams.id) {
      case 'finalConfirmTransaction':
        return (
          <Modal
            visible={isVisible}
            title={intl.formatMessage({
              id: 'final_confirmation',
              defaultMessage: 'Final confirmation',
            })}
            onOk={confirmTransaction}
            onCancel={handleCloseConfirm}
            okButtonProps={{
              loading: isLoading,
            }}
            cancelButtonProps={{
              disabled: isLoading,
            }}
          >
            <div className="modal-row">
              <b>
                {intl.formatMessage({
                  id: 'send',
                  defaultMessage: 'Send',
                })}
              </b>
              : {searchParams.reqAmount} HIVE
            </div>
            <div className="modal-row">
              <b>
                {intl.formatMessage({
                  id: 'receive',
                  defaultMessage: 'Receive',
                })}
              </b>
              : {count} {upperFirst(CRYPTO_FOR_VALIDATE_WALLET[searchParams.outputCoinType])}
            </div>
            <div className="modal-row">
              <b>
                {intl.formatMessage({
                  id: 'deposit_to',
                  defaultMessage: 'Deposit to',
                })}
              </b>
              : {searchParams.depositAcc}
            </div>
            <div className="modal-row">
              <b>
                {intl.formatMessage({
                  id: 'memo',
                  defaultMessage: 'Memo',
                })}
              </b>
              : {searchParams.memo}
            </div>
            <div className="modal-row">
              <b>
                {intl.formatMessage({
                  id: 'initiate_transfer',
                  defaultMessage: 'Initiate the transfer on the Hive blockchain.',
                })}
              </b>
            </div>
          </Modal>
        );

      default:
        return (
          <Modal
            visible={isVisible}
            title={intl.formatMessage({
              id: 'request_confirmed',
              defaultMessage: 'Request confirmed',
            })}
            footer={[
              <button className="ant-btn" key={'ok'} onClick={handleCloseConfirm}>
                Ok
              </button>,
            ]}
            onCancel={handleCloseConfirm}
          >
            <div>{modalText()}</div>
          </Modal>
        );
    }
  };

  return currentModal();
};

ConfirmationModal.propTypes = {
  intl: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
};

export default injectIntl(withRouter(ConfirmationModal));
