import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
import './PayPal.less';

const PayPalSubscription = ({ host, setHost, isSubscribe }) => {
  const [planId, setPlanId] = useState(undefined);
  const [subscriptionInfo, setSubscriptionInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const userName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    if (host) {
      dispatch(setShowPayPal(true));
      isSubscribe
        ? getPayPalSubscriptionBasic(host, userName).then(response => {
            setPlanId(response?.id);
            setLoading(false);
          })
        : getPayPalSubscriptionDetails(host, userName).then(r => {
            setSubscriptionInfo(r);
            setLoading(false);
          });
    }
  }, [host]);

  const showPayPal = useSelector(getShowPaypal);
  const dispatch = useDispatch();

  return (
    <Modal
      zIndex={100}
      title={isSubscribe ? 'Subscribe' : 'Manage subscription'}
      wrapClassName={'PayPalModal'}
      visible={showPayPal}
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
          loading={loading}
          host={host}
          clientId={clientId}
          planId={planId}
          userName={userName}
          setHost={setHost}
          dispatch={dispatch}
        />
      ) : (
        <PayPalSubscriptionDetails info={subscriptionInfo} loading={loading} />
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
