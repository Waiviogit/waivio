import React, { useState } from 'react';
import { message, Modal } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Cookie from 'js-cookie';
import { createQuery } from '../../../common/helpers/apiHelpers';
import api from '../../steemConnectAPI';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

const CancelWithdrawSavings = ({
  showCancelWithdrawSavings,
  setShowSavingsProgress,
  setShowCancelWithdrawSavings,
  account,
  currWithdrawSaving,
  symbol,
  intl,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const hiveAuth = Cookie.get('auth');
  const authUserName = useSelector(getAuthenticatedUserName);
  const handleCloseModal = () => {
    setShowSavingsProgress(false);
    setShowCancelWithdrawSavings(false);
  };

  const handleCancelPowerDown = () => {
    const transferQuery = {
      from: account,
      request_id: currWithdrawSaving.request_id,
    };

    if (hiveAuth) {
      const brodc = () =>
        api.broadcast(
          [['cancel_transfer_from_savings', { ...transferQuery, from: authUserName }]],
          null,
          'active',
        );

      setIsLoading(true);

      brodc().then(() => {
        setIsLoading(false);
        handleCloseModal();
        message.success(
          intl.formatMessage({
            id: 'transaction_success',
            defaultMessage: 'Your transaction is successful',
          }),
        );
      });
    } else {
      handleCloseModal();
      window &&
        window.open(
          `https://hivesigner.com/sign/cancel_transfer_from_savings?${createQuery(transferQuery)}`,
          '_blank',
        );
    }
  };

  return (
    <Modal
      visible={showCancelWithdrawSavings}
      okText={'Confirm'}
      title={`${symbol} Savings`}
      onCancel={handleCloseModal}
      onOk={handleCancelPowerDown}
      okButtonProps={{
        loading: isLoading,
      }}
    >
      <p className={'flex justify-center'}>
        This will cancel the current withdraw savings request. Are you sure?
      </p>
    </Modal>
  );
};

CancelWithdrawSavings.propTypes = {
  setShowCancelWithdrawSavings: PropTypes.func.isRequired,
  setShowSavingsProgress: PropTypes.func.isRequired,
  showCancelWithdrawSavings: PropTypes.bool.isRequired,
  account: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  intl: PropTypes.string.isRequired,
  currWithdrawSaving: PropTypes.shape().isRequired,
};

export default CancelWithdrawSavings;
