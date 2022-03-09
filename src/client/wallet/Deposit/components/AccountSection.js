import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import CopyButton from '../../../widgets/CopyButton/CopyButton';

import '../Deposit.less';

const AccountSection = ({ account }) => (
  <div className={'Deposit__section'}>
    <h4>
      {' '}
      <FormattedMessage id="account" defaultMessage="Account" />:
    </h4>
    <CopyButton className="Deposit__input" text={account} />
  </div>
);

AccountSection.propTypes = {
  account: PropTypes.string.isRequired,
};

export default AccountSection;
