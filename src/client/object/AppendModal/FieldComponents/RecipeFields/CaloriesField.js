import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { recipeFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const CaloriesField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={recipeFields.calories}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(recipeFields.calories)}
  >
    <Input
      type="number"
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'calories_placeholder',
        defaultMessage: 'Add calories',
      })}
    />
  </BaseField>
);

CaloriesField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

CaloriesField.defaultProps = {
  loading: false,
};

export default React.memo(CaloriesField);
