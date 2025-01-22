import React from 'react';
import { FormattedDate, FormattedMessage, FormattedNumber, FormattedTime } from 'react-intl';
import { Button, Slider } from 'antd';
import PropTypes from 'prop-types';

const ProgressModalBody = ({
  nextDate,
  isWaivWallet,
  weeksLeft,
  maxWeeks,
  marks,
  addSpace,
  setShowCancelPowerDown,
  setCurrPowerDown,
  info,
  index,
  isAuth,
  authUserPage,
}) => (
  <div>
    <div>
      {isWaivWallet && (
        <>
          <div className={'flex justify-between'}>
            <b>Power down #{index + 1}</b>
            {isAuth && authUserPage && (
              <Button
                onClick={() => {
                  setCurrPowerDown(info);
                  setShowCancelPowerDown(true);
                }}
                className={'UserWalletSummary__button'}
              >
                Cancel{' '}
              </Button>
            )}
          </div>
          <div>
            Amount: <FormattedNumber value={info.quantityLeft} />
          </div>
        </>
      )}
      <div>
        <div>
          {' '}
          <FormattedMessage id="next_power_down" defaultMessage="Next power down" />:{' '}
          <FormattedDate value={nextDate} /> <FormattedTime value={nextDate} />
        </div>
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
    {addSpace && <br />}
  </div>
);

ProgressModalBody.propTypes = {
  nextDate: PropTypes.number,
  index: PropTypes.number,
  addSpace: PropTypes.bool,
  authUserPage: PropTypes.bool,
  isAuth: PropTypes.bool,
  isWaivWallet: PropTypes.bool,
  maxWeeks: PropTypes.number,
  weeksLeft: PropTypes.number,
  setShowCancelPowerDown: PropTypes.func,
  setCurrPowerDown: PropTypes.func,
  marks: PropTypes.arrayOf(),
  info: PropTypes.shape(),
};
export default ProgressModalBody;
