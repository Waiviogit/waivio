import React from 'react';
import { Form, Input } from 'antd';
import classNames from 'classnames';
import { objectFields } from '../../../../../common/constants/listOfFields';

const ItemTagCategory = (getFieldDecorator, getFieldRules, loading, isSomeValue, intl) => (
  <Form.Item>
    {getFieldDecorator(objectFields.tagCategory, {
      rules: getFieldRules(objectFields.tagCategory),
    })(
      <Input
        className={classNames('AppendForm__input', {
          'validation-error': !isSomeValue,
        })}
        disabled={loading}
        placeholder={intl.formatMessage({
          id: 'category_tag_category_placeholder',
          defaultMessage: 'Tag category',
        })}
      />,
    )}
  </Form.Item>
);
export default ItemTagCategory;
