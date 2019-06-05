import React from 'react';
import { FormattedMessage } from 'react-intl';
import './SidebarBlock.less';
import ModalSignUp from '../Navigation/ModalSignUp/ModalSignUp';

const SignUp = () => (
  <div className="SidebarBlock">
    <h3 className="SidebarBlock__title">
      <FormattedMessage id="new_to_busy" defaultMessage="New to Waivio?" />
    </h3>
    <ModalSignUp isButton />
  </div>
);

export default SignUp;
