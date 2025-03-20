import React from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { sendPayPalSubscriptionId } from '../../../../waivioApi/ApiClient';

import { getManageInfo, setShowPayPal } from '../../../../store/websiteStore/websiteActions';
import Loading from '../../../components/Icon/Loading';

const PayPalSubscriptionButtons = ({
  clientId,
  planId,
  host,
  userName,
  dispatch,
  setHost,
  loading,
}) => (
  <div>
    {!loading ? (
      <PayPalScriptProvider
        deferLoading={false}
        options={{
          'client-id': clientId,
          vault: true,
          intent: 'subscription',
          components: 'buttons',
        }}
      >
        <div className="paypal-container" style={{ zIndex: '1100' }}>
          <div className={'PayPalModal__title'}>Pay for website hosting using PayPal</div>
          <p className={'PayPalModal__description'}>
            {' '}
            Ensure continuous website operation with the PayPal subscription option. For just $30
            per month, uninterrupted hosting services can be maintained without the need for manual
            payments. PayPal provides a secure, globally recognized payment solution, ensuring fast
            and reliable transactions. Subscribe today to maintain seamless website performance with
            ease and convenience.
          </p>
          <div className={'PayPalModal__payment'}>
            Monthly USD Subscription: <span className={'PayPalModal__amount'}>$ 30.00</span>
          </div>
          <PayPalButtons
            style={{
              layout: 'vertical',
            }}
            forceReRender={[planId, clientId]}
            createSubscription={(data, actions) =>
              actions.subscription.create({
                plan_id: planId,
                application_context: {
                  shipping_preference: 'NO_SHIPPING',
                  user_action: 'SUBSCRIBE_NOW',
                  return_url: window?.location.href,
                  cancel_url: window?.location.href,
                },
              })
            }
            onApprove={data => {
              const subscriptionId = data.subscriptionID;

              sendPayPalSubscriptionId(host, userName, subscriptionId)
                .then(() => {
                  message.success('Subscription successful!');
                  setTimeout(() => dispatch(getManageInfo(userName)), 2000);
                })
                .catch(error => console.error('PayPal subscription error', error));
              dispatch(setShowPayPal(false));

              setHost(undefined);
            }}
            onCancel={() => {}}
            onError={err => {
              console.error('Subscription Error:', err);
            }}
          />
        </div>
      </PayPalScriptProvider>
    ) : (
      <Loading />
    )}
  </div>
);

PayPalSubscriptionButtons.propTypes = {
  clientId: PropTypes.string,
  planId: PropTypes.string,
  host: PropTypes.string,
  userName: PropTypes.string,
  dispatch: PropTypes.func,
  setHost: PropTypes.func,
  loading: PropTypes.bool,
};
export default PayPalSubscriptionButtons;
