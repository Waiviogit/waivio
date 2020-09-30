import React from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import { objectFields } from '../../../../../common/constants/listOfFields';

const ItemPrice = (getFieldDecorator, getFieldRules, isSomeValue, loading, intl) => (
  <Form.Item>
    {getFieldDecorator(objectFields.price, {
      rules: getFieldRules(objectFields.price),
    })(
      <Input.TextArea
        className={classNames('AppendForm__input', {
          'validation-error': !isSomeValue,
        })}
        disabled={loading}
        autoSize={{ minRows: 4, maxRows: 8 }}
        placeholder={intl.formatMessage({
          id: 'price_field',
          defaultMessage: 'Price',
        })}
      />,
    )}
  </Form.Item>
);
export default ItemPrice;
