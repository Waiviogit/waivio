import React from 'react';
import classNames from 'classnames';
import { Form, Input } from 'antd';
import { objectFields } from '../../../../../common/constants/listOfFields';

const ItemHours = (getFieldDecorator, getFieldRules, isSomeValue, loading, intl) => (
  <Form.Item>
    {getFieldDecorator(objectFields.workTime, {
      rules: getFieldRules(objectFields.workTime),
    })(
      <Input.TextArea
        autoSize={{ minRows: 4, maxRows: 8 }}
        className={classNames('AppendForm__input', {
          'validation-error': !isSomeValue,
        })}
        disabled={loading}
        placeholder={intl.formatMessage({
          id: 'work_time',
          defaultMessage: 'Hours',
        })}
      />,
    )}
  </Form.Item>
);
export default ItemHours;
