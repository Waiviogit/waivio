import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './UserProfitability.less';

const UserProfitability = ({ statisticsData }) => (
  <div
    className={classNames('UserProfitability', {
      success: statisticsData.pips > 0,
      unsuccess: statisticsData.pips < 0,
    })}
  >
    <div className="UserProfitability tooltip">
      <div className="UserProfitability__value">{`${statisticsData.pips}`}</div>
      <div className="UserProfitability tooltiptext">
        <span className="UserProfitability success">{statisticsData.successful_count}</span>/
        <span className="UserProfitability unsuccess">{statisticsData.failed_count}</span>
      </div>
    </div>

    <div className="UserProfitability__profit">pips</div>
  </div>
);

UserProfitability.propTypes = {
  statisticsData: PropTypes.shape().isRequired,
};

export default UserProfitability;
