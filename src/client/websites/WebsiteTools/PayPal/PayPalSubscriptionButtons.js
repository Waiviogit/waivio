import React from 'react';
import { message } from 'antd';
import PropTypes from 'prop-types';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { sendPayPalSubscriptionId } from '../../../../waivioApi/ApiClient';

import { setShowPayPal } from '../../../../store/websiteStore/websiteActions';
import Loading from '../../../components/Icon/Loading';

const PayPalSubscriptionButtons = ({ clientId, planId, host, userName, dispatch, setHost }) => (
  <div>
    {clientId && planId ? (
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
          <div className={'mt3 flex justify-center mb2'}>Pay for website hosting using PayPal!</div>
          <PayPalButtons
            style={{
              layout: 'vertical',
              label: 'subscribe',
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
                .then(() => message.success('Subscription successful!'))
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
};
export default PayPalSubscriptionButtons;
