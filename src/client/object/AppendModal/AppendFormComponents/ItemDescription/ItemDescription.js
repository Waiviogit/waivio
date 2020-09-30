import React from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import { objectFields } from '../../../../../common/constants/listOfFields';

const ItemDescription = (getFieldDecorator, getFieldRules, isSomeValue, loading, intl) => (
  <Form.Item>
    {getFieldDecorator(objectFields.description, {
      rules: getFieldRules(objectFields.description),
    })(
      <Input.TextArea
        className={classNames('AppendForm__input', {
          'validation-error': !isSomeValue,
        })}
        disabled={loading}
        autoSize={{ minRows: 4, maxRows: 8 }}
        placeholder={intl.formatMessage({
          id: 'description_full',
          defaultMessage: 'Full description',
        })}
      />,
    )}
  </Form.Item>
);
export default ItemDescription;
