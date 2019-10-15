import _ from 'lodash';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Form, Input, Select, Checkbox, Button, Radio } from 'antd';
import { optionsPlatform } from '../../../constants/selectData';
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
    optionsPlatform.forEach(platform => {
      permlinksArray.push(platform.permlink);
    });
    const wobjectsArray = await getObjectsByIds({ authorPermlinks: permlinksArray });
    this.setState({ platformsWobjects: wobjectsArray.wobjects });
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
    this.setState({ platformName: e.target.value });
  };

  handleStepForeward = () => {
    if (this.state.stepNumber === 1 && !_.isEmpty(this.state.currentCountryValue))
      this.setState({ stepNumber: 2 });
    if (this.state.stepNumber === 2 && !_.isEmpty(this.state.platformName))
      this.setState({ stepNumber: 3 });
  };

  handleStepBack = () => {
    this.state.stepNumber === 2 && this.setState({ stepNumber: 1, currentCountryValue: '' });
    this.state.stepNumber === 3 && this.setState({ stepNumber: 2, platformName: '' });
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

    const firstStepRenderer = () => (
      <FormItem {...formItemLayout} label={<span>Country&nbsp;</span>}>
        {getFieldDecorator('country', {
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

    const secondStepRenderer = () => (
      <div>
        <FormItem {...formItemLayout}>
          {getFieldDecorator('platform', {
            // initialValue: optionsPlatform[0].value,
          })(
            <Radio.Group
              style={{ width: '100%' }}
              placeholder={this.props.intl.formatMessage({
                id: 'tooltip.empty',
                defaultMessage: 'Please fill in this field',
              })}
              onChange={this.changePlatform}
              className="BrokerRegistration__radiogroup"
            >
              {_.map(optionsPlatform, option => {
                if (option.countries.includes(this.state.currentCountryValue)) {
                  const platformWobject = this.state.platformsWobjects.find(
                    item => item.author_permlink === option.permlink,
                  );
                  const platformClientWobject = getClientWObj(platformWobject);
                  return (
                    <Radio
                      key={option.value}
                      value={option.value}
                      className="BrokerRegistration__checkbox"
                    >
                      <a
                        href={`https://www.waivio.com/object/${option.permlink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span>Broker page</span>
                      </a>
                      <ObjectCardView wObject={platformClientWobject} showSmallVersion />
                    </Radio>
                  );
                }
              })}
            </Radio.Group>,
          )}
        </FormItem>
      </div>
    );

    const thirdStepRenderer = () => (
      <React.Fragment>
        <FormItem {...formItemLayout} label={<span>First name</span>}>
          {getFieldDecorator('firstName', {
            rules: [{ required: true, message: 'Please input your firstName!', whitespace: true }],
          })(<Input />)}
        </FormItem>
        <FormItem {...formItemLayout} label={<span>Last name</span>}>
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
            loading={this.props.isLoading}
          >
            Register
          </Button>
        </FormItem>
      </React.Fragment>
    );

    return (
      <React.Fragment>
        <Form onSubmit={this.handleSubmit}>
          {this.state.stepNumber === 1
            ? firstStepRenderer()
            : this.state.stepNumber === 2
            ? secondStepRenderer()
            : this.state.stepNumber === 3
            ? thirdStepRenderer()
            : null}
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
