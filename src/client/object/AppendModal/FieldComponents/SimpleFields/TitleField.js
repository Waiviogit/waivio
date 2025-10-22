import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const TitleField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.title}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.title)}
  >
    <Input
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'title_placeholder',
        defaultMessage: 'Add title',
      })}
    />
  </BaseField>
);

TitleField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

TitleField.defaultProps = {
  loading: false,
};

export default React.memo(TitleField);
