import React from 'react';
import { FormattedMessage } from 'react-intl';

const SignUpInfo = () => (
  <React.Fragment>
    <div className="ModalSignUp__subtitle">
      <FormattedMessage id="payOneTimeFee" defaultMessage="or pay a one-time fee (about $3)" />
      <FormattedMessage
        id="getSteemAccountNow"
        defaultMessage="to get a Steem account now using:"
      />
    </div>
    <div className="mb3">
      <a
        href="https://hivewallet.app/"
        className="ModalSignUp__link"
        rel="noopener noreferrer"
        target="_blank"
      >
        <FormattedMessage id="creditCards" defaultMessage="- credit cards" />
      </a>
      <a
        href="https://blocktrades.us/en/create-hive-account"
        className="ModalSignUp__link"
        rel="noopener noreferrer"
        target="_blank"
      >
        <FormattedMessage id="cryptos_sing_up" defaultMessage="- CRYPTOS" />
      </a>
    </div>
    <h2 className="ModalSignUp__title ModalSignUp__title--lined">
      <span>
        <FormattedMessage id="guestAccounts" defaultMessage="GUEST ACCOUNTS" />
      </span>
    </h2>

    <div className="ModalSignUp__subtitle">
      <FormattedMessage
        id="lookAroundgetRewardsMakeConnections"
        defaultMessage="Look around, get rewards, make connections,"
      />
      <FormattedMessage
        id="createSteemAccountLater"
        defaultMessage="create a Steem account later"
      />
    </div>
  </React.Fragment>
);

export default SignUpInfo;
