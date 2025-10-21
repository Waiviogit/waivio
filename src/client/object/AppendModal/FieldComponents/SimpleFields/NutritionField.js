import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const { TextArea } = Input;

const NutritionField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.nutrition}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.nutrition)}
  >
    <TextArea
      className="AppendForm__input"
      disabled={loading}
      autoSize={{ minRows: 3, maxRows: 6 }}
      placeholder={intl.formatMessage({
        id: 'nutrition_placeholder',
        defaultMessage: 'Add nutrition information',
      })}
    />
  </BaseField>
);

NutritionField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

NutritionField.defaultProps = {
  loading: false,
};

export default React.memo(NutritionField);

