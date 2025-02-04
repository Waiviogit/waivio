import React from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import ProgressModalBody from '../PowerDownProgressModal/ProgressModalBody';

const SavingsProgressModal = ({
  showModal,
  savingsInfo,
  setShowModal,
  authUserPage,
  isAuth,
  calculateDaysLeftForSavings,
  setCurrWithdrawSaving,
  setShowCancelWithdrawSavings,
  setShowSavingsProgress,
  symbol,
}) => {
  const marks = {
    1: '1',
    2: '2',
    3: '3',
  };

  return (
    <Modal
      visible={showModal}
      footer={[
        <Button key="Ok" type="primary" onClick={() => setShowModal(false)}>
          <FormattedMessage id="ok" defaultMessage="Ok" />
        </Button>,
      ]}
      title={'Withdraw Savings'}
      onCancel={() => setShowModal(false)}
    >
      {savingsInfo
        ?.filter(inf => inf?.amount?.includes(symbol))
        ?.map((info, i) => (
          <ProgressModalBody
            amount={info.amount}
            isSaving
            showNextDate={false}
            title={'Withdraw'}
            timePeriod={'day'}
            addSpace={i !== savingsInfo.length - 1}
            key={info._id}
            max={3}
            min={1}
            info={info}
            index={i}
            setShowSavingsProgress={setShowSavingsProgress}
            setShowCancelWithdrawSavings={setShowCancelWithdrawSavings}
            setCurrWithdrawSaving={setCurrWithdrawSaving}
            left={calculateDaysLeftForSavings(info.complete)}
            marks={marks}
            authUserPage={authUserPage}
            isAuth={isAuth}
          />
        ))}
    </Modal>
  );
};

SavingsProgressModal.propTypes = {
  savingsInfo: PropTypes.arrayOf().isRequired,
  symbol: PropTypes.string,
  isAuth: PropTypes.bool,
  authUserPage: PropTypes.bool,
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  setShowCancelWithdrawSavings: PropTypes.func.isRequired,
  setCurrWithdrawSaving: PropTypes.func.isRequired,
  setShowSavingsProgress: PropTypes.func.isRequired,
  calculateDaysLeftForSavings: PropTypes.func.isRequired,
};

export default SavingsProgressModal;
