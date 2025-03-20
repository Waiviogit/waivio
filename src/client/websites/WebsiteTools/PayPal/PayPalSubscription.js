import React, { useEffect, useState } from 'react';
import { Button, message, Modal } from 'antd';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getShowPaypal } from '../../../../store/websiteStore/websiteSelectors';
import { setShowPayPal } from '../../../../store/websiteStore/websiteActions';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import {
  cancelPayPalSubscription,
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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const userName = useSelector(getAuthenticatedUserName);

  const cancelModal = () => {
    setHost(undefined);
    dispatch(setShowPayPal(false));
  };

  const cancelSubscription = () => {
    setShowCancelModal(true);
  };

  const handleCancelSubscription = () => {
    cancelModal();
    cancelPayPalSubscription(host, userName).then(r => {
      if (r.message) {
        return message.error(r.message);
      }

      return message.success('Subscription was successfully canceled!');
    });
  };

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
    <>
      <Modal
        zIndex={100}
        title={isSubscribe ? 'Subscribe' : 'Manage subscription'}
        wrapClassName={'PayPalModal'}
        visible={showPayPal}
        footer={[
          <Button key="ok" type="primary" onClick={cancelModal}>
            <FormattedMessage id="ok" defaultMessage="Ok" />
          </Button>,
        ]}
        onCancel={cancelModal}
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
          <PayPalSubscriptionDetails
            info={subscriptionInfo}
            loading={loading}
            cancelSubscription={cancelSubscription}
          />
        )}
      </Modal>
      <Modal
        visible={showCancelModal}
        okText={'Confirm'}
        title={'Cancel subscription'}
        onCancel={() => setShowCancelModal(false)}
        onOk={handleCancelSubscription}
      >
        <p className={'flex justify-center'}>
          Are you sure you want to cancel your subscription? You will not be charged again, but you
          will retain access until the end of your current billing period.
        </p>
      </Modal>
    </>
  );
};

PayPalSubscription.propTypes = {
  host: PropTypes.string,
  setHost: PropTypes.func,
  isSubscribe: PropTypes.bool,
};
export default injectIntl(PayPalSubscription);
