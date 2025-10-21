import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const AgeRangeField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.ageRange}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.ageRange)}
  >
    <Input
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'age_range_placeholder',
        defaultMessage: 'Add age range',
      })}
    />
  </BaseField>
);

AgeRangeField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

AgeRangeField.defaultProps = {
  loading: false,
};

export default React.memo(AgeRangeField);

