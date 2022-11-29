import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import useWebsiteColor from '../../../../hooks/useWebsiteColor';
import { getIsWaivio } from '../../../../store/appStore/appSelectors';

const SignUpButton = ({ isButton, setIsModalOpen, className, text, intl }) => {
  const colors = useWebsiteColor();
  const isWaivio = useSelector(getIsWaivio);
  const styles = {
    border: `1px solid ${colors.background}`,
    color: colors.background,
  };
  const onClick = () => {
    const evenName = text ? text.replace(' ', '_').toLowerCase() : 'sign_in';

    if (window.gtag) window.gtag('event', evenName);
    setIsModalOpen(true);
  };

  if (isButton)
    return (
      <button onClick={onClick} className={className || 'ModalSignIn__button'}>
        {text || intl.formatMessage({ id: 'signin', defaultMessage: 'Sign in' })}
      </button>
    );

  return (
    <a
      role="presentation"
      onClick={onClick}
      className="ModalSignIn__link-type"
      style={isWaivio ? {} : styles}
    >
      {intl.formatMessage({ id: 'signin', defaultMessage: 'Sign in' })}
    </a>
  );
};

SignUpButton.propTypes = {
  isButton: PropTypes.bool,
  setIsModalOpen: PropTypes.func,
  className: PropTypes.string,
  text: PropTypes.string,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

SignUpButton.defaultProps = {
  isButton: true,
  setIsModalOpen: () => {},
  className: '',
  text: '',
};

export default injectIntl(React.memo(SignUpButton));
