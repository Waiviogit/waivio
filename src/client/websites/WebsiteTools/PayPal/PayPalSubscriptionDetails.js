import React from 'react';
import { FormattedDate, FormattedNumber, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';
import _ from 'lodash';
import Loading from '../../../components/Icon/Loading';

const PayPalSubscriptionDetails = ({ info, loading }) => {
  const add30Days = createDate => {
    const newDate = new Date(createDate);

    newDate.setUTCDate(newDate.getUTCDate() + 30);

    return newDate.toISOString();
  };
  const nextDate = info?.billing_info?.next_billing_time || add30Days(info?.create_time);

  return loading ? (
    <Loading />
  ) : (
    <>
      {!_.isEmpty(info) && (
        <div>
          <div>
            {' '}
            <b>Status:</b> {info?.status}
          </div>
          <div>
            {' '}
            <b>Amount:</b>{' '}
            <FormattedNumber value={info?.billing_info?.last_payment?.amount?.value} />{' '}
            {info?.billing_info?.last_payment?.amount?.currency_code}
          </div>
          <div>
            <b>Next payment date:</b> <FormattedDate value={nextDate} />{' '}
            <FormattedTime value={nextDate} />
          </div>
          <div>
            {' '}
            <b>Email:</b> {info?.subscriber?.email_address}
          </div>
        </div>
      )}
    </>
  );
};

PayPalSubscriptionDetails.propTypes = {
  info: PropTypes.shape(),
  loading: PropTypes.bool,
};

export default PayPalSubscriptionDetails;
