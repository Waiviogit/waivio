import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { timeForecastRemain } from '../../helpers/diffDateTime';

const BallotTimer = ({ endTimerTime, willCallAfterTimerEnd }) => {
  const [time, setTime] = useState(timeForecastRemain(endTimerTime, false));
  let interval;


  const handleUpdateTimeRemain = () => {
    if (endTimerTime > Date.now()) {
      setTime(timeForecastRemain(endTimerTime, false));
    } else {
      clearInterval(interval);
      setTimeout(willCallAfterTimerEnd, 3000)
    }
  };

  useEffect(() => {
    if (endTimerTime > Date.now()) {
      interval = setInterval(handleUpdateTimeRemain, 1000);
    }
  }, []);

  return (
      <span className="roundTimer">
            {time}
      </span>
  );
};

BallotTimer.propTypes = {
  endTimerTime: PropTypes.number,
  willCallAfterTimerEnd: PropTypes.func.isRequired,
};

BallotTimer.defaultProps = {
  endTimerTime: 0,
};

export default BallotTimer;
