import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isMobile } from '../../../common/helpers/apiHelpers';
import styles from './styles';

const SocialGiftsButton = props => (
  // eslint-disable-next-line jsx-a11y/interactive-supports-focus
  <div
    className="SocialGiftsButton"
    style={isMobile() ? styles.mobileButton : styles.socialButton}
    onClick={props.onClick}
  >
    <img
      src={`/images/icons/${props.socialNetwork.toLowerCase()}-logo.png`}
      alt={`${props.socialNetwork}-logo`}
      style={{
        marginRight: '10px',
        width: props.size,
      }}
    />{' '}
    <div style={{ ...styles.socialButtonText, marginRight: `${parseInt(props.size, 10) + 10}px` }}>
      {props.intl.formatMessage({ id: 'continue_with', defaultMessage: 'Continue with' })}{' '}
      {props.socialNetwork}
    </div>
  </div>
);

SocialGiftsButton.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  socialNetwork: PropTypes.string.isRequired,
  size: PropTypes.string,
  onClick: PropTypes.func,
};

SocialGiftsButton.defaultProps = {
  href: '',
  size: '22px',
  onClick: () => {},
};

export default injectIntl(SocialGiftsButton);
