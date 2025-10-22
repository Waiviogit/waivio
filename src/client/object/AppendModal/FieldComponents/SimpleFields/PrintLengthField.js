import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const PrintLengthField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.printLength}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.printLength)}
  >
    <Input
      type="number"
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'print_length_placeholder',
        defaultMessage: 'Add print length',
      })}
    />
  </BaseField>
);

PrintLengthField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

PrintLengthField.defaultProps = {
  loading: false,
};

export default React.memo(PrintLengthField);
