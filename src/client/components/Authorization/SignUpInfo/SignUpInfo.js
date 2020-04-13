import React from 'react';
import { FormattedMessage } from 'react-intl';

const SignUpInfo = () => (
  <React.Fragment>
    <div className="ModalSignUp__subtitle">
      <FormattedMessage id="payOneTimeFee" defaultMessage="or pay a one-time fee (about $3)" />
      <FormattedMessage id="getSteemAccountNow" defaultMessage="to get a Hive account now using:" />
    </div>
    <div className="mb3">
      <a
        href="https://hivewallet.app/"
        className="ModalSignUp__link"
        rel="noopener noreferrer"
        target="_blank"
      >
        <FormattedMessage id="signUp_creditCards" defaultMessage="- credit cards" />
      </a>
      <a
        href="https://blocktrades.us/en/create-hive-account"
        className="ModalSignUp__link"
        rel="noopener noreferrer"
        target="_blank"
      >
        <FormattedMessage id="signUp_cryptos" defaultMessage="- CRYPTOS" />
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
    <div>
      <a href="https://beaxy.com/register/">
        <div className="ModalSignUp__signin" role="presentation">
          <img
            src="/images/investarena/beaxy.png"
            alt="Beaxy 2.0"
            className="ModalSignUp__icon-beaxy"
          />
          <FormattedMessage id="signin_with_beaxy" defaultMessage="Beaxy" />
        </div>
      </a>
    </div>
  </React.Fragment>
);

export default SignUpInfo;
