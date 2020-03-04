import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

const BeaxySignInButton = props => (
  <div className="ModalSignUp__signin" role="presentation" onClick={props.onClick}>
    <img
      src="/images/investarena/beaxy.png" // todo: add icon to project
      alt="Beaxy 2.0"
      className="ModalSignUp__icon-beaxy"
    />
    <FormattedMessage id="signin_with_beaxy" defaultMessage="Beaxy" />
  </div>
);

BeaxySignInButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

BeaxySignInButton.defaultProps = {};

export default React.memo(BeaxySignInButton);
