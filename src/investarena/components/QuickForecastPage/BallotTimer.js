import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';

import { timeForecastRemain } from '../../helpers/diffDateTime';

const BallotTimer = ({ endTimerTime, willCallAfterTimerEnd }) => {
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
    }
  };

  useEffect(() => {
    if (endTimerTime > Date.now()) {
      interval = setInterval(handleUpdateTimeRemain, 1000);
    }
  }, []);

  return <span className={timerClassList}>{time}</span>;
};

BallotTimer.propTypes = {
  endTimerTime: PropTypes.number,
  willCallAfterTimerEnd: PropTypes.func.isRequired,
};

BallotTimer.defaultProps = {
  endTimerTime: 0,
};

export default BallotTimer;
