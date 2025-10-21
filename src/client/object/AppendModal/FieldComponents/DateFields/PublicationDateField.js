import React from 'react';
import { DatePicker } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const PublicationDateField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.publicationDate}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.publicationDate)}
  >
    <DatePicker
      style={{ width: '100%' }}
      disabled={loading}
      format="YYYY-MM-DD"
      placeholder={intl.formatMessage({
        id: 'publication_date_placeholder',
        defaultMessage: 'Select publication date',
      })}
    />
  </BaseField>
);

PublicationDateField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

PublicationDateField.defaultProps = {
  loading: false,
};

export default React.memo(PublicationDateField);
