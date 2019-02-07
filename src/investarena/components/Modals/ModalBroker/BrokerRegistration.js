import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Form, Input, Select, Checkbox, Button } from 'antd';
import { optionsPlatform } from '../../../constants/selectData';
import { country } from '../../../constants/countryData';
import { phoneCode } from '../../../constants/phoneCodeData';
import { agreements } from '../../../configApi/licenseAgreements';

const FormItem = Form.Item;
const Option = Select.Option;

const propTypes = {
  isLoading: PropTypes.bool.isRequired,
  registerBroker: PropTypes.func.isRequired,
  authorizeBroker: PropTypes.func.isRequired,
  changeEmail: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

class BrokerRegistration extends Component {
  state = {
    confirmDirty: false,
    isAgreementRead: false,
    currentCountryValue: 'US',
    platformName: 'umarkets',
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        values.phoneNumber = values.phone.substring(2, values.phone.length - 1);
        values.phoneOperator = values.phone.substring(0, 2);
        this.props.changeEmail(values.email);
        this.props.registerBroker(values);
      }
    });
  };

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm'], { force: true });
    }
    callback();
  };

  handleReadChange = () => {
    this.setState({ isAgreementRead: !this.state.isAgreementRead });
  };
  handleCountryValueChange = e => {
    this.setState({ currentCountryValue: e });
  };
  changePlatform = e => {
    this.setState({ platformName: e });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 16 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 16,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    const prefixSelector = getFieldDecorator('phoneCountry', {
      initialValue: phoneCode[this.state.currentCountryValue],
    })(<Select showArrow={false} style={{ width: 70 }} disabled={true} />);

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem {...formItemLayout} label={<span>Platform&nbsp;</span>}>
          {getFieldDecorator('platform', {
            initialValue: optionsPlatform[0].value,
          })(
            <Select
              style={{ width: '100%' }}
              placeholder={this.props.intl.formatMessage({
                id: 'tooltip.empty',
                defaultMessage: 'Please fill in this field',
              })}
              onChange={this.changePlatform}
            >
              {_.map(optionsPlatform, option => {
                return (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label={<span>First name&nbsp;</span>}>
          {getFieldDecorator('firstName', {
            rules: [{ required: true, message: 'Please input your firstName!', whitespace: true }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label={<span>Last name&nbsp;</span>}>
          {getFieldDecorator('lastName', {
            rules: [{ required: true, message: 'Please input your lastName!', whitespace: true }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="E-mail">
          {getFieldDecorator('email', {
            rules: [
              {
                type: 'email',
                message: 'The input is not valid E-mail!',
              },
              {
                required: true,
                message: 'Please input your E-mail!',
              },
            ],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Password">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Please input your password!',
              },
              {
                validator: this.validateToNextPassword,
              },
              { min: 5, message: 'Require more then 5 symbols' },
            ],
          })(<Input type="password" />)}
        </FormItem>
        <FormItem {...formItemLayout} label="Confirmation">
          {getFieldDecorator('confirm', {
            rules: [
              { required: true, message: 'Please confirm your password!' },
              { validator: this.compareToFirstPassword },
              { min: 5, message: 'Require more then 5 symbols' },
            ],
          })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
        </FormItem>
        <FormItem {...formItemLayout} label={<span>Country&nbsp;</span>}>
          {getFieldDecorator('country', {
            initialValue: 'US',
          })(
            <Select
              style={{ width: '100%' }}
              placeholder={this.props.intl.formatMessage({
                id: 'tooltip.empty',
                defaultMessage: 'Please fill in this field',
              })}
              onChange={this.handleCountryValueChange}
            >
              {_.map(country['en'], (option, key) => {
                return (
                  <Option key={key} value={key}>
                    {option}
                  </Option>
                );
              })}
            </Select>,
          )}
        </FormItem>
        <FormItem {...formItemLayout} label="Phone Number">
          {getFieldDecorator('phone', {
            rules: [
              { required: true, message: 'Please input your phone number!' },
              { min: 8, message: 'Require more then 8 numbers' },
              // { type: 'number', message: 'Only numbers' }
            ],
          })(<Input addonBefore={prefixSelector} style={{ width: '100%' }} />)}
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Checkbox className="d-flex align-items-center" onClick={this.handleReadChange}>
            I have read the{' '}
            <a href={agreements[this.state.platformName]} target="_blank" rel="noopener noreferrer">
              agreement
            </a>
          </Checkbox>
        </FormItem>
        <FormItem {...tailFormItemLayout}>
          <Button
            className="w-100"
            type="primary"
            htmlType="submit"
            disabled={!this.state.isAgreementRead}
          >
            Register
          </Button>
        </FormItem>
      </Form>
    );
  }
}

BrokerRegistration.propTypes = propTypes;

export default injectIntl(Form.create()(BrokerRegistration));
