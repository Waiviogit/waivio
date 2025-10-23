import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const WorkTimeField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.workTime}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.workTime)}
  >
    <Input
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'work_time_placeholder',
        defaultMessage: 'Add work time',
      })}
    />
  </BaseField>
);

WorkTimeField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

WorkTimeField.defaultProps = {
  loading: false,
};

export default React.memo(WorkTimeField);
