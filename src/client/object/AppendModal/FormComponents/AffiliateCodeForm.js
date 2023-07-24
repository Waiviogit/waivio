import React, { useEffect, useState } from 'react';
import { Form, Input, Select } from 'antd';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';
import { objectFields } from '../../../../common/constants/listOfFields';
import { getWebsites } from '../../../../waivioApi/ApiClient';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';

const AffiliateCodeForm = ({ getFieldDecorator, getFieldRules, loading, intl }) => {
  const host = location.hostname;
  const [context, setContext] = useState([host, 'PERSONAL']);
  const userName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    getWebsites(userName).then(sites => setContext([...context, ...sites.map(s => s.host)]));
  }, [userName, host]);

  return (
    <>
      <p className={'ant-form-item-label AppendForm__appendTitles'}>Context</p>
      <Form.Item>
        {getFieldDecorator(objectFields.affiliateContext, {
          initialValue: host,
          rules: getFieldRules(objectFields.affiliateContext),
        })(
          <Select defaultValue={host} showSearch disabled={loading}>
            {context?.map(site => (
              <Select.Option key={site} value={site} label={site}>
                {site}
              </Select.Option>
            ))}
          </Select>,
        )}
      </Form.Item>
      <p className={'ant-form-item-label AppendForm__appendTitles'}>Affiliate code</p>
      <Form.Item>
        {getFieldDecorator(objectFields.affiliateCode, {
          rules: getFieldRules(objectFields.affiliateCode),
        })(
          <Input
            autoFocus
            disabled={loading}
            placeholder={intl.formatMessage({
              id: 'my_affiliate_code',
              defaultMessage: 'My affiliate code',
            })}
          />,
        )}
      </Form.Item>
    </>
  );
};

AffiliateCodeForm.propTypes = {
  getFieldDecorator: PropTypes.func,
  getFieldRules: PropTypes.func,
  intl: PropTypes.shape(),
  loading: PropTypes.bool,
};

export default injectIntl(AffiliateCodeForm);
