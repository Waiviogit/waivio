import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const LanguageField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.language}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.language)}
  >
    <Input
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'language_placeholder',
        defaultMessage: 'Add language',
      })}
    />
  </BaseField>
);

LanguageField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

LanguageField.defaultProps = {
  loading: false,
};

export default React.memo(LanguageField);
