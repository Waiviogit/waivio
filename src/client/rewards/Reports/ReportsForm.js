import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DatePicker, Form, TimePicker, Button, Input, Select, Checkbox, Row, Col } from 'antd';
import moment from 'moment';
import { isEmpty, map, filter, get } from 'lodash';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getFieldWithMaxWeight } from '../../object/wObjectHelper';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import ReviewItem from '../Create-Edit/ReviewItem';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import { setDataForGlobalReport } from '../rewardsActions';

@injectIntl
@connect(() => ({}), {
  setDataForGlobalReport,
})
class ReportsForm extends Component {
  state = {
    loading: false,
    openFrom: false,
    openTill: false,
    currency: 'HIVE',
    amount: 0,
    sponsor: {},
    object: {},
    objects: [],
    dateFrom: '',
    dateTill: moment().format('MMMM D, YYYY'),
    updated: false,
    preparedObject: {},
    objectsNamesAndPermlinks: [],
  };

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ loading: true });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.getHistories(this.prepareSubmitData(values, this.props.userName));
        this.setState({
          updated: true,
        });
        console.log('Received values of form: ', values);
      }
    });
    this.handleReset();
    this.setState({ loading: false });
  };

  handleSetState = (stateData, callbackData) => {
    const { setFieldsValue } = this.props.form;
    this.setState({ ...stateData }, () => setFieldsValue(callbackData));
  };

  setSponsor = obj => {
    this.handleSetState({ sponsor: obj }, { sponsor: obj });
    this.setState({ sponsor: obj });
  };

  removeSponsor = () => {
    this.handleSetState({ sponsor: {} }, { sponsor: {} });
    this.setState({ sponsor: {} });
  };

  setDateFrom = from => {
    this.handleSetState({ dateFrom: from.format('MMMM D, YYYY') }, { dateFrom: from });
  };

  setObject = obj => {
    this.handleSetState(
      { objects: [...this.state.objects, obj] },
      { objects: [...this.state.objects, obj] },
    );
  };

  removePrimaryObject = object => {
    const { objects } = this.state;
    const newObjects = filter(objects, obj => obj.id !== object.id);
    this.handleSetState({ objects: newObjects }, { objects: newObjects });
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

  prepareSubmitData = (data, userName) => {
    const objects = get(data, ['objects']);
    const objectsNames = map(objects, obj => getFieldWithMaxWeight(obj, 'name'));
    const startDate = data.from ? moment(data.from.format('X')) : '';
    const endDate = data.till ? moment(data.till.format('X')) : '';
    const objectsNamesAndPermlinks =
      objects && objects.length
        ? map(objects, obj => ({
            name: getFieldWithMaxWeight(obj, 'name'),
            permlink: obj.author_permlink,
          }))
        : [];

    const preparedObject = {
      sponsor: get(data, ['sponsor', 'account']),
      userName: userName || '',
      globalReport: true,
      filters: {
        payable: get(data, ['amount']),
        // eslint-disable-next-line no-underscore-dangle
        endDate: endDate._i,
        // eslint-disable-next-line no-underscore-dangle
        startDate: startDate._i,
        objects: objectsNames,
        currency: get(data, ['currency']).toLowerCase(),
        processingFees: get(data, ['fees']) || false,
      },
    };
    this.setState({ preparedObject, objectsNamesAndPermlinks });

    return preparedObject;
  };

  handleReset = () => {
    this.props.form.resetFields();
    this.removeSponsor();
    this.handleSetState({ objects: {} }, { objects: {} });
  };

  render() {
    const { form, intl, userName } = this.props;
    const {
      openFrom,
      openTill,
      currency,
      sponsor,
      objects,
      loading,
      dateFrom,
      dateTill,
      preparedObject,
      objectsNamesAndPermlinks,
      amount,
    } = this.state;
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

    const renderObjects = !isEmpty(objects)
      ? map(objects, obj => (
          <ReviewItem
            key={obj.id}
            object={obj}
            // loading={disabled}
            removeReviewObject={this.removePrimaryObject}
          />
        ))
      : null;

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
                      required: false,
                      message: `${intl.formatMessage({
                        id: 'select_time',
                        defaultMessage: 'Please select time',
                      })}`,
                    },
                  ],
                  initialValue: null,
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
                  initialValue: moment(),
                })(<DatePicker allowClear={false} disabled={false} />)}
              </Form.Item>
            </Col>
            <Col span={17}>
              <Form.Item>
                {form.getFieldDecorator('tillTime', {
                  rules: [{ required: false }],
                  initialValue: null,
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
                  initialValue: null,
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
                  initialValue: false,
                  valuePropName: 'checked',
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
            {form.getFieldDecorator('objects', {
              rules: [
                {
                  required: false,
                  message: `${intl.formatMessage({
                    id: 'choose_object',
                    defaultMessage: 'Please choose object',
                  })}`,
                },
              ],
              initialValue: '',
            })(
              <SearchObjectsAutocomplete
                allowClear={false}
                style={{ width: '100%' }}
                placeholder={intl.formatMessage({
                  id: 'object_auto_complete_placeholder',
                  defaultMessage: 'Find object',
                })}
                handleSelect={this.setObject}
                autoFocus={false}
              />,
            )}
            <div className="CreateReward__objects-wrap">{renderObjects}</div>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="submitBtn" loading={loading}>
              {intl.formatMessage({
                id: 'submit',
                defaultMessage: 'submit',
              })}
            </Button>
          </Form.Item>
        </Form>
        {this.state.updated && (
          <div className="CreateReportForm__tableHeader">
            <div>
              {intl.formatMessage({
                id: 'reviews_sponsor',
                defaultMessage: `Reviews sponsored by`,
              })}{' '}
              <Link to={`/@${preparedObject.sponsor || userName}`}>{`@${preparedObject.sponsor ||
                userName}`}</Link>
            </div>
            <div className="CreateReportForm__tableHeader-date">
              <div className="CreateReportForm__tableHeader-date-from">
                {intl.formatMessage({
                  id: 'from',
                  defaultMessage: `From`,
                })}
                : {dateFrom}
              </div>
              <div className="CreateReportForm__tableHeader-date-till">
                {intl.formatMessage({
                  id: 'till',
                  defaultMessage: `Till`,
                })}{' '}
                {dateTill}
              </div>
            </div>
            <div>
              {intl.formatMessage({
                id: 'with_links_to_object',
                defaultMessage: 'With links to an object:',
              })}
              :{' '}
              {objectsNamesAndPermlinks
                ? map(objectsNamesAndPermlinks, obj => (
                    <a href={`http://www.waivio.com/object/${obj.permlink}`}>{`${obj.name}`}</a>
                  ))
                : null}
            </div>
            <div>
              {intl.formatMessage({
                id: 'total_amount',
                defaultMessage: 'Total amount:',
              })}{' '}
              {preparedObject.filters.payable || amount}
            </div>
          </div>
        )}
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(ReportsForm);

ReportsForm.propTypes = {
  form: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  getHistories: PropTypes.func,
};

ReportsForm.defaultProps = {
  form: {},
  setDataForGlobalReport: () => {},
  getHistories: () => {},
};

export default WrappedNormalLoginForm;
