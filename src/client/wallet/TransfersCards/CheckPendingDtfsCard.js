import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';
import CardsTimeStamp from './CardsTimeStamp';

const CheckPendingDtfs = ({ memo, amount, timestamp, isGuestPage }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <Icon type={'rise'} style={{ fontSize: '16px' }} className="UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <div>Token fund</div>
        <div className="UserWalletTransactions__received">
          {'+ '}
          {amount}
        </div>
      </div>
      <CardsTimeStamp timestamp={isGuestPage ? `${timestamp}Z` : timestamp} />
      <span className="UserWalletTransactions__memo">{memo}</span>
    </div>
  </div>
);

CheckPendingDtfs.propTypes = {
  memo: PropTypes.string,
  amount: PropTypes.element,
  timestamp: PropTypes.number,
  isGuestPage: PropTypes.bool,
};

CheckPendingDtfs.defaultProps = {
  amount: <span />,
  timestamp: 0,
};

export default CheckPendingDtfs;
