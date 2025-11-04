import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const AuthorityField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.authority}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.authority)}
  >
    <Input
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'authority_placeholder',
        defaultMessage: 'Add authority',
      })}
    />
  </BaseField>
);

AuthorityField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

AuthorityField.defaultProps = {
  loading: false,
};

export default React.memo(AuthorityField);
