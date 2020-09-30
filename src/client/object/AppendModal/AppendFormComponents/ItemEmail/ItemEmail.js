import React from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import { objectFields } from '../../../../../common/constants/listOfFields';

const ItemEmail = (getFieldDecorator, getFieldRules, isSomeValue, loading, intl) => (
  <Form.Item>
    {getFieldDecorator(objectFields.email, {
      rules: getFieldRules(objectFields.email),
    })(
      <Input
        className={classNames('AppendForm__input', {
          'validation-error': !isSomeValue,
        })}
        disabled={loading}
        placeholder={intl.formatMessage({
          id: 'email_placeholder',
          defaultMessage: 'Email address',
        })}
      />,
    )}
  </Form.Item>
);
export default ItemEmail;
