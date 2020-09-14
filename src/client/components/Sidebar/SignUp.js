import React from 'react';
import { FormattedMessage } from 'react-intl';
import './SidebarBlock.less';
import ModalSignIn from '../Navigation/ModlaSignIn/ModalSignIn';

const SignUp = () => (
  <div className="SidebarBlock">
    <h3 className="SidebarBlock__title">
      <FormattedMessage id="new_to_busy" defaultMessage="New to Waivio?" />
    </h3>
    <ModalSignIn isButton />
  </div>
);

export default SignUp;
