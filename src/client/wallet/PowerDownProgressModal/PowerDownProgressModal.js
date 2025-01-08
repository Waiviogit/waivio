import React from 'react';
import { Button, Modal, Slider } from 'antd';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';

const PowerDownProgressModal = ({
  showModal,
  setShowModal,
  nextWithdrawal,
  isWaivWallet,
  maxWeeks,
}) => {
  const calculateWeeksLeft = date => {
    const currentDate = isWaivWallet ? new Date().getTime() : new Date();
    const target = isWaivWallet ? date : new Date(date);

    const timeDifference = target - currentDate;

    // Convert milliseconds to weeks
    return Math.max(0, Math.ceil(timeDifference / (1000 * 60 * 60 * 24 * 7)));
  };

  const weeksLeft = calculateWeeksLeft(nextWithdrawal);
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
        3: '3',
        6: '6',
        9: '9',
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
      <div>
        <div>
          {' '}
          <FormattedMessage id="next_power_down" defaultMessage="Next power down" />:{' '}
          <FormattedDate value={`${nextWithdrawal}Z`} />{' '}
          <FormattedTime value={`${nextWithdrawal}Z`} />
        </div>
        <div>
          Remaining: {weeksLeft} {weeksLeft === 1 ? 'week' : 'weeks'} out of {maxWeeks}.
        </div>
      </div>
      <div>
        {' '}
        <Slider
          marks={marks}
          tipFormatter={null}
          // disabled
          value={maxWeeks - weeksLeft}
          min={0}
          max={maxWeeks}
        />
      </div>
    </Modal>
  );
};

PowerDownProgressModal.propTypes = {
  isWaivWallet: PropTypes.bool,
  showModal: PropTypes.bool.isRequired,
  maxWeeks: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  nextWithdrawal: PropTypes.string.isRequired,
};
PowerDownProgressModal.defaultProps = {
  isWaivWallet: false,
};

export default PowerDownProgressModal;
