import React from 'react';
import PropTypes from 'prop-types';

import '../Deposit.less';

const AccountSection = ({ account }) => (
  <div className={'Deposit__section'}>
    <h4>Account:</h4>
    <p className="Deposit__input">{account}</p>
  </div>
);

AccountSection.propTypes = {
  account: PropTypes.string.isRequired,
};

export default AccountSection;
