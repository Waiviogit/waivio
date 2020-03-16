import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Select, Button, Form, Input, Checkbox, Icon } from 'antd';
import BeaxyAuthForm from '../../../../client/components/Authorization/GuestSignUpForm/BeaxyAuthForm';
import { optionsPlatform } from '../../../constants/selectData';

const propTypes = {
  form: PropTypes.shape().isRequired,
  isLoading: PropTypes.bool.isRequired,
  platformName: PropTypes.string,
  email: PropTypes.string,
  forgotPassBroker: PropTypes.func.isRequired,
  authorizeBroker: PropTypes.func.isRequired,
  disconnectBroker: PropTypes.func.isRequired,
  changeEmail: PropTypes.func.isRequired,
  brokerConnected: PropTypes.bool.isRequired,
  intl: PropTypes.shape().isRequired,
};

const FormItem = Form.Item;
const Option = Select.Option;

class BrokerAuthorization extends Component {
  state = {
    checked: localStorage.getItem('isOneClickTrade') === 'true' || false,
  };
  connectBroker = event => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.changeEmail(values.email);
        this.props.authorizeBroker(values);
      }
    });
  };
  disconnectBroker = event => {
    event.preventDefault();
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
          btnText={
            <span>
              {this.props.intl.formatMessage({
                id: 'modalBroker.connect',
                defaultMessage: 'Connect',
              })}
            </span>
          }
          form={this.props.form}
          firstLoginResponse={res => console.log('\tonFirstLoginResponse ', res)}
        />
      </React.Fragment>
    );
  }
}

BrokerAuthorization.propTypes = propTypes;

export default injectIntl(Form.create()(BrokerAuthorization));
