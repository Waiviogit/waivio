import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '../../components/Avatar';
import CardsTimeStamp from './CardsTimeStamp';

const SetWithdrawVestingRoute = ({ percent, from, to, timestamp, isGuestPage }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__avatar">
      <Avatar username={from} size={40} />
    </div>

    <div className="UserWalletTransactions__content">
      {'Withdraw vesting route is set'}
      <CardsTimeStamp timestamp={isGuestPage ? `${timestamp}Z` : timestamp} />
      <div>{'{"id":"set_withdraw_vesting_route",'}</div>
      <div> {`"from":"${from}", "to":"${to}"`}</div>
      <div> {`"percent": ${percent} }`}</div>
    </div>
  </div>
);

SetWithdrawVestingRoute.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
  timestamp: PropTypes.string,
  isGuestPage: PropTypes.bool,
  percent: PropTypes.string,
};

SetWithdrawVestingRoute.defaultProps = {
  from: '',
  to: '',
  timestamp: '',
  isGuestPage: false,
  percent: '',
};

export default SetWithdrawVestingRoute;
