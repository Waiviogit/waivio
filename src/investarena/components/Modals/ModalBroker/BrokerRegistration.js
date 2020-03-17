import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Checkbox, Form, Input, Radio, Select } from 'antd';
import { country } from '../../../constants/countryData';
import { phoneCode } from '../../../constants/phoneCodeData';
import { agreements } from '../../../configApi/licenseAgreements';
import ObjectCardView from '../../../../client/objectCard/ObjectCardView';
import { getClientWObj } from '../../../../client/adapters';
import { getObjectsByIds } from '../../../../waivioApi/ApiClient';

const FormItem = Form.Item;
const Option = Select.Option;

const propTypes = {
  isLoading: PropTypes.bool.isRequired,
  registerBroker: PropTypes.func.isRequired,
  authorizeBroker: PropTypes.func.isRequired,
  changeEmail: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
};

class BrokerRegistration extends Component {
  state = {
    confirmDirty: false,
    isAgreementRead: false,
    currentCountryValue: '',
    platformName: '',
    platformsWobjects: {},
    stepNumber: 1,
  };

  componentDidMount = async () => {
    const permlinksArray = [];
    // optionsPlatform.forEach(platform => {
    //   permlinksArray.push(platform.permlink);
    // });
    const wobjectsArray = await getObjectsByIds({ authorPermlinks: permlinksArray });
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({ platformsWobjects: wobjectsArray.wobjects });
  };

  handleReadChange = () => {
    this.setState({ isAgreementRead: !this.state.isAgreementRead });
  };
  handleCountryValueChange = e => {
    this.setState({ currentCountryValue: e });
  };
  changePlatform = e => {
    this.setState({ platformName: e.target.value });
  };

  handleStepForeward = () => {
    if (this.state.stepNumber === 1 && !_.isEmpty(this.state.currentCountryValue))
      this.setState({ stepNumber: 2 });
    if (this.state.stepNumber === 2 && !_.isEmpty(this.state.platformName))
      this.setState({ stepNumber: 3 });
  };

  handleStepBack = () => {
    const { stepNumber } = this.state;
    stepNumber === 2 && this.setState({ stepNumber: 1, currentCountryValue: '' });
    stepNumber === 3 && this.setState({ stepNumber: 2, platformName: '' });
  };

  isExcludedCountry = () =>
    _.every(optionsPlatform, option =>
      option.excludedCountries.includes(this.state.currentCountryValue),
    );

  formItemLayout = {
    labelCol: {
      xs: { span: 16 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 16 },
      sm: { span: 16 },
    },
  };

