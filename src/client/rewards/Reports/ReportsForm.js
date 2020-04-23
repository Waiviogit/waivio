import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Form, TimePicker, Button, Input, Select, Checkbox, Row, Col } from 'antd';
import moment from 'moment';
import { isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { getFieldWithMaxWeight } from '../../object/wObjectHelper';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import ReviewItem from '../Create-Edit/ReviewItem';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';

@injectIntl
class ReportsForm extends Component {
  state = {
    loading: false,
    openFrom: false,
    openTill: false,
    currency: 'USD',
    amount: '',
    sponsor: {},
    object: {},
  };

  handleSubmit = e => {
    e.preventDefault();
    console.log(this.props.form.values);
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
    this.setState({ loading: true });
    this.setState({ loading: false });
  };

  handleSetState = (stateData, callbackData) => {
    const { setFieldsValue } = this.props.form;
    this.setState({ ...stateData }, () => setFieldsValue(callbackData));
  };

  setSponsor = obj => {
    this.handleSetState({ sponsor: obj }, { sponsor: obj });
  };

  removeSponsor = () => {
    this.handleSetState({ sponsor: {} }, { sponsor: {} });
  };

  setDateFrom = from => {
    this.handleSetState({ dateFrom: from }, { dateFrom: from });
  };

  setObject = obj => {
    this.handleSetState({ object: obj, parentPermlink: obj.author_permlink }, { object: obj });
  };

  removePrimaryObject = () => {
    this.handleSetState({ object: {} }, { object: {} });
  };

  handleOpenChangeFrom = open => {
    this.setState({ openFrom: open });
  };

  handleOpenChangeTill = open => {
    this.setState({ openTill: open });
  };

  handleCloseFrom = () => this.setState({ openFrom: false });
  handleCloseTill = () => this.setState({ openTill: false });

  handleSelectChange = value => {
    this.setState({ currency: value });
  };

  handleInputChange = e => {
    this.setState({ amount: e.target.value });
  };

  handleCheckboxChange = checked => {
    this.setState({ checked });
  };

  render() {
    const { form, intl, userName } = this.props;
    const { openFrom, openTill, currency, sponsor, object } = this.state;
    const format = 'HH:mm:ss';
    const { Option } = Select;

    const renderSponsor =
      !isEmpty(sponsor) && sponsor.account ? (
        <div className="CreateReportForm__objects-wrap">
          <ReviewItem
            key={sponsor}
            object={sponsor}
            // loading={loading}
            removeReviewObject={this.removeSponsor}
            isUser
          />
        </div>
      ) : null;

    const renderObject = !isEmpty(object) && (
      <ReviewItem
        key={object.id}
        object={object}
        // loading={disabled}
        removeReviewObject={this.removePrimaryObject}
      />
    );

    const objectName = getFieldWithMaxWeight(object, 'name');

    return (
      <div className="CreateReportForm">
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Form.Item
            label={
              <span className="CreateReportForm__label">
                {intl.formatMessage({
                  id: 'sponsor',
                  defaultMessage: 'Sponsor',
                })}
                :
              </span>
            }
          >
            {form.getFieldDecorator('sponsor', {
              rules: [
                {
                  required: true,
                  message: `${intl.formatMessage({
                    id: 'choose_sponsor_name',
                    defaultMessage: 'Please choose sponsor name',
                  })}`,
                },
              ],
            })(
              <SearchUsersAutocomplete
                allowClear={false}
                // disabled={disabled}
                handleSelect={this.setSponsor}
                placeholder={intl.formatMessage({
                  id: 'find_users_placeholder',
                  defaultMessage: 'Find user',
                })}
                style={{ width: '100%' }}
                autoFocus={false}
              />,
            )}
            <div className="CreateReward__objects-wrap">{renderSponsor}</div>
          </Form.Item>
          <Row gutter={24} className="CreateReportForm__row">
            <Col span={7}>
              <Form.Item
                label={
                  <span className="CreateReportForm__label">
                    {intl.formatMessage({
                      id: 'from',
                      defaultMessage: 'From',
                    })}
                    :
                  </span>
                }
              >
                {form.getFieldDecorator('from', {
                  rules: [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'select_date',
                        defaultMessage: 'Please select date',
                      })}`,
                    },
                  ],
                })(<DatePicker allowClear={false} disabled={false} onChange={this.setDateFrom} />)}
              </Form.Item>
            </Col>
            <Col span={17}>
              <Form.Item>
                {form.getFieldDecorator('fromTime', {
                  rules: [
                    {
                      required: true,
                      message: `${intl.formatMessage({
                        id: 'select_time',
                        defaultMessage: 'Please select time',
                      })}`,
                    },
                  ],
                })(
                  <TimePicker
                    open={openFrom}
                    onOpenChange={this.handleOpenChangeFrom}
                    defaultOpenValue={moment('00:00:00', format)}
                    format={format}
                    addon={() => (
                      <Button size="small" type="primary" onClick={this.handleCloseFrom}>
                        Ok
                      </Button>
                    )}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} className="CreateReportForm__row">
            <Col span={7}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'till',
                  defaultMessage: 'Till:',
                })}
              >
                {form.getFieldDecorator('till', {
                  rules: [{ required: false }],
                })(<DatePicker allowClear={false} disabled={false} />)}
              </Form.Item>
            </Col>
            <Col span={17}>
              <Form.Item>
                {form.getFieldDecorator('tillTime', {
                  rules: [{ required: false }],
                })(
                  <TimePicker
                    open={openTill}
                    onOpenChange={this.handleOpenChangeTill}
                    defaultOpenValue={moment('00:00:00', format)}
                    format={format}
                    addon={() => (
                      <Button size="small" type="primary" onClick={this.handleCloseTill}>
                        Ok
                      </Button>
                    )}
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24} className="CreateReportForm__row">
            <Col span={7}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'or_total_amount',
                  defaultMessage: 'Or total amount:',
                })}
              >
                {form.getFieldDecorator('amount', {
                  rules: [{ required: false }],
                })(
                  <Input
                    placeholder={intl.formatMessage({
                      id: 'enter_amount',
                      defaultMessage: 'Enter amount',
                    })}
                    onChange={this.handleInputChange}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item>
                {form.getFieldDecorator('currency', {
                  initialValue: currency,
                })(
                  <Select
                    style={{ width: '120px', left: '15px' }}
                    onChange={this.handleSelectChange}
                  >
                    <Option value="usd">USD</Option>
                    <Option value="hive">HIVE</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item>
                {form.getFieldDecorator('fees', {
                  rules: [{ required: false }],
                })(
                  <Checkbox onChange={this.handleCheckboxChange}>
                    {intl.formatMessage({
                      id: 'include_processing_fees',
                      defaultMessage: 'Include processing fees',
                    })}
                  </Checkbox>,
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label={
              <span className="CreateReportForm__label">
                {intl.formatMessage({
                  id: 'with_links_to_object',
                  defaultMessage: 'With links to an object:',
                })}
                :
              </span>
            }
          >
            {form.getFieldDecorator('object', {
              rules: [
                {
                  required: true,
                  message: `${intl.formatMessage({
                    id: 'choose_object',
                    defaultMessage: 'Please choose object',
                  })}`,
                },
              ],
            })(
              <SearchObjectsAutocomplete
                allowClear={false}
                style={{ width: '100%' }}
                placeholder={intl.formatMessage({
                  id: 'object_auto_complete_placeholder',
                  defaultMessage: 'Find object',
                })}
                handleSelect={this.setObject}
                // disabled={disabled}
                autoFocus={false}
              />,
            )}
            <div className="CreateReward__objects-wrap">{renderObject}</div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submitBtn">
              {intl.formatMessage({
                id: 'submit',
                defaultMessage: 'submit',
              })}
            </Button>
          </Form.Item>
        </Form>
        <div className="CreateReportForm__tableHeader">
          <div>
            {intl.formatMessage({
              id: 'reviews_sponsor',
              defaultMessage: `Reviews sponsored by`,
            })}{' '}
            <Link to={`/@${userName}`}>{`@${userName}`}</Link>
          </div>
          <div>
            {intl.formatMessage({
              id: 'from',
              defaultMessage: `From`,
            })}
            :{' '}
            {intl.formatMessage({
              id: 'till',
              defaultMessage: `Till`,
            })}{' '}
          </div>
          <div>
            {intl.formatMessage({
              id: 'with_links_to_object',
              defaultMessage: 'With links to an object:',
            })}
            : {objectName}
          </div>
          <div>
            {intl.formatMessage({
              id: 'total_amount',
              defaultMessage: 'Total amount:',
            })}{' '}
          </div>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(ReportsForm);

ReportsForm.propTypes = {
  form: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
};

ReportsForm.defaultProps = {
  form: {},
};

export default WrappedNormalLoginForm;
