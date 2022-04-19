import React from 'react';
import { FormattedMessage } from 'react-intl';
import HiveLogoBigIcon from '@icons/logo-hive-big.svg'

const SteemSignUpCard = () => (
  <div className="SignUpCard">
    <div className="SignUpCard__line">
      <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
        <img alt="linkLogo" src={HiveLogoBigIcon} />
      </a>
    </div>
    <div className="ModalSignUp__link mb3">
      <FormattedMessage id="freeSteemAcc" defaultMessage="- get a free Hive account" />
      <FormattedMessage id="emailAndPhoneReq" defaultMessage="- email required" />
    </div>
    <a target="_blank" rel="noopener noreferrer" href="https://esteem.app/signup">
      <FormattedMessage id="signup" defaultMessage="Sign up" />
    </a>
  </div>
);

export default SteemSignUpCard;
