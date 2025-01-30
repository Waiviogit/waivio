import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { createQuery } from '../../../common/helpers/apiHelpers';

const CancelWithdrawSavings = ({
  showCancelWithdrawSavings,
  setShowSavingsProgress,
  setShowCancelWithdrawSavings,
  account,
  currWithdrawSaving,
}) => {
  const handleCloseModal = () => {
    setShowSavingsProgress(false);
    setShowCancelWithdrawSavings(false);
  };

  const handleCancelPowerDown = () => {
    handleCloseModal();

    const transferQuery = {
      from: account,
      request_id: currWithdrawSaving.request_id,
    };

    window &&
      window.open(
        `https://hivesigner.com/sign/cancel_transfer_from_savings?${createQuery(transferQuery)}`,
        '_blank',
      );
  };

  return (
    <Modal
      visible={showCancelWithdrawSavings}
      okText={'Confirm'}
      title={'HIVE Savings'}
      onCancel={handleCloseModal}
      onOk={handleCancelPowerDown}
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
  currWithdrawSaving: PropTypes.shape().isRequired,
};

export default CancelWithdrawSavings;
