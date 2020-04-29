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
    currency: 'USD',
    amount: '',
    sponsor: {},
    object: {},
    objects: [],
    dateFrom: '',
    dateTill: '',
  };

  handleSubmit = e => {
    e.preventDefault();
    const dataF = {
      histories: [
        {
          _id: '5ea026f98967b70fcfd70612',
          is_demo_account: false,
          recounted: false,
          memo: '',
          userName: 'w7ngc',
          sponsor: 'asd09',
          type: 'review',
          app: 'waiviodev/1.0.0',
          details: {
            beneficiaries: [
              { account: 'linakay', weight: 200 },
              { account: 'w7ngc', weight: 9500 },
              { account: 'waivio', weight: 300 },
            ],
            review_permlink: 'review-test8-test6',
            review_object: {
              author_permlink: 'test6',
              object_type: 'hashtag',
              fields: [
                {
                  weight: 1,
                  locale: 'en-US',
                  _id: '5d3c6484fa84536e4ebf0b88',
                  creator: 'monterey',
                  author: 'asd09',
                  permlink: 'monterey-6l9pk953od',
                  name: 'name',
                  body: 'test6',
                  active_votes: [],
                },
              ],
            },
            reservation_permlink: 'reserve-tkre1te7z5j',
            main_object: {
              author_permlink: 'test8',
              object_type: 'hashtag',
              fields: [
                {
                  weight: 1,
                  locale: 'en-US',
                  _id: '5d3c6491fa84536e4ebf0ba0',
                  creator: 'monterey',
                  author: 'xcv47',
                  permlink: 'monterey-sd0yq3n74p',
                  name: 'name',
                  body: 'test8',
                  active_votes: [],
                },
              ],
            },
            payableInDollars: 0.4074,
          },
          amount: 0.4074,
          createdAt: '2020-04-22T11:14:01.360Z',
          updatedAt: '2020-04-22T11:20:21.003Z',
          __v: 0,
          currentUser: 'olegvladim',
          balance: 3.0444,
        },
      ],
      payable: 3.044,
      amount: 1.03,
      hasMore: true,
    };
    this.setState({ loading: true });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.setDataForGlobalReport(dataF);
        this.prepareSubmitData(values, this.props.userName);
        this.props
          .getHistories(this.prepareSubmitData(values, this.props.userName))
          .then(data => setDataForGlobalReport(data))
          .catch(error => console.log(error));
        console.log('Received values of form: ', values);
      }
    });
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
    const startDate = data.from ? moment(data.from.format('x')) : '';
    const endDate = data.till ? moment(data.till.format('x')) : '';

    const preparedObject = {
      sponsor: get(data, ['sponsor', 'account']) || '',
      userName: userName || '',
      filters: {
        payable: get(data, ['amount']) || '',
        globalReport: true,
        // eslint-disable-next-line no-underscore-dangle
        endDate: endDate._i || '',
        // eslint-disable-next-line no-underscore-dangle
        startDate: startDate._i || '',
        objects: objectsNames || [],
        currency: get(data, ['currency']) || '',
        processingFees: get(data, ['fees']) || false,
      },
    };

    this.setState({ dateFrom: get(preparedObject, ['filter', 'startDate']) });
    this.setState({ dateTill: get(preparedObject, ['filter', 'endDate']) });

    return preparedObject;
  };

  // handleReset = () => {
  //   this.props.form.resetFields();
  // };

  render() {
    const { form, intl, userName } = this.props;
    const {
      openFrom,
      openTill,
      currency,
      sponsor,
      object,
      objects,
      loading,
      dateFrom,
      dateTill,
    } = this.state;
    const format = 'HH:mm:ss';
    const { Option } = Select;
    const from = dateFrom ? moment(dateFrom).format('MMMM Do YYYY') : '';
    const till = dateTill ? moment(dateTill).format('MMMM Do YYYY') : '';

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
                      required: false,
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
            {form.getFieldDecorator('objects', {
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
        <div className="CreateReportForm__tableHeader">
          <div>
            {intl.formatMessage({
              id: 'reviews_sponsor',
              defaultMessage: `Reviews sponsored by`,
            })}{' '}
            <Link to={`/@${userName}`}>{`@${userName}`}</Link>
          </div>
          <div className="CreateReportForm__tableHeader-date">
            <div className="CreateReportForm__tableHeader-date-from">
              {intl.formatMessage({
                id: 'from',
                defaultMessage: `From`,
              })}
              : {from}
            </div>
            <div className="CreateReportForm__tableHeader-date-till">
              {intl.formatMessage({
                id: 'till',
                defaultMessage: `Till`,
              })}{' '}
              {till}
            </div>
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
  setDataForGlobalReport: PropTypes.func,
  getHistories: PropTypes.func,
};

ReportsForm.defaultProps = {
  form: {},
  setDataForGlobalReport: () => {},
  getHistories: () => {},
};

export default WrappedNormalLoginForm;
