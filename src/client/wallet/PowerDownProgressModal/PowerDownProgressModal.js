import React from 'react';
import { Button, Modal } from 'antd';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ProgressModalBody from './ProgressModalBody';

const PowerDownProgressModal = ({
  showModal,
  setShowModal,
  nextWithdrawal,
  isWaivWallet,
  maxWeeks,
  user,
  unstakesTokenInfo,
  setCurrPowerDown,
  setShowCancelPowerDown,
  isAuth,
  authUserPage,
}) => {
  const calculateWeeksLeft = (toWithdraw, withdrawn, vestingWithdrawRate) => {
    const rate = parseFloat(vestingWithdrawRate);
    const remainingAmount = toWithdraw - withdrawn;

    return Math.round(remainingAmount / rate) / 1000000;
  };

  const marks = isWaivWallet
    ? {
        0: '0',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
      }
    : {
        0: '0',
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
        10: '10',
        11: '11',
        12: '12',
        13: '13',
      };

  return (
    <Modal
      visible={showModal}
      footer={[
        <Button key="Ok" type="primary" onClick={() => setShowModal(false)}>
          <FormattedMessage id="ok" defaultMessage="Ok" />
        </Button>,
      ]}
      title={'Power down'}
      onCancel={() => setShowModal(false)}
    >
      {isWaivWallet ? (
        unstakesTokenInfo?.map((info, i) => (
          <ProgressModalBody
            isWaivWallet
            addSpace={i !== unstakesTokenInfo.length - 1}
            key={info._id}
            maxWeeks={maxWeeks}
            info={info}
            index={i}
            weeksLeft={info.numberTransactionsLeft}
            nextDate={info.nextTransactionTimestamp}
            marks={marks}
            setShowCancelPowerDown={setShowCancelPowerDown}
            setCurrPowerDown={setCurrPowerDown}
            authUserPage={authUserPage}
            isAuth={isAuth}
          />
        ))
      ) : (
        <ProgressModalBody
          maxWeeks={maxWeeks}
          weeksLeft={calculateWeeksLeft(
            user.to_withdraw,
            user.withdrawn,
            user.vesting_withdraw_rate,
          )}
          nextDate={`${nextWithdrawal}Z`}
          marks={marks}
        />
      )}
    </Modal>
  );
};

PowerDownProgressModal.propTypes = {
  isWaivWallet: PropTypes.bool,
  isAuth: PropTypes.bool,
  authUserPage: PropTypes.bool,
  user: PropTypes.shape(),
  unstakesTokenInfo: PropTypes.arrayOf(),
  showModal: PropTypes.bool.isRequired,
  maxWeeks: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  setCurrPowerDown: PropTypes.func.isRequired,
  setShowCancelPowerDown: PropTypes.func.isRequired,
  nextWithdrawal: PropTypes.string.isRequired,
};
PowerDownProgressModal.defaultProps = {
  isWaivWallet: false,
  user: {},
};

export default PowerDownProgressModal;
