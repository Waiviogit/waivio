import React from 'react';
import { FormattedMessage } from 'react-intl';

const SteemSignUpCard = () => (
  <div className="SignUpCard">
    <div className="SignUpCard__line">
      <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
        <img alt="linkLogo" src="/images/icons/logo-hive-big.svg" />
      </a>
    </div>
    <div className="ModalSignUp__link mb3">
      <FormattedMessage id="freeSteemAcc" defaultMessage="- get a free Steem account" />
      <FormattedMessage id="emailAndPhoneReq" defaultMessage="- email & phone required" />
      <FormattedMessage id="longerWaiting" defaultMessage="- wait up to 2 weeks" />
    </div>
    <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
      <FormattedMessage id="signup" defaultMessage="Sign up" />
    </a>
  </div>
);

export default SteemSignUpCard;
