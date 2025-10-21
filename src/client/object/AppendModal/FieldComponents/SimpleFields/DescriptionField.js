import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const { TextArea } = Input;

const DescriptionField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.description}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.description)}
  >
    <TextArea
      className="AppendForm__input"
      disabled={loading}
      autoSize={{ minRows: 3, maxRows: 6 }}
      placeholder={intl.formatMessage({
        id: 'description_placeholder',
        defaultMessage: 'Add description',
      })}
    />
  </BaseField>
);

DescriptionField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

DescriptionField.defaultProps = {
  loading: false,
};

export default React.memo(DescriptionField);

