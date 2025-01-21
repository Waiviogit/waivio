import React from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import { createQuery } from '../../../common/helpers/apiHelpers';

const CancelPowerDownModal = ({
  setShowCancelPowerDown,
  showPowerDownProgress,
  showCancelPowerDown,
  account,
  isWaivWallet,
  txID,
}) => {
  const handleCloseModal = () => {
    setShowCancelPowerDown(false);
    showPowerDownProgress(false);
  };

  const handleCancelPowerDown = () => {
    handleCloseModal();
    if (isWaivWallet) {
      const jsonPayload = JSON.stringify({
        contractName: 'tokens',
        contractAction: 'cancelUnstake',
        contractPayload: {
          symbol: 'WAIV',
          txID,
        },
      });

      window.open(
        `https://hivesigner.com/sign/custom_json?authority=active&required_auths=["${account}"]&required_posting_auths=[]&${createQuery(
          {
            id: 'ssc-mainnet-hive',
            json: jsonPayload,
          },
        )}`,
        '_blank',
      );
    } else {
      const transferQuery = {
        account,
        vesting_shares: `0.000000 VESTS`,
      };

      window &&
        window.open(
          `https://hivesigner.com/sign/withdraw-vesting?${createQuery(transferQuery)}`,
          '_blank',
        );
    }
  };

  return (
    <Modal
      visible={showCancelPowerDown}
      okText={'Confirm'}
      title={'Power down'}
      onCancel={handleCloseModal}
      onOk={handleCancelPowerDown}
    >
      <p className={'flex justify-center'}>
        This will cancel the current power down request. Are you sure?
      </p>
    </Modal>
  );
};

CancelPowerDownModal.propTypes = {
  setShowCancelPowerDown: PropTypes.func.isRequired,
  showPowerDownProgress: PropTypes.func.isRequired,
  showCancelPowerDown: PropTypes.bool.isRequired,
  isWaivWallet: PropTypes.bool,
  account: PropTypes.string.isRequired,
  txID: PropTypes.string.isRequired,
};

CancelPowerDownModal.defaultProps = {
  isWaivWallet: false,
};

export default CancelPowerDownModal;
