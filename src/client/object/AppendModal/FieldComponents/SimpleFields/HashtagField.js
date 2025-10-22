import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const HashtagField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.hashtag}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.hashtag)}
  >
    <Input
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'hashtag_placeholder',
        defaultMessage: 'Add hashtag',
      })}
    />
  </BaseField>
);

HashtagField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

HashtagField.defaultProps = {
  loading: false,
};

export default React.memo(HashtagField);
