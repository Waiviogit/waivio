import React from 'react';
import { FormattedMessage } from 'react-intl';
import './SidebarBlock.less';
import ModalSignUp from '../Authorization/ModalSignUp/ModalSignUp';

const SignUp = () => (
  <div className="SidebarBlock">
    <h3 className="SidebarBlock__title">
      <FormattedMessage id="new_to_busy" defaultMessage="New to InvestArena?" />
    </h3>
    <ModalSignUp isButton />
  </div>
);

export default SignUp;
