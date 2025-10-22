import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const NameField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.objectName}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.objectName)}
  >
    <Input
      autoFocus
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'value_placeholder',
        defaultMessage: 'Add value',
      })}
    />
  </BaseField>
);

NameField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

NameField.defaultProps = {
  loading: false,
};

export default React.memo(NameField);
