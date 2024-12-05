import React, { useState } from 'react';
import { DatePicker, Form, Input } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import moment from 'moment/moment';
import { promotionFields } from '../../../../../common/constants/listOfFields';
import validateRules from '../../../../websites/constants/validateRules';
import './PromotionForm.less';

const PromotionForm = ({ getFieldDecorator, loading, intl, isSomeValue, getFieldValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const from = getFieldValue(promotionFields.promotionFrom);

  const disabledDate = current => current < moment().startOf('day');
  const disabledTillDate = (current, f) =>
    current &&
    (current === f ||
      current.isSameOrBefore(moment(f).startOf('day'), 'day') ||
      current.isBefore(f, 'day') ||
      current.isSameOrBefore(moment().endOf('day')));
  const onOpenChange = () => setIsOpen(!isOpen);

  return (
    <div>
      <p className={'ant-form-item-label AppendForm__appendTitles'}>Site</p>
      <Form.Item>
        {getFieldDecorator(promotionFields.promotionSite, {
          rules: validateRules.host,
          getValueFromEvent: e => e.target.value.toLowerCase(),
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
      <p className={'ant-form-item-label AppendForm__appendTitles mb1'}>Period</p>
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
            ],
            getValueFromEvent: date => date && moment(date).startOf('day'),
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
            ],
            getValueFromEvent: date => date && moment(date).endOf('day'),
          })(
            <DatePicker
              showToday={false}
              format={'LL'}
              placeholder={intl.formatMessage({
                id: 'table_end_date_picker',
                defaultMessage: 'Select end date',
              })}
              disabled={!from}
              defaultPickerValue={from || undefined} // Ensure it aligns with the "from" date
              disabledDate={curr => disabledTillDate(curr, from)}
            />,
          )}
        </Form.Item>
      </div>
      <p>Select the promotion period during which the object will be highlighted.</p>
    </div>
  );
};

PromotionForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isSomeValue: PropTypes.bool.isRequired,
};

export default injectIntl(PromotionForm);
