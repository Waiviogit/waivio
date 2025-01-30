import React from 'react';
import { FormattedDate, FormattedMessage, FormattedNumber, FormattedTime } from 'react-intl';
import { Button, Slider } from 'antd';
import PropTypes from 'prop-types';

const ProgressModalBody = ({
  nextDate,
  timePeriod = 'weeks',
  isWaivWallet,
  left,
  max,
  marks,
  addSpace,
  setShowCancelPowerDown,
  setCurrPowerDown,
  info,
  index,
  isAuth,
  authUserPage,
  showNextDate = true,
  title = 'Power down',
  amount,
  isSaving,
  setCurrWithdrawSaving,
  setShowCancelWithdrawSavings,
}) => (
  <div>
    <div>
      {(isWaivWallet || isSaving) && (
        <>
          <div className={'flex justify-between'}>
            <b>
              {title} #{index + 1}
            </b>
            {isAuth && authUserPage && (
              <Button
                onClick={() => {
                  if (isSaving) {
                    setCurrWithdrawSaving(info);
                    setShowCancelWithdrawSavings(true);
                  } else {
                    setCurrPowerDown(info);
                    setShowCancelPowerDown(true);
                  }
                }}
                className={'UserWalletSummary__button'}
              >
                Cancel{' '}
              </Button>
            )}
          </div>
          <div>Amount: {isSaving ? amount : <FormattedNumber value={amount} />}</div>
        </>
      )}
      {showNextDate && (
        <div>
          <div>
            {' '}
            <FormattedMessage id="next_power_down" defaultMessage="Next power down" />:{' '}
            <FormattedDate value={nextDate} /> <FormattedTime value={nextDate} />
          </div>
        </div>
      )}
      <div>
        Remaining: {left} {left === 1 ? `${timePeriod}s` : timePeriod} out of {max}.
      </div>
    </div>
    <div>
      {' '}
      <Slider marks={marks} tipFormatter={null} value={max - left} min={0} max={max} />
    </div>
    {addSpace && <br />}
  </div>
);

ProgressModalBody.propTypes = {
  nextDate: PropTypes.number,
  index: PropTypes.number,
  left: PropTypes.number,
  max: PropTypes.number,
  amount: PropTypes.number,
  addSpace: PropTypes.bool,
  showNextDate: PropTypes.bool,
  authUserPage: PropTypes.bool,
  isAuth: PropTypes.bool,
  isSaving: PropTypes.bool,
  isWaivWallet: PropTypes.bool,
  timePeriod: PropTypes.string,
  title: PropTypes.string,
  setShowCancelPowerDown: PropTypes.func,
  setShowCancelWithdrawSavings: PropTypes.func,
  setCurrPowerDown: PropTypes.func,
  setCurrWithdrawSaving: PropTypes.func,
  marks: PropTypes.arrayOf(),
  info: PropTypes.shape(),
};
export default ProgressModalBody;
