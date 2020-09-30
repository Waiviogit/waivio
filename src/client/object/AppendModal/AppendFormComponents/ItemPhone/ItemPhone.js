import React from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import { phoneFields } from '../../../../../common/constants/listOfFields';

const ItemPhone = (getFieldDecorator, getFieldRules, isSomeValue, loading, intl) => (
  <React.Fragment>
    <Form.Item>
      {getFieldDecorator(phoneFields.name, { rules: getFieldRules('phoneName') })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'name_phone_placeholder',
            defaultMessage: 'Phone name',
          })}
        />,
      )}
    </Form.Item>
    <Form.Item>
      {getFieldDecorator(phoneFields.number, {
        rules: getFieldRules(phoneFields.number),
      })(
        <Input
          className={classNames('AppendForm__input', {
            'validation-error': !isSomeValue,
          })}
          disabled={loading}
          placeholder={intl.formatMessage({
            id: 'number_phone_placeholder',
            defaultMessage: 'Phone number',
          })}
        />,
      )}
    </Form.Item>
  </React.Fragment>
);
export default ItemPhone;
