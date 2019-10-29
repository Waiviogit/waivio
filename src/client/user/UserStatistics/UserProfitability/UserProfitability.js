import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './UserProfitability.less';

const UserProfitability = ({ profit, count }) => (
  <div
    className={classNames('UserProfitability', {
      success: profit > 0,
      unsuccess: profit < 0,
    })}
  >
    <div className="UserProfitability tooltip">
      <div className="UserProfitability__value">{`${profit}`}</div>
      <div className="UserProfitability tooltiptext">
        <span className="UserProfitability success">{count.pos}</span>/
        <span className="UserProfitability unsuccess">{count.neg}</span>
      </div>
    </div>

    <div className="UserProfitability__profit">pips</div>
  </div>
);

UserProfitability.propTypes = {
  profit: PropTypes.number.isRequired,
  count: PropTypes.shape().isRequired,
};

export default UserProfitability;
