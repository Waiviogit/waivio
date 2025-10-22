import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { recipeFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const BudgetField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={recipeFields.budget}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(recipeFields.budget)}
  >
    <Input
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'budget_placeholder',
        defaultMessage: 'Add budget',
      })}
    />
  </BaseField>
);

BudgetField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

BudgetField.defaultProps = {
  loading: false,
};

export default React.memo(BudgetField);
