import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const SignUpButton = ({ isButton, setIsModalOpen, className, text }) =>
  isButton ? (
    <button onClick={() => setIsModalOpen(true)} className={className || 'ModalSignIn__button'}>
      {text || <FormattedMessage id="signin" defaultMessage="Sign in" />}
    </button>
  ) : (
    <a role="presentation" onClick={() => setIsModalOpen(true)}>
      <FormattedMessage id="signin" defaultMessage="Sign in" />
    </a>
  );

SignUpButton.propTypes = {
  isButton: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  className: PropTypes.string,
  text: PropTypes.string,
};

SignUpButton.defaultProps = {
  isButton: true,
  setIsModalOpen: () => {},
  className: '',
  text: '',
};

export default React.memo(SignUpButton);
