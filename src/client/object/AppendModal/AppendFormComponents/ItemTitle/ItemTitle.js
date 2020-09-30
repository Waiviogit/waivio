import React from 'react';
import classNames from 'classnames';
import { Form, Input } from 'antd';
import { objectFields } from '../../../../../common/constants/listOfFields';

const ItemTitle = (getFieldDecorator, getFieldRules, isSomeValue, loading, intl) => (
  <Form.Item>
    {getFieldDecorator(objectFields.title, {
      rules: getFieldRules('objectFields.title'),
    })(
      <Input
        className={classNames('AppendForm__input', {
          'validation-error': !isSomeValue,
        })}
        disabled={loading}
        placeholder={intl.formatMessage({
          id: 'description_short',
          defaultMessage: 'Short description',
        })}
      />,
    )}
  </Form.Item>
);
export default ItemTitle;
