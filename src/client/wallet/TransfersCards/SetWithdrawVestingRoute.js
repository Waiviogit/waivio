import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Avatar from '../../components/Avatar';
import CardsTimeStamp from './CardsTimeStamp';
import '../UserWalletTransactions/UserWalletTransactions.less';

const SetWithdrawVestingRoute = ({
  percent,
  currentUsername,
  from,
  to,
  timestamp,
  isGuestPage,
}) => {
  const isReceive = currentUsername === from;
  const countedPercent = percent / 100;
  const link = isReceive ? to : from;
  const isCountedPercent = percent === 0;

  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__avatar">
        <Avatar username={from} size={40} />
      </div>
      <div className="UserWalletTransactions__content">
        <div>
          {!isCountedPercent ? (
            <FormattedMessage
              id="withdraw_vesting_route_is_set"
              defaultMessage="Withdraw vesting route is set"
            />
          ) : (
            <FormattedMessage
              id="withdraw_vesting_route_is_canceled"
              defaultMessage="Withdraw vesting route is canceled"
            />
          )}{' '}
          {isReceive ? (
            <FormattedMessage id="lowercase_to" defaultMessage="to" />
          ) : (
            <FormattedMessage id="lowercase_from" defaultMessage="from" />
          )}
          <span className="UserWalletTransactions__delegated">
            <a className="UserWalletTransactions__delegated-color" href={`/@${link}`}>
              {link}
            </a>
          </span>
        </div>
        <CardsTimeStamp timestamp={isGuestPage ? `${timestamp}Z` : timestamp} />
        <div>
          <span className="UserWalletTransactions__delegated">
            <FormattedMessage id="percent" defaultMessage="Percent" />:{' '}
          </span>{' '}
          {countedPercent}%
        </div>
      </div>
    </div>
  );
};

SetWithdrawVestingRoute.propTypes = {
  from: PropTypes.string,
  to: PropTypes.string,
  timestamp: PropTypes.string,
  isGuestPage: PropTypes.bool,
  percent: PropTypes.string,
  currentUsername: PropTypes.string,
};

SetWithdrawVestingRoute.defaultProps = {
  currentUsername: '',
  from: '',
  to: '',
  timestamp: '',
  isGuestPage: false,
  percent: '',
};

export default SetWithdrawVestingRoute;
