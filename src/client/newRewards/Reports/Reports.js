import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Col, DatePicker, Form, Input, Row, Select, message } from 'antd';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { getGlobalReports } from '../../../waivioApi/ApiClient';
import SearchUsersAutocomplete from '../../components/EditorUser/SearchUsersAutocomplete';
import SelectUserForAutocomplete from '../../widgets/SelectUserForAutocomplete';
import { currencyTypes } from '../../websites/constants/currencyTypes';
import SearchObjectsAutocomplete from '../../components/EditorObject/SearchObjectsAutocomplete';
import ReviewItem from '../../rewards/Create-Edit/ReviewItem';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import PaymentTable from '../../rewards/Payment/PaymentTable/PaymentTable';
import { getObjectName, getObjectUrlForLink } from '../../../common/helpers/wObjectHelper';

import './Reports.less';

const Reports = ({ form, intl }) => {
  const currUser = useSelector(getAuthenticatedUserName);

  const [objects, setObjects] = useState([]);
  const [sponsor, setSponsor] = useState(currUser);
  const [reports, setReports] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState('WAIV');
  const [filters, setSelectedFilters] = useState({});

  useEffect(() => {
    getGlobalReports({
      skip: 0,
      limit: 10,
      guideName: sponsor,
      payoutToken: 'WAIV',
    }).then(res => {
      setReports(res.histories);
      setHasMore(res.hasMore);
    });
  }, []);

  const disabledStartDate = date => moment(date) > moment(form.getFieldValue('till'));

  const disabledEndDate = date =>
    form.getFieldValue('from') ? moment(date).isBefore(form.getFieldValue('from')) : null;

  const handleSelectSponsor = spnsr => setSponsor(spnsr.account);
  const handleDeleteSponsor = () => setSponsor('');

  const handleSelectPrimaryObject = obj => setObjects([...objects, obj]);

  const removePrimaryObject = object =>
    setObjects(objects.filter(obj => obj.author_permlink !== object.author_permlink));

  const handleSubmit = event => {
    event.preventDefault();
    form.validateFields(async (err, values) => {
      if (!err) {
        try {
          const reportsInfo = await getGlobalReports({
            skip: 0,
            limit: 10,
            guideName: sponsor,
            payoutToken: 'WAIV',
            currency: values.currency,
            objects: objects.map(obj => obj.author_permlink),
            processingFees: values.fees,
            payable: +values.amount,
            startDate: values.from ? values.from.unix() : 0,
            endDate: values.till.unix(),
          });

          setSelectedFilters({
            sponsor,
            currency: values.currency,
            objects,
            processingFees: values.fees,
            totalAmound: +values.amount,
            startDate: values.from,
            endDate: values.till,
          });
          setReports(reportsInfo.histories);
          setSelectedCurrency(values.currency);
          setHasMore(reportsInfo.hasMore);
        } catch (e) {
          message.error(e.message);
        }
      }
    });
  };

  const getMoreReports = async () => {
    try {
      const reportsInfo = await getGlobalReports({
        skip: reports?.length,
        limit: 10,
        guideName: sponsor,
        payoutToken: 'WAIV',
        currency: selectedCurrency,
        objects: filters?.objects?.map(obj => obj.author_permlink),
        processingFees: form.getFieldValue('fees'),
        payable: +form.getFieldValue('amount'),
        startDate: form.getFieldValue('from') ? form.getFieldValue('from').unix() : 0,
        endDate: form.getFieldValue('till').unix(),
      });

      setReports([...reports, ...reportsInfo.histories]);
      setHasMore(reportsInfo.hasMore);
    } catch (e) {
      message.error(e.message);
    }
  };

  const dataFormat = 'MMMM d, yyyy HH:mm:ss';

  return (
    <div className={'ReportsGlobal'}>
      <h1>Reports</h1>
      <Form layout="vertical">
        <Form.Item
          label={
            <span className="ReportsGlobal__label">
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
                message: intl.formatMessage({
                  id: 'choose_sponsor_name',
                  defaultMessage: 'Please choose sponsor name',
                }),
              },
            ],
            initialValue: currUser,
          })(
            sponsor ? (
              <SelectUserForAutocomplete
                key={sponsor}
                account={sponsor}
                resetUser={handleDeleteSponsor}
              />
            ) : (
              <SearchUsersAutocomplete
                allowClear={false}
                itemsIdsToOmit={[sponsor]}
                handleSelect={handleSelectSponsor}
                style={{ width: '100%', marginBottom: '10px' }}
                autoFocus={false}
              />
            ),
          )}
        </Form.Item>
        <Row gutter={24} className="ReportsGlobal__row">
          <Col span={12}>
            <Form.Item
              label={
                <span className="ReportsGlobal__label">
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
                <DatePicker
                  disabledDate={disabledStartDate}
                  showTime
                  allowClear={false}
                  disabled={false}
                  placeholder={intl.formatMessage({
                    id: 'date_and_time_picker_placeholder',
                    defaultMessage: 'Select date and time',
                  })}
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={
                <span className="ReportsGlobal__label">
                  {intl.formatMessage({
                    id: 'till',
                    defaultMessage: 'Till',
                  })}
                  :
                </span>
              }
            >
              {form.getFieldDecorator('till', {
                rules: [{ required: false }],
                initialValue: moment(),
              })(
                <DatePicker
                  disabledDate={disabledEndDate}
                  showTime
                  allowClear={false}
                  disabled={false}
                  placeholder={intl.formatMessage({
                    id: 'date_and_time_picker_placeholder',
                    defaultMessage: 'Select date and time',
                  })}
                />,
              )}
            </Form.Item>
          </Col>
        </Row>
        <span className="ReportsGlobal__label">
          {intl.formatMessage({
            id: 'or_total_amount',
            defaultMessage: 'Or total amount:',
          })}
        </span>
        <Row gutter={24} className="ReportsGlobal__row">
          <Col span={7}>
            <Form.Item>
              {form.getFieldDecorator('amount', {
                rules: [{ required: false }],
                initialValue: null,
              })(
                <Input
                  placeholder={intl.formatMessage({
                    id: 'enter_amount',
                    defaultMessage: 'Enter amount',
                  })}
                  autoComplete="off"
                />,
              )}
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item>
              {form.getFieldDecorator('currency', {
                initialValue: 'WAIV',
              })(
                <Select style={{ width: '120px', left: '15px' }}>
                  {['WAIV', ...currencyTypes].map(curr => (
                    <Select.Option key={curr} value={curr}>
                      {curr}
                    </Select.Option>
                  ))}
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
                <Checkbox className="ReportsGlobal__checkbox">
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
            <span className="ReportsGlobal__label">
              {intl.formatMessage({
                id: 'with_links_to_object',
                defaultMessage: 'With links to an object',
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
              handleSelect={handleSelectPrimaryObject}
              autoFocus={false}
            />,
          )}
          <div>
            {objects.map(obj => (
              <ReviewItem key={obj.id} object={obj} removeReviewObject={removePrimaryObject} />
            ))}
          </div>
        </Form.Item>
      </Form>
      <Button type="primary" onClick={handleSubmit}>
        Submit
      </Button>
      <div className={'ReportsGlobal__filters_block'}>
        {filters.sponsor && (
          <span>
            Reviews sponsored by <Link to={`/@${filters.sponsor}`}>{filters.sponsor}</Link>
          </span>
        )}
        {filters.startDate && <span>From: {filters.startDate.format(dataFormat)}</span>}
        {filters.endDate && <span>Till: {filters.endDate.format(dataFormat)}</span>}
        {!isEmpty(filters.objects) && (
          <span>
            With links to an object:{' '}
            {filters.objects.map(obj => (
              <Link key={obj.author_permlink} to={getObjectUrlForLink(obj)}>
                {getObjectName(obj)}
              </Link>
            ))}
          </span>
        )}
        {!!filters.totalAmound && <span>Total amount: {filters.totalAmound}</span>}
        {filters.currency && <span>Currency: {filters.currency}</span>}
      </div>
      <PaymentTable
        sponsors={reports}
        currency={selectedCurrency}
        isReports
        hasMore={hasMore}
        handleShowMore={getMoreReports}
      />
    </div>
  );
};

Reports.propTypes = {
  form: PropTypes.shape({
    getFieldDecorator: PropTypes.func,
    getFieldValue: PropTypes.func,
    validateFields: PropTypes.func,
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

export default Form.create()(injectIntl(Reports));