  tailFormItemLayout = {
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

  getFieldDecorator = this.props.form.getFieldDecorator;

  prefixSelector = () => {};

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback(
        this.props.intl.formatMessage({
          id: 'broker_modal_confirm_same_password',
          defaultMessage: 'Two passwords that you enter is inconsistent!',
        }),
      );
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

  firstStepRenderer = () => (
    <FormItem
      {...this.formItemLayout}
      label={this.props.intl.formatMessage({
        id: 'broker_modal_enter_country',
        defaultMessage: 'Country',
      })}
    >
      {this.getFieldDecorator('country', {
        initialValue: '',
      })(
        <Select
          showSearch
          style={{ width: '100%' }}
          placeholder={this.props.intl.formatMessage({
            id: 'tooltip.empty',
            defaultMessage: 'Please fill in this field',
          })}
          onChange={this.handleCountryValueChange}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {_.map(country[this.props.intl.locale], (option, key) => (
            <Option key={key} value={key}>
              {option}
            </Option>
          ))}
        </Select>,
      )}
    </FormItem>
  );

  secondStepRenderer = () => (
    <FormItem
      {...this.formItemLayout}
      label={this.props.intl.formatMessage({
        id: 'broker_modal_enter_platform',
        defaultMessage: 'Platform',
      })}
    >
      {this.getFieldDecorator('platform')(
        this.isExcludedCountry() ? (
          <div>No service provider available in your country</div>
        ) : (
          <Radio.Group
            style={{ width: '100%' }}
            placeholder={this.props.intl.formatMessage({
              id: 'tooltip.empty',
              defaultMessage: 'Please fill in this field',
            })}
            onChange={this.changePlatform}
            className="BrokerRegistration__radiogroup"
          >
            {/* eslint-disable-next-line consistent-return */}
            {/*{_.map(optionsPlatform, option => {*/}
              {/*if (!option.excludedCountries.includes(this.state.currentCountryValue)) {*/}
                {/*const platformWobject = this.state.platformsWobjects.find(*/}
                  {/*item => item.author_permlink === option.permlink,*/}
                {/*);*/}
                {/*const platformClientWobject = getClientWObj(platformWobject);*/}
                {/*return (*/}
                  {/*<Radio*/}
                    {/*key={option.value}*/}
                    {/*value={option.value}*/}
                    {/*className="BrokerRegistration__checkbox"*/}
                  {/*>*/}
                    {/*<a*/}
                      {/*href={`https://www.waivio.com/object/${option.permlink}`}*/}
                      {/*target="_blank"*/}
                      {/*rel="noopener noreferrer"*/}
                    {/*>*/}
                      {/*<span>Languages: {option.languages.join(', ')}</span>*/}
                    {/*</a>*/}
                    {/*<ObjectCardView wObject={platformClientWobject} showSmallVersion />*/}
                  {/*</Radio>*/}
                {/*);*/}
              {/*}*/}
            {/*})}*/}
          </Radio.Group>
        ),
      )}
    </FormItem>
  );

  thirdStepRenderer = () => (
    <React.Fragment>
      <FormItem
        {...this.formItemLayout}
        label={this.props.intl.formatMessage({
          id: 'broker_modal_enter_first_name',
          defaultMessage: 'First name',
        })}
      >
        {this.getFieldDecorator('firstName', {
          rules: [
            {
              required: true,
              message: this.props.intl.formatMessage({
                id: 'broker_modal_valid_first_name',
                defaultMessage: 'Please input your first name!',
              }),
              whitespace: true,
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem
        {...this.formItemLayout}
        label={this.props.intl.formatMessage({
          id: 'broker_modal_enter_last_name',
          defaultMessage: 'Last name',
        })}
      >
        {this.getFieldDecorator('lastName', {
          rules: [
            {
              required: true,
              message: this.props.intl.formatMessage({
                id: 'broker_modal_valid_last_name',
                defaultMessage: 'Please input your last name!',
              }),
              whitespace: true,
            },
          ],
        })(<Input />)}
      </FormItem>
      <FormItem
        {...this.formItemLayout}
        label={this.props.intl.formatMessage({
          id: 'broker_modal_enter_e-mail',
          defaultMessage: 'E-mail',
        })}
      >
        {this.getFieldDecorator('email', {
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
        })(<Input />)}
      </FormItem>
      <FormItem
        {...this.formItemLayout}
        label={this.props.intl.formatMessage({
          id: 'broker_modal_enter_passowrd',
          defaultMessage: 'Password',
        })}
      >
        {this.getFieldDecorator('password', {
          rules: [
            {
              required: true,
              message: this.props.intl.formatMessage({
                id: 'broker_modal_enter_password',
                defaultMessage: 'Please input your Password!',
              }),
            },
            {
              validator: this.validateToNextPassword,
            },
            {
              min: 5,
              message: this.props.intl.formatMessage({
                id: 'broker_modal_valid_password',
                defaultMessage: 'Require more then 5 symbols',
              }),
            },
          ],
        })(<Input type="password" />)}
      </FormItem>
      <FormItem
        {...this.formItemLayout}
        label={this.props.intl.formatMessage({
          id: 'broker_modal_enter_confirmation',
          defaultMessage: 'Confirmation',
        })}
      >
        {this.getFieldDecorator('confirm', {
          rules: [
            {
              required: true,
              message: this.props.intl.formatMessage({
                id: 'broker_modal_confirm_password',
                defaultMessage: 'Please confirm your password!',
              }),
            },
            { validator: this.compareToFirstPassword },
          ],
        })(<Input type="password" onBlur={this.handleConfirmBlur} />)}
      </FormItem>

      <FormItem
        {...this.formItemLayout}
        label={this.props.intl.formatMessage({
          id: 'broker_modal_enter_phone_number',
          defaultMessage: 'Phone Number',
        })}
      >
        {this.getFieldDecorator('phone', {
          rules: [
            {
              required: true,
              message: this.props.intl.formatMessage({
                id: 'broker_modal_valid_phone_number',
                defaultMessage: 'Please input your phone number!',
              }),
            },
            {
              min: 8,
              message: this.props.intl.formatMessage({
                id: 'broker_modal_valid_numbers_phone_number',
                defaultMessage: 'Require more then 8 numbers',
              }),
            },
            // { type: 'number', message: 'Only numbers' }
          ],
        })(
          <Input
            addonBefore={this.getFieldDecorator('phoneCountry', {
              initialValue: phoneCode[this.state.currentCountryValue],
            })(<Select showArrow={false} style={{ width: 70 }} disabled />)}
            style={{ width: '100%' }}
          />,
        )}
      </FormItem>
      <FormItem {...this.tailFormItemLayout}>
        <Checkbox className="d-flex align-items-center" onClick={this.handleReadChange}>
          {this.props.intl.formatMessage({
            id: 'broker_modal_i_have_read',
            defaultMessage: 'I have read the',
          })}{' '}
          <a href={agreements[this.state.platformName]} target="_blank" rel="noopener noreferrer">
            {this.props.intl.formatMessage({
              id: 'broker_modal_agreement',
              defaultMessage: 'agreement',
            })}
          </a>
        </Checkbox>
      </FormItem>
    </React.Fragment>
  );

  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  handleSubmit = e => {
    e.preventDefault();
    // this.props.form.validateFieldsAndScroll((err, values) => {
    //   if (!err) {
    //     console.log('Received values of form: ', values);
    //     values.phoneNumber = values.phone.substring(2, values.phone.length - 1);
    //     values.phoneOperator = values.phone.substring(0, 2);
    //     values.country = this.state.currentCountryValue;
    //     values.platform = this.state.platformName;
    //     this.props.changeEmail(values.email);
    //     this.props.registerBroker(values);
    //   }
    // });
  };

  render() {
    const { stepNumber } = this.state;
    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          {/*{stepNumber === 1 ? (*/}
          {/*this.firstStepRenderer()*/}
          {/*) : stepNumber === 2 ? (*/}
          {/*this.secondStepRenderer()*/}
          {/*) : stepNumber === 3 ? (*/}
          {/*<React.Fragment>*/}
          {/*{this.thirdStepRenderer()}*/}
          {/*<FormItem {...this.tailFormItemLayout}>*/}
          {/*<Button*/}
          {/*className="w-100"*/}
          {/*type="primary"*/}
          {/*htmlType="submit"*/}
          {/*disabled={!this.state.isAgreementRead}*/}
          {/*loading={this.props.isLoading}*/}
          {/*>*/}
          {/*{this.props.intl.formatMessage({*/}
          {/*id: 'broker_modal_register',*/}
          {/*defaultMessage: 'Register',*/}
          {/*})}*/}
          {/*</Button>*/}
          {/*</FormItem>*/}
          {/*</React.Fragment>*/}
          {/*) : null}*/}
        </Form>
        <div className="BrokerRegistration__buttons">
          <Button onClick={this.handleStepBack} disabled={this.state.stepNumber === 1}>
            Back
          </Button>
          <div>{`Step ${this.state.stepNumber} of 3`}</div>
          <Button onClick={this.handleStepForeward} disabled={this.state.stepNumber === 3}>
            Next
          </Button>
        </div>
      </React.Fragment>
    );
  }
}

BrokerRegistration.propTypes = propTypes;

export default injectIntl(Form.create()(BrokerRegistration));
