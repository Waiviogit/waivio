import React from 'react';
import PropTypes from 'prop-types';
import { FormattedRelative, FormattedDate, FormattedTime } from 'react-intl';
import BTooltip from '../components/BTooltip';

import { epochToUTC } from '../helpers/formatter';

const ConvertHbdCompleted = ({ amount, timestamp, isGuestPage }) => (
  <div className="UserWalletTransactions__transaction">
    <img
      src="/images/icons/convert.svg"
      className="UserWalletTransactions__svg"
      alt="Convert logo"
    />

    <div className="UserWalletTransactions__content">
      {'HBD > HIVE conversion completed'}
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
      <div className="UserWalletTransactions__completed"> {`+${amount}`}</div>
    </div>
  </div>
);

ConvertHbdCompleted.propTypes = {
  amount: PropTypes.string,
  timestamp: PropTypes.string,
  isGuestPage: PropTypes.bool,
};

ConvertHbdCompleted.defaultProps = {
  amount: '',
  timestamp: '',
  isGuestPage: false,
};

export default ConvertHbdCompleted;
