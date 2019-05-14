import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import './InstrumentLongTermStatistics.less';

const propTypes = {
  periodsValues: PropTypes.shape().isRequired,
};

const InstrumentLongTermStatistics = ({ periodsValues }) => {
  return (
    <div className="InstrumentLongTermStatistics">
      <div className="InstrumentLongTermStatistics__title">{`Performance`}</div>
      <div>
        {_.map(periodsValues, period => (
          <div className="PeriodStatisticsLine">
            <div className="PeriodStatisticsLine__periodName">{period.label}</div>
            <div className={`PeriodStatisticsLine__value-${period.isUp ? 'success' : 'danger'}`}>{period.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

InstrumentLongTermStatistics.propTypes = propTypes;

export default InstrumentLongTermStatistics;
