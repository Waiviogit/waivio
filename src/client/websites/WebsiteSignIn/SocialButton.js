import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { isMobile } from '../../../common/helpers/apiHelpers';

import styles from './styles';
import './WebsiteSignIn.less';

const SocialButton = props => (
  // eslint-disable-next-line jsx-a11y/interactive-supports-focus
  <div
    className="SocialButton"
    style={isMobile() ? styles.mobileButton : styles.button}
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
    {props.intl.formatMessage({ id: 'join_with', defaultMessage: 'Join with' })}
    <i
      style={{
        marginLeft: '3px',
      }}
    >
      {props.socialNetwork}
    </i>
  </div>
);

SocialButton.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  socialNetwork: PropTypes.string.isRequired,
  size: PropTypes.string,
  onClick: PropTypes.func,
};

SocialButton.defaultProps = {
  href: '',
  size: '22px',
  onClick: () => {},
};

export default injectIntl(SocialButton);
