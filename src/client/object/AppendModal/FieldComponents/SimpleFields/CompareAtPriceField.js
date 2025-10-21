import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const CompareAtPriceField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.compareAtPrice}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.compareAtPrice)}
  >
    <Input
      type="number"
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'compare_at_price_placeholder',
        defaultMessage: 'Add compare at price',
      })}
    />
  </BaseField>
);

CompareAtPriceField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

CompareAtPriceField.defaultProps = {
  loading: false,
};

export default React.memo(CompareAtPriceField);

