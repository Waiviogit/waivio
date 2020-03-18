import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import BeaxyAuthForm from '../../../../client/components/Authorization/BeaxyAuthForm/BeaxyAuthForm';
import api from '../../../../investarena/configApi/apiResources';
import { initBrokerConnection } from '../../../redux/actions/brokersActions';

const propTypes = {
  // isLoading: PropTypes.bool.isRequired,
  // platformName: PropTypes.string,
  // authorizeBroker: PropTypes.func.isRequired,
  disconnectBroker: PropTypes.func.isRequired,
  // brokerConnected: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
};

class BrokerAuthorization extends Component {
  state = {
    checked: localStorage.getItem('isOneClickTrade') === 'true' || false,
  };

  connectBroker = (user, password) =>
    api.brokers.authorizeBroker({
      platform: 'beaxy',
      authBy: 'credentials',
      authData: {
        user,
        password,
      },
    });

  broker2FAVerification(user, token2fa, code) {
    return api.brokers.authorizeBroker({
      platform: 'beaxy',
      authBy: '2fa',
      authData: {
        token2fa,
        code,
      },
    });
  }

  handleAuthSuccess = () => initBrokerConnection({ platform: 'beaxy' });

  disconnectBroker = () => {
    this.props.disconnectBroker();
  };

  handleOneClickTrading = e => {
    localStorage.setItem('isOneClickTrade', e.target.checked);
    this.setState({ checked: e.target.checked });
  };

  render() {
    return (
      <React.Fragment>
        <BeaxyAuthForm
          authRequest={this.connectBroker}
          auth2FARequest={this.broker2FAVerification}
          btnText={
            <span>
              {this.props.intl.formatMessage({
                id: 'modalBroker.connect',
                defaultMessage: 'Connect',
              })}
            </span>
          }
          firstLoginResponse={res =>
            console.log(
              "\tonFirstLoginResponse - we shouldn't see this message in the console",
              res,
            )
          }
          onAuthSuccessAction={this.handleAuthSuccess}
        />
      </React.Fragment>
    );
  }
}

BrokerAuthorization.propTypes = propTypes;

export default injectIntl(BrokerAuthorization);
