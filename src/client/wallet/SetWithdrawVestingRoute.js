import React from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import BTooltip from '../components/BTooltip';
import Avatar from '../components/Avatar';
import { epochToUTC } from '../helpers/formatter';

const SetWithdrawVestingRoute = ({ from, to, timestamp, isGuestPage }) => {
  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__avatar">
        <Avatar username={from} size={40} />
      </div>

      <div className="UserWalletTransactions__content">
        {'Withdraw vesting route is set'}
        <span className="UserWalletTransactions__timestamp">
          {isGuestPage ? (
            <BTooltip
              title={
                <span>
                  <FormattedDate value={`${timestamp}Z`} />{' '}
                  <FormattedTime value={`${timestamp}Z`} />
                </span>
              }
            >
              <span>
                <FormattedRelative value={`${timestamp}Z`} />
              </span>
            </BTooltip>
          ) : (
            <BTooltip
              title={
                <span>
                  <FormattedRelative value={epochToUTC(timestamp)} />
                </span>
              }
            >
              <span>
                <FormattedRelative value={epochToUTC(timestamp)} />
              </span>
            </BTooltip>
          )}
        </span>
        <div>{'{"id":"set_withdraw_vesting_route",'}</div>
        <div> {'"from":"' + from + '", "to":"' + to + '"}'}</div>
      </div>
    </div>
  );
};

SetWithdrawVestingRoute.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
  timestamp: PropTypes.string,
  isGuestPage: PropTypes.bool,
};

SetWithdrawVestingRoute.defaultProps = {
  from: '',
  to: '',
  timestamp: '',
  isGuestPage: false,
};

export default SetWithdrawVestingRoute;
