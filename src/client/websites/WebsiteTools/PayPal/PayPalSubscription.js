import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { getShowPaypal } from '../../../../store/websiteStore/websiteSelectors';
import { setShowPayPal } from '../../../../store/websiteStore/websiteActions';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import {
  getPayPalSubscriptionBasic,
  getPayPalSubscriptionDetails,
} from '../../../../waivioApi/ApiClient';
import PayPalSubscriptionDetails from './PayPalSubscriptionDetails';
import PayPalSubscriptionButtons from './PayPalSubscriptionButtons';

const PayPalSubscription = ({ host, setHost, isSubscribe }) => {
  const [planId, setPlanId] = useState(undefined);
  const [subscriptionInfo, setSubscriptionInfo] = useState({});
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const userName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    if (host) {
      isSubscribe
        ? getPayPalSubscriptionBasic(host, userName).then(response => {
            dispatch(setShowPayPal(true));
            setPlanId(response?.id);
          })
        : getPayPalSubscriptionDetails(host, userName).then(r => {
            dispatch(setShowPayPal(true));
            setSubscriptionInfo(r);
          });
    }
  }, [host]);

  const showPayPal = useSelector(getShowPaypal);
  const dispatch = useDispatch();

  return (
    <Modal
      zIndex={100}
      title={isSubscribe ? 'Subscribe' : 'Manage subscription'}
      className={'DynamicTable__modal'}
      visible={isSubscribe ? showPayPal && planId && clientId : showPayPal}
      footer={[
        <Button key="ok" type="primary" onClick={() => dispatch(setShowPayPal(false))}>
          <FormattedMessage id="ok" defaultMessage="Ok" />
        </Button>,
      ]}
      onCancel={() => {
        setHost(undefined);
        dispatch(setShowPayPal(false));
      }}
    >
      {isSubscribe ? (
        <PayPalSubscriptionButtons
          host={host}
          clientId={clientId}
          planId={planId}
          userName={userName}
          setHost={setHost}
          dispatch={dispatch}
        />
      ) : (
        !_.isEmpty(subscriptionInfo) && <PayPalSubscriptionDetails info={subscriptionInfo} />
      )}
    </Modal>
  );
};

PayPalSubscription.propTypes = {
  host: PropTypes.string,
  setHost: PropTypes.func,
  isSubscribe: PropTypes.bool,
};
export default PayPalSubscription;
