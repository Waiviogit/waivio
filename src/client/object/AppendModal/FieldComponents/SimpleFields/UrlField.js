import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const UrlField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.url}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.url)}
  >
    <Input
      type="url"
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'url_placeholder',
        defaultMessage: 'Add URL',
      })}
    />
  </BaseField>
);

UrlField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

UrlField.defaultProps = {
  loading: false,
};

export default React.memo(UrlField);

