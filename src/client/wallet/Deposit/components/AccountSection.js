import { Input } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

import '../Deposit.less';

const AccountSection = ({ account }) => (
  <div className={'Deposit__section'}>
    <h4>Account</h4>
    <Input className="Deposit__input" value={account} />
  </div>
);

AccountSection.propTypes = {
  account: PropTypes.string.isRequired,
};

export default AccountSection;
