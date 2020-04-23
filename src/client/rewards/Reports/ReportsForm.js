import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Form, TimePicker, Button, Input, Select, Checkbox, Row, Col } from 'antd';
import moment from 'moment';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
// import ReviewItem from '../Create-Edit/ReviewItem';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';

@injectIntl
class ReportsForm extends Component {
  state = {
    loading: false,
    openFrom: false,
    openTill: false,
    currency: 'USD',
    amount: '',
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
    console.log('handleSubmit');
    this.setState({ loading: false });
  };

  handleOpenChangeFrom = open => {
    this.setState({ openFrom: open });
  };

  handleOpenChangeTill = open => {
    this.setState({ openTill: open });
  };

  handleClose = () => this.setState({ open: false });

  handleSelectChange = value => {
    this.setState({ currency: value });
  };

  handleInputChange = e => {
    this.setState({ amount: e.target.value });
  };

  handleCheckboxChange = checked => {
    this.setState({ checked });
  };

  handleDateOnChange = (date, dateString) => {
    console.log(dateString);
    this.setState({ dateFrom: dateString });
  };

  // renderCompensationAccount =
  //   !isEmpty(this.props.sponsor) && this.props.sponsor.account ? (
  //     <div className="CreateReportForm__objects-wrap">
  //       <ReviewItem
  //         key={this.props.sponsor}
  //         object={this.props.sponsor}
  //         loading={this.state.loading}
  //         removeReviewObject={handlers.removeCompensationAccount}
  //         isUser
  //       />
  //     </div>
  //   ) : null;

  // renderPrimaryObject = !isEmpty(this.props.object) && (
  //   <ReviewItem
  //     key={this.props.object.id}
  //     object={this.props.object}
  //     loading={disabled}
  //     removeReviewObject={handlers.removePrimaryObject}
  //   />
  // );

  render() {
    const { form, intl, userName } = this.props;
    const { openFrom, openTill, amount, currency } = this.state;
    const format = 'HH:mm';
    const { Option } = Select;
    return (
      <div className="CreateReportForm">
        <Form
          layout="vertical"
          onSubmit={this.handleSubmit}
          // className="CreateReportForm__form"
        >
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
            {/* {form.getFieldDecorator('sponsor', { */}
            {/*  rules: [{ required: true, message: `${intl.formatMessage({ */}
            {/*        id: 'choose_sponsor_name', */}
            {/*        defaultMessage: 'Please choose sponsor name', */}
            {/*      })}` }], */}
            {/* })( */}
            <SearchUsersAutocomplete
              allowClear={false}
              // disabled={disabled}
              // handleSelect={handlers.handleSetCompensationAccount}
              placeholder={intl.formatMessage({
                id: 'find_users_placeholder',
                defaultMessage: 'Find user',
              })}
              style={{ width: '100%' }}
              autoFocus={false}
            />
            {/* <div className="CreateReward__objects-wrap">{this.renderCompensationAccount}</div> */}
            {/* )} */}
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
                      required: false,
                      message: `${intl.formatMessage({
                        id: 'select_date',
                        defaultMessage: 'Please select date',
                      })}`,
                    },
                  ],
                })(
                  <div>
                    <DatePicker allowClear={false} disabled={false} />
                  </div>,
                )}
              </Form.Item>
            </Col>
            <Col span={17}>
              <Form.Item>
                {form.getFieldDecorator('fromTime', {
                  rules: [
                    {
                      required: false,
                      message: `${intl.formatMessage({
                        id: 'select_time',
                        defaultMessage: 'Please select time',
                      })}`,
                    },
                  ],
                })(
                  <TimePicker
                    className="required"
                    open={openFrom}
                    onOpenChange={this.handleOpenChangeFrom}
                    defaultOpenValue={moment('00:00', format)}
                    format={format}
                    addon={() => (
                      <Button size="small" type="primary" onClick={this.handleClose}>
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
                  rules: [
                    {
                      required: false,
                      message: `${intl.formatMessage({
                        id: 'select_date',
                        defaultMessage: 'Please select date',
                      })}`,
                    },
                  ],
                })(<DatePicker allowClear={false} disabled={false} />)}
              </Form.Item>
            </Col>
            <Col span={17}>
              <Form.Item>
                {form.getFieldDecorator('tillTime', {
                  rules: [
                    {
                      required: false,
                      message: `${intl.formatMessage({
                        id: 'select_time',
                        defaultMessage: 'Please select time',
                      })}`,
                    },
                  ],
                })(
                  <TimePicker
                    open={openTill}
                    onOpenChange={this.handleOpenChangeTill}
                    defaultOpenValue={moment('00:00', format)}
                    format={format}
                    addon={() => (
                      <Button size="small" type="primary" onClick={this.handleClose}>
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
                  id: 'total_amount',
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
                    value={amount}
                    onChange={this.handleInputChange}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col span={7}>
              <Form.Item>
                {form.getFieldDecorator('currency', {
                  rules: [{ required: false, initialValue: currency }],
                })(
                  <Select
                    style={{ width: '120px', left: '15px' }}
                    onChange={this.handleSelectChange}
                    value={currency}
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
                  rules: [{ required: false, message: '' }],
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
            <SearchObjectsAutocomplete
              allowClear={false}
              // itemsIdsToOmit={handlers.getObjectsToOmit()}
              style={{ width: '100%' }}
              placeholder={intl.formatMessage({
                id: 'object_auto_complete_placeholder',
                defaultMessage: 'Find object',
              })}
              // handleSelect={handlers.setPrimaryObject}
              // disabled={disabled}
              autoFocus={false}
            />
            {/* <div className="CreateReward__objects-wrap">{this.renderPrimaryObject}</div> */}
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
            })}{' '}
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
  // sponsor: PropTypes.shape(),
  userName: PropTypes.bool.isRequired,
  // object: PropTypes.shape(),
  // loading: PropTypes.bool.isRequired,
};

ReportsForm.defaultProps = {
  form: {},
  sponsor: {},
  object: {},
};

export default WrappedNormalLoginForm;
