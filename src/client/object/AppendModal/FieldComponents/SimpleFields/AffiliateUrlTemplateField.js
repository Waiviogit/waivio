import React from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
// intl passed as prop from AppendForm
import { objectFields } from '../../../../../common/constants/listOfFields';
import BaseField from '../BaseField';

const AffiliateUrlTemplateField = ({ getFieldDecorator, loading, getFieldRules, intl }) => (
  <BaseField
    fieldName={objectFields.affiliateUrlTemplate}
    getFieldDecorator={getFieldDecorator}
    rules={getFieldRules(objectFields.affiliateUrlTemplate)}
  >
    <Input
      type="url"
      className="AppendForm__input"
      disabled={loading}
      placeholder={intl.formatMessage({
        id: 'affiliate_url_template_placeholder',
        defaultMessage: 'Add affiliate URL template',
      })}
    />
  </BaseField>
);

AffiliateUrlTemplateField.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  getFieldRules: PropTypes.func.isRequired,
  intl: PropTypes.shape().isRequired,
};

AffiliateUrlTemplateField.defaultProps = {
  loading: false,
};

export default React.memo(AffiliateUrlTemplateField);
