import _ from "lodash";
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Select, Button, Form, Input, Tooltip} from 'antd';
import LoadingSpinner from '../../LoadingSpinner';
import ModalBrokerForgotPassword from '../ModalBrokerForgotPassword';
import { optionsPlatform } from '../../../constants/selectData';
import {validateRegexWithTooltip} from '../../../validate/validate';
import {validateRegistrationSignIn} from '../../../constants/constansValidate';

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
    constructor (props) {
        super(props);
        this.state = {
            selectedPlatform: 'umarkets',
            selectedBroker: null,
            isDisabled: false,
            isPlatformSelected: false,
            showPassword: false,
            isModalForgotPassword: false,
            confirmDirty: false,
            autoCompleteResult: [],
        };
    }
    componentDidMount () {
        this.inputs = {};
        this.inputs.loginInput = this.email;
        this.inputs.passwordInput = this.passwordInputRef;
        // Object.keys(this.inputs).forEach((key) => {
        //     validateRegexWithTooltip(this.inputs[key], 'change', validateRegistrationSignIn[this.inputs[key].getAttribute('data-validate')]);
        // });
        const value = localStorage.getItem('isOneClickTrade');
        this.checkboxOneClick.checked = (value === 'true');
    }
    handleBrokerChange = (event) => {
        this.setState({
            selectedBroker: event ? event.value : null,
            selectedPlatform: event ? event.broker_options.broker_name : null,
            email: event ? event.broker_options.email : '',
            isPlatformSelected: true
        });
        this.passwordInputRef.focus();
    };
    updateSelectedPlatform = (value) => {
        if (this.state.selectedPlatform !== value) {
            this.setState({selectedPlatform: value});
        }
    };
    handleInputChange = (event) => {
        const newState = {};
        newState[event.target.name] = event.target.value;
        this.setState(newState);
    };
    sendForm = (event) => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            this.props.authorizeBroker(values);
          }
        });
    };
    toggleModalForgotPassword = () => {
        this.setState({isModalForgotPassword: !this.state.isModalForgotPassword});
    };
    disconnectBroker = (event) => {
        event.preventDefault();
        this.props.disconnectBroker();
    };
    handleOneClickTrading = () => {
        const value = localStorage.getItem('isOneClickTrade');
        localStorage.setItem('isOneClickTrade', !(value === 'true'));
    };
    showPassword = () => {
        this.setState({showPassword: !this.state.showPassword});
    };
    render () {
      const { getFieldDecorator } = this.props.form;
      const { autoCompleteResult } = this.state;
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      };
      const tailFormItemLayout = {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0,
          },
          sm: {
            span: 16,
            offset: 8,
          },
        },
      };
      const platformSelector = getFieldDecorator('platform', {
        initialValue: optionsPlatform[0].value,
      })(
        <Select
          onChange={this.updateSelectedPlatform}
          style={{ width: '100%'}}
          placeholder={this.props.intl.formatMessage({ id: 'tooltip.empty' })}
        >
          {
            _.map(optionsPlatform, option => {
              return <Option key={option.value} value={option.value}>{option.label}</Option>
            })
          }
        </Select>
      );
      const buttonConnect =
            <Button
                htmlType="submit"
                type="primary"
                onSubmit={this.sendForm}
                disabled={this.props.isLoading}
            >
                {this.props.intl.formatMessage({ id: 'modalBroker.connect' })}
            </Button>;
        const buttonDisconnect =
            <Button
                htmlType="submit"
                type="primary"
                onSubmit={this.disconnectBroker}
                disabled={false}
            >
                {this.props.intl.formatMessage({ id: 'modalBroker.disconnect' })}
            </Button>;
        return (
            <div className="st-broker-authorization">
                { this.props.isLoading && <LoadingSpinner size="small"/> }
                <Form
                    onSubmit={this.props.brokerConnected ? this.disconnectBroker : this.sendForm}
                    className="st-broker-authorization-form"
                >
                    <div className="st-broker-select-title">
                        {this.props.intl.formatMessage({ id: 'modalBroker.connectTo' })}
                    </div>
                  <div>
                    {platformSelector}
                  </div>
                  <FormItem
                    {...formItemLayout}
                    label="E-mail"
                  >
                    {getFieldDecorator('email', {
                      rules: [{
                        type: 'email', message: this.props.intl.formatMessage({ id: 'tooltip.emailValid' }),
                      }, {
                        required: true, message: this.props.intl.formatMessage({ id: 'tooltip.empty' }),
                      }],
                    })(
                      <Input />
                    )}
                  </FormItem>
                  <FormItem
                    {...formItemLayout}
                    label="Password"
                  >
                    {getFieldDecorator('password', {
                      rules: [{
                        required: true, message: 'Please input your password!',
                      }, {
                        // validator: this.validateToNextPassword,
                      }],
                    })(
                      <Input type="password" />
                    )}
                  </FormItem>
                    <div className="d-flex justify-content-between">
                        <span onClick={this.toggleModalForgotPassword} className="st-modal-broker-authorization-text-click">
                            {this.props.intl.formatMessage({id: 'modalBroker.forgotPassword'})}
                        </span>
                        <div className="d-flex">
                            {this.props.intl.formatMessage({ id: 'modalBroker.oneClickTrade' })}
                            <div className="checkbox-wrapper st-correct-wrapper">
                                <input
                                    type="checkbox"
                                    ref={(input) => this.checkboxOneClick = input}
                                    className="st-broker-checkbox"
                                    onChange={this.handleOneClickTrading}
                                />
                                <div id="oneClickTrade" className="checkbox">
                                    <img src="/images/icons/checkmark.svg"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    { this.state.isModalForgotPassword &&
                        <ModalBrokerForgotPassword
                            isLoading={this.props.isLoading}
                            isOpen={this.state.isModalForgotPassword}
                            toggle={this.toggleModalForgotPassword}
                            forgotPassBroker={this.props.forgotPassBroker}
                        />
                    }
                    <div className="st-margin-bottom-middle">
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
                  <FormItem {...tailFormItemLayout}>
                    { this.props.brokerConnected ? buttonDisconnect : buttonConnect }
                  </FormItem>
                </Form>
            </div>
        );
    }
}

BrokerAuthorization.propTypes = propTypes;

export default injectIntl(Form.create()(BrokerAuthorization));
