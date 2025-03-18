import React from 'react';
import { FormattedDate, FormattedNumber, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';

const PayPalSubscriptionDetails = ({ info }) => {
  const { next_billing_time, last_payment } = info?.billing_info;

  return (
    <div>
      <div>
        {' '}
        <b>Amount:</b> <FormattedNumber value={last_payment?.amount?.value} />{' '}
        {last_payment?.amount?.currency_code}
      </div>
      <div>
        <b>Next payment date:</b> <FormattedDate value={next_billing_time} />{' '}
        <FormattedTime value={next_billing_time} />
      </div>
    </div>
  );
};

PayPalSubscriptionDetails.propTypes = {
  info: PropTypes.shape(),
};

export default PayPalSubscriptionDetails;
