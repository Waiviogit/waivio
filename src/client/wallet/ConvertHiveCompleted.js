import React from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import BTooltip from '../components/BTooltip';

import { epochToUTC } from '../helpers/formatter';

const ConvertHiveCompleted = ({ amount_in, excess, amount, timestamp, isGuestPage }) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-wrapper">
      <img
        src="../images/icons/convert.svg"
        className="UserWalletTransactions__convert-icon"
        alt="convert"
      />
    </div>

    <div className="UserWalletTransactions__content">
      {`HIVE>HBD:  request ${amount_in} converted, ${excess} returned`}
      <span className="UserWalletTransactions__timestamp">
        {isGuestPage ? (
          <BTooltip
            title={
              <span>
                <FormattedDate value={`${timestamp}Z`} /> <FormattedTime value={`${timestamp}Z`} />
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
    </div>
    <div className={'UserWalletTransactions__content-recipient'}>
      <div className="UserWalletTransactions__completed"> {`+ ${amount}`}</div>
    </div>
  </div>
);

ConvertHiveCompleted.propTypes = {
  amount: PropTypes.string,
  amount_in: PropTypes.string,
  excess: PropTypes.string,
  timestamp: PropTypes.string,
  isGuestPage: PropTypes.bool,
};

ConvertHiveCompleted.defaultProps = {
  amount: '',
  timestamp: '',
  isGuestPage: false,
  excess: '',
  amount_in: '',
};

export default ConvertHiveCompleted;
