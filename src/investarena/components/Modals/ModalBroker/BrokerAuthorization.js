import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Select, Button, Form, Input, Checkbox, Icon } from 'antd';
import { optionsPlatform } from '../../../constants/selectData';

const propTypes = {
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
    const { getFieldDecorator } = this.props.form;
    return (
      <Form
        onSubmit={this.props.brokerConnected ? this.disconnectBroker : this.connectBroker}
        className="login-form"
      >
        <div className="d-flex justify-content-center st-margin-bottom-middle">
          <div className="st-broker-select-title">
            {this.props.intl.formatMessage({
              id: 'modalBroker.connectTo',
              defaultMessage: 'Connect to:',
            })}
          </div>
        </div>
        {getFieldDecorator('platform', {
          initialValue: this.props.brokerConnected
            ? this.props.platformName
            : null || optionsPlatform[0].value,
        })(
          <Select
            style={{ width: '100%' }}
            placeholder={this.props.intl.formatMessage({
              id: 'tooltip.empty',
              defaultMessage: 'Please fill in this field',
            })}
            disabled={this.props.brokerConnected}
          >
            {_.map(optionsPlatform, option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
          </Select>,
        )}
        {!this.props.brokerConnected ? (
          <FormItem>
            {getFieldDecorator('email', {
              rules: [
                {
                  type: 'email',
                  message: this.props.intl.formatMessage({
                    id: 'tooltip.emailValid',
                    defaultMessage: 'Please enter a valid email',
                  }),
                },
                {
                  required: true,
                  message: this.props.intl.formatMessage({
                    id: 'tooltip.empty',
                    defaultMessage: 'Please fill in this field',
                  }),
                },
              ],
            })(
              <Input
                prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="E-mail"
                disabled={this.props.brokerConnected}
              />,
            )}
          </FormItem>
        ) : (
          <div className="d-flex flex-column align-items-center st-margin-bottom-middle">
            <div className="st-broker-text">{this.props.email}</div>
          </div>
        )}
        {!this.props.brokerConnected && (
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your Password!' },
                { min: 5, message: 'Require more then 5 symbols' },
              ],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="Password"
                disabled={this.props.brokerConnected}
              />,
            )}
          </FormItem>
        )}
        <div className="d-flex justify-content-between">
          {/* todo: hided forgot password link */}
          {/* {!this.props.brokerConnected ? ( */}
            {/* <span className="st-modal-broker-authorization-text-click"> */}
              {/* {this.props.intl.formatMessage({ */}
                {/* id: 'modalBroker.forgotPassword', */}
                {/* defaultMessage: 'Forgot password?', */}
              {/* })} */}
            {/* </span> */}
          {/* ) : ( */}
            {/* <span /> */}
          {/* )} */}
          <span />
          <Checkbox onChange={this.handleOneClickTrading} checked={this.state.checked}>
            {this.props.intl.formatMessage({
              id: 'modalBroker.oneClickTrade',
              defaultMessage: 'One click trade',
            })}
          </Checkbox>
        </div>
        <div className="d-flex flex-column align-items-center st-margin-bottom-middle">
          <div className="st-broker-text">
            {this.props.intl.formatMessage({
              id: 'modalBroker.weNeverKeep',
              defaultMessage: 'We never keep your passwords',
            })}
          </div>
          <div className="st-broker-text">
            {this.props.intl.formatMessage({
              id: 'modalBroker.tradingAccounts',
              defaultMessage: 'from brokers trading accounts',
            })}
          </div>
          <div className="st-broker-text">
            {this.props.intl.formatMessage({
              id: 'modalBroker.brokers',
              defaultMessage: 'in our database.',
            })}
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <Button
            htmlType="submit"
            type={!this.props.brokerConnected ? 'primary' : 'danger'}
            disabled={this.props.isLoading}
            loading={this.props.isLoading}
          >
            {!this.props.brokerConnected
              ? this.props.intl.formatMessage({
                  id: 'modalBroker.connect',
                  defaultMessage: 'CONNECT',
                })
              : this.props.intl.formatMessage({
                  id: 'modalBroker.disconnect',
                  defaultMessage: 'DISCONNECT',
                })}
          </Button>
        </div>
      </Form>
    );
  }
}

BrokerAuthorization.propTypes = propTypes;

export default injectIntl(Form.create()(BrokerAuthorization));
