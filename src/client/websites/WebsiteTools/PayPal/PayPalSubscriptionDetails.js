import React from 'react';
import { FormattedDate, FormattedNumber, FormattedTime } from 'react-intl';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Button } from 'antd';
import Loading from '../../../components/Icon/Loading';

const add30Days = createDate => {
  if (!createDate || typeof createDate !== 'string') {
    return null;
  }

  const newDate = new Date(createDate);

  if (isNaN(newDate.getTime())) {
    return null;
  }

  newDate.setUTCDate(newDate.getUTCDate() + 30);

  return newDate.toISOString();
};

const PayPalSubscriptionDetails = ({ info, loading, cancelSubscription }) => {
  const isActive = info?.status === 'ACTIVE';
  const status = isActive ? 'Active' : 'Canceled';
  const nextDate = isActive
    ? info?.billing_info?.next_billing_time
    : add30Days(info?.create_time) || null;

  return loading ? (
    <Loading />
  ) : (
    <>
      {!_.isEmpty(info) && (
        <div>
          <div>
            {' '}
            <b>Status:</b> {status}
          </div>
          <div>
            {' '}
            <b>Amount:</b>{' '}
            <FormattedNumber value={info?.billing_info?.last_payment?.amount?.value} />{' '}
            {info?.billing_info?.last_payment?.amount?.currency_code}
          </div>
          <div>
            <b>{isActive ? 'Next payment date' : 'Active until'}:</b>{' '}
            <FormattedDate value={nextDate} /> <FormattedTime value={nextDate} />
          </div>
          <div>
            {' '}
            <b>Email:</b> {info?.subscriber?.email_address}
          </div>
          {isActive && (
            <div className={'PayPalModal__cancel-container'}>
              <Button
                type={'danger'}
                className="EditDelegationModal__undelegate"
                onClick={cancelSubscription}
              >
                Cancel subscription
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

PayPalSubscriptionDetails.propTypes = {
  info: PropTypes.shape(),
  loading: PropTypes.bool,
  cancelSubscription: PropTypes.func,
};

export default PayPalSubscriptionDetails;
