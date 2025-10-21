import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const PriceField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.price}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.price)}
  >
    <Input
      type="number"
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'price_placeholder',
        defaultMessage: 'Add price',
      })}
    />
  </BaseField>
);

PriceField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

PriceField.defaultProps = {
  loading: false,
};

export default React.memo(PriceField);

