import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const EmailField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.email}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.email)}
  >
    <Input
      type="email"
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'email_placeholder',
        defaultMessage: 'Add email',
      })}
    />
  </BaseField>
);

EmailField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

EmailField.defaultProps = {
  loading: false,
};

export default React.memo(EmailField);
