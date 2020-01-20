import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { timeQuickForecastRemain } from '../../helpers/diffDateTime';

const BallotTimer = ({ endTimerTime, willCallAfterTimerEnd }) => {
  const [time, setTime] = useState(timeQuickForecastRemain(endTimerTime));
  let interval;

  const handleUpdateTimeRemain = () => {
    if (endTimerTime > Date.now()) {
      setTime(timeQuickForecastRemain(endTimerTime));
    } else {
      clearInterval(interval);
      willCallAfterTimerEnd();
    }
  };

  useEffect(() => {
    if (endTimerTime > Date.now()) {
      interval = setInterval(handleUpdateTimeRemain, 1000)
    }
  }, []);

  return (
    <span>
      <Icon type="clock-circle"/>&#160;
      { time }
    </span>
  )
};

BallotTimer.propTypes = {
  endTimerTime: PropTypes.number,
  willCallAfterTimerEnd: PropTypes.func.isRequired,
};

BallotTimer.defaultProps = {
  endTimerTime: 0,
  replay: false,
};

export default BallotTimer;
