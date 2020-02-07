import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';

import { timeForecastRemain } from '../../helpers/diffDateTime';

const BallotTimer = ({ endTimerTime, willCallAfterTimerEnd, isFinish }) => {
  let interval;

  const [time, setTime] = useState(timeForecastRemain(endTimerTime, false));
  const timerClassList = className('roundTimer', {
    'roundTimer--center': endTimerTime < Date.now(),
  });
  const handleUpdateTimeRemain = () => {
    if (endTimerTime > Date.now()) {
      setTime(timeForecastRemain(endTimerTime, false));
    } else {
      clearInterval(interval);
      willCallAfterTimerEnd();

      if(isFinish) {
        setTime(timeForecastRemain(0, false));
      }
    }
  };

  useEffect(() => {
    if (endTimerTime > Date.now()) {
      interval = setInterval(handleUpdateTimeRemain, 1000);
    }

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setTime(timeForecastRemain(endTimerTime, false));
  }, [endTimerTime]);

  return <span className={timerClassList}>{time}</span>;
};

BallotTimer.propTypes = {
  endTimerTime: PropTypes.number,
  willCallAfterTimerEnd: PropTypes.func.isRequired,
  isFinish: PropTypes.bool,
};

BallotTimer.defaultProps = {
  endTimerTime: 0,
  isFinish: false,
};

export default BallotTimer;
