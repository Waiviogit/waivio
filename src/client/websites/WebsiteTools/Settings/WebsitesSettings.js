import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';
import { connect } from 'react-redux';

import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';
import { getWebsiteLoading } from '../../../reducers';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import { saveWebsiteSettings } from '../../websiteActions';

import './WebsitesSettings.less';

const WebsitesSettings = ({ intl, form, loading, saveWebSettings, match }) => {
  const { getFieldDecorator } = form;
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const host = match.params.site;

  useEffect(() => {}, []);

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const beneficiary =
        beneficiaryAccount && values.beneficiaryPercent
          ? {
              account: beneficiaryAccount,
              percent: values.beneficiaryPercent,
            }
          : {};

      // saveWebSettings(host, values.googleAnalyticsTag, ...beneficiary);
    });
  };

  return (
    <div className="center">
      <MobileNavigation />
      <h1>
        <FormattedMessage id="settings" defaultMessage="Settings" />
      </h1>
      <Form className="WebsitesSettings" id="WebsitesSettings" onSubmit={handleSubmit}>
        <Form.Item>
          <h3>
            {intl.formatMessage({
              id: 'google_analytic_tag',
              defaultMessage: 'Google Analytic tag',
            })}
          </h3>
          {getFieldDecorator('googleAnalyticsTag')(
            <Input
              placeholder={intl.formatMessage({
                id: 'paste_tag_here',
                defaultMessage: 'Paste tag here',
              })}
            />,
          )}
        </Form.Item>
        <h3>{intl.formatMessage({ id: 'beneficiary', defaultMessage: 'Beneficiary' })}</h3>
        <p>
          {intl.formatMessage({
            id: 'beneficiary_rules',
            defaultMessage:
              'The website owner may earn a share of the author rewards on posts submitted using their website.',
          })}
        </p>
        <div className="WebsitesSettings__benefic-block">
          <Form.Item>
            <h3>
              {intl.formatMessage({
                id: 'beneficiary_account',
                defaultMessage: 'Beneficiary account:',
              })}
            </h3>
            {beneficiaryAccount ? (
              <SelectUserForAutocomplete
                account={beneficiaryAccount}
                resetUser={() => setBeneficiaryAccount('')}
              />
            ) : (
              <SearchUsersAutocomplete
                handleSelect={({ account }) => setBeneficiaryAccount(account)}
                style={{ width: '100%' }}
              />
            )}
          </Form.Item>
          <Form.Item>
            <h3>
              {intl.formatMessage({
                id: 'beneficiary_percent',
                defaultMessage: 'Beneficiary %:',
              })}
            </h3>
            {getFieldDecorator('beneficiaryPercent')(
              <Input
                placeholder={intl.formatMessage({
                  id: 'enter_percentage',
                  defaultMessage: 'Enter percentage',
                })}
              />,
            )}
          </Form.Item>
        </div>
        <Button type="primary" htmlType="submit" loading={loading}>
          {intl.formatMessage({
            id: 'save',
            defaultMessage: 'Save',
          })}
        </Button>
      </Form>
    </div>
  );
};

WebsitesSettings.propTypes = {
  intl: PropTypes.shape().isRequired,
  form: PropTypes.shape().isRequired,
  loading: PropTypes.bool.isRequired,
  saveWebSettings: PropTypes.func.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }).isRequired,
};

WebsitesSettings.defaultProps = {
  availableStatus: '',
};

export default connect(
  state => ({
    loading: getWebsiteLoading(state),
  }),
  {
    saveWebSettings: saveWebsiteSettings,
  },
)(Form.create()(injectIntl(WebsitesSettings)));
