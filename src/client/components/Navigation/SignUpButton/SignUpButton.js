import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const SignUpButton = ({ isButton, setIsModalOpen }) =>
  isButton ? (
    <button onClick={() => setIsModalOpen(true)} className="ModalSignUp__button">
      <FormattedMessage id="signup" defaultMessage="Sign up" />
    </button>
  ) : (
    <a role="presentation" onClick={() => setIsModalOpen(true)}>
      <FormattedMessage id="signup" defaultMessage="Sign up" />
    </a>
  );

SignUpButton.propTypes = {
  isButton: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
};

SignUpButton.defaultProps = {
  isButton: true,
  setIsModalOpen: () => {},
};

export default SignUpButton;
