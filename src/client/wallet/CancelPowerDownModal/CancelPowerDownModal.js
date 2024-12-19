import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { createQuery } from '../../../common/helpers/apiHelpers';

const CancelPowerDownModal = ({ setShowCancelPowerDown, showCancelPowerDown, account }) => {
  const handleCloseModal = () => {
    setShowCancelPowerDown(false);
  };

  const handleCancelPowerDown = () => {
    handleCloseModal();
    const transferQuery = {
      account,
      vesting_shares: `0.000000 VESTS`,
    };

    window &&
      window.open(
        `https://hivesigner.com/sign/withdraw-vesting?${createQuery(transferQuery)}`,
        '_blank',
      );
  };

  return (
    <Modal
      visible={showCancelPowerDown}
      okText={'Confirm'}
      title={'Cancel Unstake (Power Down)?'}
      onCancel={handleCloseModal}
      onOk={handleCancelPowerDown}
    >
      <p>This will cancel the current unstake (power down) request. Are you sure?</p>
    </Modal>
  );
};

CancelPowerDownModal.propTypes = {
  setShowCancelPowerDown: PropTypes.func.isRequired,
  showCancelPowerDown: PropTypes.bool.isRequired,
  account: PropTypes.string.isRequired,
};

export default CancelPowerDownModal;
