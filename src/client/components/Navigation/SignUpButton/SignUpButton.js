import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const SignUpButton = ({ isButton, setIsModalOpen, className, text }) => {
  const onClick = useCallback(() => {
    const evenName = text ? text.replace(' ', '_').toLowerCase() : 'sign_in';

    if (window.gtag) window.gtag('event', evenName);
    setIsModalOpen(true);
  }, []);

  if (isButton)
    return (
      <button onClick={onClick} className={className || 'ModalSignIn__button'}>
        {text || <FormattedMessage id="signin" defaultMessage="Sign in" />}
      </button>
    );

  return (
    <a role="presentation" onClick={onClick} className="ModalSignIn__link-type">
      <FormattedMessage id="signin" defaultMessage="Sign in" />
    </a>
  );
};

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
