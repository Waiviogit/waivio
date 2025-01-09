import React from 'react';
import { Button, Modal, Slider } from 'antd';
import { FormattedDate, FormattedMessage, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';

const PowerDownProgressModal = ({
  showModal,
  setShowModal,
  nextWithdrawal,
  weeks,
  isWaivWallet,
  maxWeeks,
  user,
}) => {
  const calculateWeeksLeft = (toWithdraw, withdrawn, vestingWithdrawRate) => {
    const rate = parseFloat(vestingWithdrawRate);
    const remainingAmount = toWithdraw - withdrawn;

    return Math.round(remainingAmount / rate) / 1000000;
  };

  const weeksLeft = isWaivWallet
    ? weeks
    : calculateWeeksLeft(user.to_withdraw, user.withdrawn, user.vesting_withdraw_rate);

  const nextDate = isWaivWallet ? nextWithdrawal : `${nextWithdrawal}Z`;
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
      <div>
        <div>
          {' '}
          <FormattedMessage id="next_power_down" defaultMessage="Next power down" />:{' '}
          <FormattedDate value={nextDate} /> <FormattedTime value={nextDate} />
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
  user: PropTypes.shape(),
  weeks: PropTypes.number,
  showModal: PropTypes.bool.isRequired,
  maxWeeks: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  nextWithdrawal: PropTypes.string.isRequired,
};
PowerDownProgressModal.defaultProps = {
  isWaivWallet: false,
  user: {},
};

export default PowerDownProgressModal;
