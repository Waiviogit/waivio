import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const SteemSignUpCard = ({ isNightmode }) => (
  <div className="SignUpCard">
    <div className="SignUpCard__line">
      <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
        <img
          alt="linkLogo"
          src={
            isNightmode
              ? '/images/icons/logo-hive-big-nightmode.svg'
              : '/images/icons/logo-hive-big.svg'
          }
        />
      </a>
    </div>
    <div className="ModalSignUp__link mb3">
      <FormattedMessage id="freeSteemAcc" defaultMessage="- get a free Hive account" />
      <FormattedMessage id="emailAndPhoneReq" defaultMessage="- email required" />
    </div>
    <a target="_blank" rel="noopener noreferrer" href={process.env.SIGNUP_URL}>
      <FormattedMessage id="signup" defaultMessage="Sign up" />
    </a>
  </div>
);
SteemSignUpCard.propTypes = {
  isNightmode: PropTypes.bool.isRequired,
};

SteemSignUpCard.defaultProps = {
  isNightmode: true,
};

export default SteemSignUpCard;
