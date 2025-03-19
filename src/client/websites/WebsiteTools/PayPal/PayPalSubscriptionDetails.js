import React from 'react';
import { FormattedDate, FormattedNumber, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Loading from '../../../components/Icon/Loading';

const PayPalSubscriptionDetails = ({ info, loading }) =>
  loading ? (
    <Loading />
  ) : (
    <>
      {!_.isEmpty(info) && (
        <div>
          <div>
            {' '}
            <b>Amount:</b>{' '}
            <FormattedNumber value={info?.billing_info?.last_payment?.amount?.value} />{' '}
            {info?.billing_info?.last_payment?.amount?.currency_code}
          </div>
          <div>
            <b>Next payment date:</b>{' '}
            <FormattedDate value={info?.billing_info?.next_billing_time} />{' '}
            <FormattedTime value={info?.billing_info?.next_billing_time} />
          </div>
          <div>
            {' '}
            <b>Email:</b> {info?.subscriber?.email_address}
          </div>
        </div>
      )}
    </>
  );

PayPalSubscriptionDetails.propTypes = {
  info: PropTypes.shape(),
  loading: PropTypes.bool,
};

export default PayPalSubscriptionDetails;
