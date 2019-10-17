import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './UserProfitability.less';

const UserProfitability = ({ profit }) => {
  return (
    <div
      className={classNames('UserProfitability', {
        success: profit > 0,
        unsuccess: profit < 0,
      })}
    >
      <div className="UserProfitability__value">{`${profit}`}</div>
      <div className="UserProfitability__profit">pips</div>
    </div>
  );
};

UserProfitability.propTypes = {
  profit: PropTypes.string.isRequired,
};

export default UserProfitability;
