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
        href="https://steemwallet.app/widget/widget.html"
        className="ModalSignUp__link"
        rel="noopener noreferrer"
        target="_blank"
      >
        <FormattedMessage id="creditCards" defaultMessage="- credit cards" />
      </a>
      <a
        href="https://blocktrades.us/create-steem-account"
        className="ModalSignUp__link"
        rel="noopener noreferrer"
        target="_blank"
      >
        <FormattedMessage id="BTC_LTC_ETH" defaultMessage="- BTC/LTC/ETH" />
      </a>
      <a
        href="https://v2.steemconnect.com/accounts/create"
        className="ModalSignUp__link"
        rel="noopener noreferrer"
        target="_blank"
      >
        <FormattedMessage id="STEEMcoins" defaultMessage="- STEEM coins" />
      </a>
    </div>
    <h2 className="ModalSignUp__title ModalSignUp__title--lined mt3">
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
