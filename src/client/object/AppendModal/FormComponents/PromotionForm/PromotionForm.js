import React, { useState } from 'react';
import { DatePicker, Form, Input } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import moment from 'moment/moment';
import { promotionFields } from '../../../../../common/constants/listOfFields';
import { validateDate } from '../../../../wallet/WalletHelper';

const PromotionForm = ({
  getFieldDecorator,
  getFieldRules,
  loading,
  intl,
  isSomeValue,
  getFieldValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const from = getFieldValue(promotionFields.promotionFrom);
  const till = getFieldValue(promotionFields.promotionTill);

  const disabledDate = current => current > moment().endOf('day');
  const disabledTillDate = (current, f) => current < f;
  const onOpenChange = () => setIsOpen(!isOpen);

  const handleChangeEndDate = value => {
    const date = moment(value);
    const isToday =
      date.startOf('day').unix() ===
      moment()
        .startOf('day')
        .unix();
    const end = isToday ? value || date : date.endOf('day');

    return end.unix();
  };

  const handleChangeStartDate = value =>
    moment(value)
      .startOf('day')
      .unix();

  const startDate = handleChangeStartDate(from);
  const endDate = handleChangeEndDate(till);
  const invalidFields = endDate < startDate;

  return (
    <div>
      <p className={'ant-form-item-label AppendForm__appendTitles'}>Site</p>
      <Form.Item>
        {getFieldDecorator(promotionFields.promotionSite, {
          rules: getFieldRules(promotionFields.promotionSite),
        })(
          <Input
            className={classNames({
              'validation-error': !isSomeValue,
            })}
            disabled={loading}
            placeholder={intl.formatMessage({
              id: 'enter_site_domain',
              defaultMessage: 'Enter site domain (e.g., example.com)',
            })}
          />,
        )}
      </Form.Item>
      <p>
        Enter the site domain where this promotion will be displayed. The update will be applied
        only if you are the owner or administrator of the site.
      </p>
      <br />
      <p className={'ant-form-item-label AppendForm__appendTitles'}>Period</p>
      <br />
      <div className="WalletTable__date-wrap">
        <span className={'AppendForm__appendTitles mt1 mr3'}>
          {intl.formatMessage({
            id: 'table_date_from',
            defaultMessage: 'From:',
          })}
        </span>
        <Form.Item>
          {getFieldDecorator(promotionFields.promotionFrom, {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'table_from_validation',
                  defaultMessage: 'Field "from" is required',
                }),
              },
              {
                required: true,
                message: intl.formatMessage({
                  id: 'table_after_till_validation',
                  defaultMessage: 'The selected date must be before or equal the current date',
                }),
                validator: validateDate,
              },
            ],
          })(
            <DatePicker
              format={'LL'}
              showToday={false}
              open={isOpen}
              onOpenChange={onOpenChange}
              placeholder={intl.formatMessage({
                id: 'table_start_date_picker',
                defaultMessage: 'Select start date',
              })}
              disabledDate={disabledDate}
            />,
          )}
        </Form.Item>{' '}
        <span className={'AppendForm__appendTitles ml3 mt1 mr3'}>
          {intl.formatMessage({
            id: 'table_date_till',
            defaultMessage: 'Till:',
          })}
        </span>{' '}
        <Form.Item>
          {getFieldDecorator(promotionFields.promotionTill, {
            rules: [
              {
                required: true,
                message: intl.formatMessage({
                  id: 'table_till_validation',
                  defaultMessage: 'Field "till" is required',
                }),
              },
              // {
              //   required: true,
              //   message: intl.formatMessage({
              //     id: 'table_after_till_validation',
              //     defaultMessage: 'The selected date must be before or equal the current date',
              //   }),
              //   validator: validateDate,
              // },
            ],
          })(
            <DatePicker
              format={'LL'}
              placeholder={intl.formatMessage({
                id: 'table_end_date_picker',
                defaultMessage: 'Select end date',
              })}
              disabled={!from}
              disabledDate={curr => disabledTillDate(curr, from)}
            />,
          )}
        </Form.Item>
      </div>
      {invalidFields && (
        <span style={{ color: 'red' }}>The From date must be earlier than the Till date</span>
      )}
      <p>Select the promotion period during which the object will be highlighted.</p>
    </div>
  );
};

PromotionForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isSomeValue: PropTypes.bool.isRequired,
};

export default injectIntl(PromotionForm);
