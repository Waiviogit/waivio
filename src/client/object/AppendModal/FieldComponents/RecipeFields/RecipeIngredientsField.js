import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { recipeFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const { TextArea } = Input;

const RecipeIngredientsField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={recipeFields.recipeIngredients}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(recipeFields.recipeIngredients)}
  >
    <TextArea
      className="AppendForm__input"
      disabled={loading}
      autoSize={{ minRows: 4, maxRows: 10 }}
      placeholder={intl.formatMessage({
        id: 'recipe_ingredients_placeholder',
        defaultMessage: 'Add ingredients (one per line)',
      })}
    />
  </BaseField>
);

RecipeIngredientsField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

RecipeIngredientsField.defaultProps = {
  loading: false,
};

export default React.memo(RecipeIngredientsField);
