import React, { useState } from 'react';
import { DatePicker, Form, Input } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import moment from 'moment/moment';
import { objectFields, saleFields } from '../../../../common/constants/listOfFields';
import './PromotionForm/PromotionForm.less';

const SaleForm = ({
  getFieldDecorator,
  loading,
  intl,
  isSomeValue,
  getFieldValue,
  getFieldRules,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const from = getFieldValue(saleFields.saleFrom);

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
      <p className={'ant-form-item-label AppendForm__appendTitles'}>Sale</p>
      <Form.Item>
        {getFieldDecorator(objectFields.sale, {
          rules: getFieldRules(objectFields.price),
        })(
          <Input.TextArea
            autoFocus
            className={classNames('AppendForm__input-sale', {
              'validation-error': !isSomeValue,
            })}
            disabled={loading}
            placeholder={intl.formatMessage({
              id: 'object_field_sale_placeholder',
              defaultMessage: 'Enter sale price information',
            })}
            autoSize={{ minRows: 4, maxRows: 100 }}
          />,
        )}
      </Form.Item>
      <p>The sale price will be displayed next to the original price, which will be crossed out.</p>
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
          {getFieldDecorator(saleFields.saleFrom, {
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
          {getFieldDecorator(saleFields.saleTill, {
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
              defaultPickerValue={from || undefined}
              disabledDate={curr => disabledTillDate(curr, from)}
            />,
          )}
        </Form.Item>
      </div>
      <p>Select the sales period during which the sale price will be displayed.</p>
    </div>
  );
};

SaleForm.propTypes = {
  intl: PropTypes.shape().isRequired,
  getFieldDecorator: PropTypes.func.isRequired,
  getFieldRules: PropTypes.func.isRequired,
  getFieldValue: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  isSomeValue: PropTypes.bool.isRequired,
};

export default injectIntl(SaleForm);
