import React from 'react';
import { Button, Modal, Slider } from 'antd';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';

const PowerDownProgressModal = ({ showModal, setShowModal, nextVestingWithdrawal }) => {
  const calculateWeeksLeft = date => {
    const currentDate = new Date();
    const target = new Date(date);

    const timeDifference = target - currentDate;

    // Convert milliseconds to weeks
    return Math.max(0, Math.ceil(timeDifference / (1000 * 60 * 60 * 24 * 7)));
  };

  const weeksLeft = calculateWeeksLeft(nextVestingWithdrawal);

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
          <FormattedDate value={`${nextVestingWithdrawal}Z`} />{' '}
          <FormattedTime value={`${nextVestingWithdrawal}Z`} />
        </div>
        <div>
          Remaining: {weeksLeft} {weeksLeft === 1 ? 'week' : 'weeks'} out of 13.
        </div>
      </div>
      <div>
        {' '}
        <Slider
          marks={{
            0: '0',
            1: '1',
            3: '3',
            6: '6',
            9: '9',
            13: '13',
          }}
          tipFormatter={null}
          // disabled
          value={13 - weeksLeft}
          min={0}
          max={13}
        />
      </div>
    </Modal>
  );
};

PowerDownProgressModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  nextVestingWithdrawal: PropTypes.string.isRequired,
};

export default PowerDownProgressModal;
