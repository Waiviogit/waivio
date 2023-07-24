import React from 'react';
import { injectIntl } from 'react-intl';
import { Form, Select } from 'antd';
import PropTypes from 'prop-types';
import { objectFields } from '../../../../common/constants/listOfFields';
import { allContinents, allCountries } from '../AppendModalData/affiliateData';

const AffiliateGeoAreaForm = ({ getFieldDecorator, getFieldRules, intl }) => (
  <Form.Item>
    {getFieldDecorator(objectFields.affiliateGeoArea, {
      rules: getFieldRules(objectFields.affiliateGeoArea),
    })(
      <Select
        placeholder={intl.formatMessage({ id: 'geo_area', defaultMessage: 'GEO area' })}
        showSearch
        optionFilterProp="label"
      >
        {Object.entries(allContinents).map(([label, value]) => (
          <Select.Option key={value} value={value} label={label}>
            {label}
          </Select.Option>
        ))}
        {Object.entries(allCountries).map(([value, label]) => (
          <Select.Option key={value} value={value} label={label}>
            {label}
          </Select.Option>
        ))}
      </Select>,
    )}
  </Form.Item>
);

AffiliateGeoAreaForm.propTypes = {
  getFieldDecorator: PropTypes.func,
  getFieldRules: PropTypes.func,
  intl: PropTypes.shape(),
};

export default injectIntl(AffiliateGeoAreaForm);
