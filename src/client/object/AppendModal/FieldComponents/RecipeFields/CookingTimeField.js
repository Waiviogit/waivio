import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { recipeFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const CookingTimeField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={recipeFields.cookingTime}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(recipeFields.cookingTime)}
  >
    <Input
      type="number"
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'cooking_time_placeholder',
        defaultMessage: 'Add cooking time (minutes)',
      })}
    />
  </BaseField>
);

CookingTimeField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

CookingTimeField.defaultProps = {
  loading: false,
};

export default React.memo(CookingTimeField);
