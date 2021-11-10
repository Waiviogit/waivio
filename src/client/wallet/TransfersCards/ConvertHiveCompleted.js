import React from 'react';
import PropTypes from 'prop-types';

import CardsTimeStamp from './CardsTimeStamp';

const ConvertHiveCompleted = ({ amount, timestamp, isGuestPage }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-wrapper">
      <img
        src="../images/icons/convert.svg"
        className="UserWalletTransactions__convert-icon"
        alt="convert"
      />
    </div>

    <div className="UserWalletTransactions__content">
      {`HIVE>HBD: adjusted collateral release`}
      <CardsTimeStamp timestamp={isGuestPage ? `${timestamp}Z` : timestamp} />
    </div>
    <div className={'UserWalletTransactions__content-recipient'}>
      <div className="UserWalletTransactions__completed"> {`+ ${amount}`}</div>
    </div>
  </div>
);

ConvertHiveCompleted.propTypes = {
  amount: PropTypes.string,
  timestamp: PropTypes.string,
  isGuestPage: PropTypes.bool,
};

ConvertHiveCompleted.defaultProps = {
  amount: '',
  timestamp: '',
  isGuestPage: false,
};

export default ConvertHiveCompleted;
