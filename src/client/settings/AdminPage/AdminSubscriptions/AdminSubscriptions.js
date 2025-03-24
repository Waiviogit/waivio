import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { getSubscriptionsByAdminList } from '../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import { subscriptionsConfig } from '../../../newRewards/constants/adminPageConfigs';
import DynamicTbl from '../../../components/Tools/DynamicTable/DynamicTable';

const AdminSubscriptions = () => {
  const authUserName = useSelector(getAuthenticatedUserName);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    getSubscriptionsByAdminList(authUserName).then(r => {
      setSubscriptions(r);
    });
  }, [authUserName]);

  return (
    <div>
      <div className={'AdminPage__title-wrap'}>
        <div className={'AdminPage__title'}>Websites with PayPal subscriptions</div>
      </div>
      <DynamicTbl header={subscriptionsConfig} bodyConfig={subscriptions} />
    </div>
  );
};

export default injectIntl(AdminSubscriptions);
