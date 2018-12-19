import _ from "lodash";
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Select, Button, Form, Input, Checkbox, Icon} from 'antd';
import { optionsPlatform } from '../../../constants/selectData';

const propTypes = {
    isLoading: PropTypes.bool.isRequired,
    forgotPassBroker: PropTypes.func.isRequired,
    authorizeBroker: PropTypes.func.isRequired,
    disconnectBroker: PropTypes.func.isRequired,
    brokerConnected: PropTypes.bool.isRequired,
    intl: PropTypes.object.isRequired
};

const FormItem = Form.Item;
const Option = Select.Option;
// const AutoCompleteOption = AutoComplete.Option;

class BrokerAuthorization extends Component {
  state = {
    checked: localStorage.getItem('isOneClickTrade') === 'true' || false,
  };
  connectBroker = () => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.authorizeBroker(values);
      }
    });
  };
  disconnectBroker = (event) => {
    event.preventDefault();
    this.props.disconnectBroker();
  };
  handleOneClickTrading = (e) => {
    localStorage.setItem('isOneClickTrade', e.target.checked);
    this.setState({checked: e.target.checked});
  };
  render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form onSubmit={this.props.brokerConnected ? this.disconnectBroker : this.connectBroker} className="login-form">
          <div className="d-flex justify-content-center st-margin-bottom-middle">
            <div className="st-broker-select-title">
              {this.props.intl.formatMessage({ id: 'modalBroker.connectTo' })}
            </div>
          </div>
          {
            getFieldDecorator('platform', {
              initialValue: optionsPlatform[0].value,
            })(
              <Select
                style={{ width: '100%'}}
                placeholder={this.props.intl.formatMessage({ id: 'tooltip.empty' })}
                disabled={this.props.brokerConnected}
              >
                {
                  _.map(optionsPlatform, option => {
                    return <Option key={option.value} value={option.value}>{option.label}</Option>
                  })
                }
              </Select>
            )
          }
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{
                type: 'email', message: this.props.intl.formatMessage({ id: 'tooltip.emailValid' }),
              }, {
                required: true, message: this.props.intl.formatMessage({ id: 'tooltip.empty' }),
              }],
            })(
              <Input
                prefix={
                  <Icon
                    type="mail"
                    style={{color: 'rgba(0,0,0,.25)'}}
                  />
                }
                placeholder="E-mail"
                disabled={this.props.brokerConnected}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [
                {required: true, message: 'Please input your Password!'},
                { min: 5, message: 'Require more then 5 symbols' }
              ],
            })(
              <Input
                prefix={
                  <Icon
                    type="lock"
                    style={{color: 'rgba(0,0,0,.25)'}}
                  />
                }
                type="password"
                placeholder="Password"
                disabled={this.props.brokerConnected}
              />
            )}
          </FormItem>
          <div className="d-flex justify-content-between">
            {!this.props.brokerConnected ? <span onClick={()=>{}} className="st-modal-broker-authorization-text-click">
                {this.props.intl.formatMessage({id: 'modalBroker.forgotPassword'})}
              </span> : <span/>
            }
              <Checkbox onChange={this.handleOneClickTrading} checked={this.state.checked}>
                {this.props.intl.formatMessage({ id: 'modalBroker.oneClickTrade' })}
              </Checkbox>
          </div>
          <div className="d-flex flex-column align-items-center st-margin-bottom-middle">
            <div className="st-broker-text">
              {this.props.intl.formatMessage({ id: 'modalBroker.weNeverKeep' })}
            </div>
            <div className="st-broker-text">
              {this.props.intl.formatMessage({ id: 'modalBroker.tradingAccounts' })}
            </div>
            <div className="st-broker-text">
              {this.props.intl.formatMessage({ id: 'modalBroker.brokers' })}
            </div>
          </div>
          <div className="d-flex justify-content-end">
            <Button
              htmlType="submit"
              type={!this.props.brokerConnected ? "primary" : "danger"}
              disabled={this.props.isLoading}
            >
              {!this.props.brokerConnected ? this.props.intl.formatMessage({ id: 'modalBroker.connect' }) : this.props.intl.formatMessage({ id: 'modalBroker.disconnect' })}
            </Button>
          </div>
        </Form>
      );
    }
}

BrokerAuthorization.propTypes = propTypes;

export default injectIntl(Form.create()(BrokerAuthorization));
