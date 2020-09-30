import React from 'react';
import { Form, Input } from 'antd';
import { objectFields } from '../../../../../common/constants/listOfFields';

const ItemName = (loading, getFieldDecorator, getFieldRules, intl) => (
  <Form.Item>
    {getFieldDecorator(objectFields.name, { rules: getFieldRules(objectFields.name) })(
      <Input
        className="AppendForm__input"
        disabled={loading}
        placeholder={intl.formatMessage({
          id: 'value_placeholder',
          defaultMessage: 'Add value',
        })}
      />,
    )}
  </Form.Item>
);
export default ItemName;
