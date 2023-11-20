import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import ModalSignIn from '../Navigation/ModlaSignIn/ModalSignIn';
import { getConfigurationValues, getIsWaivio } from '../../../store/appStore/appSelectors';

import './SidebarBlock.less';

const SignUp = () => {
  const config = useSelector(getConfigurationValues);
  const isWaivio = useSelector(getIsWaivio);
  const currHost = config?.host || (typeof location !== 'undefined' && location.hostname);
  const site = isWaivio ? 'Waivio' : config?.header?.name || currHost;

  return (
    <div className="SidebarBlock">
      <h3 className="SidebarBlock__title">
        <FormattedMessage
          id="new_to_site"
          defaultMessage="New to {site}?"
          values={{
            site,
          }}
        />
      </h3>
      <ModalSignIn isButton />
    </div>
  );
};

export default SignUp;
