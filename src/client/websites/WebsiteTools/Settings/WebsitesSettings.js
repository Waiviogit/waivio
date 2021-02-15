import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';
import { connect } from 'react-redux';
import { get, isEmpty } from 'lodash';

import { getSettingsSite, getWebsiteLoading } from '../../../reducers';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import {
  getWebsiteSettings,
  referralUserForWebsite,
  saveWebsiteSettings,
} from '../../websiteActions';
import Loading from '../../../components/Icon/Loading';

import './WebsitesSettings.less';

const WebsitesSettings = ({
  intl,
  form,
  loading,
  saveWebSettings,
  match,
  getWebSettings,
  settings,
  location,
  referralUserForWeb,
}) => {
  const { getFieldDecorator } = form;
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const [beneficiaryPercent, setBeneficiaryPercent] = useState(1);
  const [referralAccount, setReferralAccount] = useState('');

  const host = match.params.site;

  useEffect(() => {
    getWebSettings(host).then(res => {
      const percent = get(res, ['value', 'beneficiary', 'percent']) / 100;
      const account = get(res, ['value', 'beneficiary', 'account']);
      const referral = get(res, ['value', 'referralCommissionAcc']);

      setBeneficiaryPercent(percent);
      setBeneficiaryAccount(account);
      setReferralAccount(referral);
    });
  }, [location.pathname]);

  const handleChange = (e, fieldsName) =>
    form.setFieldsValue({ [fieldsName]: e.currentTarget.value });

  const resetBeneficiaryUser = () => {
    setBeneficiaryAccount('');
    setBeneficiaryPercent(0);
  };

  const handleChangePercent = e => {
    const value = e.currentTarget.value;

    if (value <= 100 && value >= 0) setBeneficiaryPercent(value);
  };

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const percent = (beneficiaryPercent || 1) * 100;
        const account = beneficiaryAccount || 'waivio';
        const tag = values.googleAnalyticsTag || settings.googleAnalyticsTag || '';
        const beneficiary = { account, percent };

        saveWebSettings(host, tag, beneficiary);
        if (referralAccount) referralUserForWeb(referralAccount, host);
      }
    });
  };

  if (isEmpty(settings)) return <Loading />;

  return (
    <div className="WebsitesSettings-middle">
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
            <Input.Group>
              <Input
                type="text"
                placeholder={intl.formatMessage({
                  id: 'paste_tag_here',
                  defaultMessage: 'Paste tag here',
                })}
                defaultValue={get(settings, 'googleAnalyticsTag')}
                onChange={e => handleChange(e, 'googleAnalyticsTag')}
              />
            </Input.Group>,
          )}
          <p>
            {intl.formatMessage({
              id: 'website_performance',
              defaultMessage: 'You can monitor website performance using Google Analytics.',
            })}
          </p>
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
                resetUser={resetBeneficiaryUser}
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
              <Input.Group>
                <Input
                  disabled={!beneficiaryAccount}
                  placeholder={intl.formatMessage({
                    id: 'enter_percentage',
                    defaultMessage: 'Enter percentage',
                  })}
                  onChange={handleChangePercent}
                  value={beneficiaryPercent}
                  required={beneficiaryAccount}
                />
              </Input.Group>,
            )}
          </Form.Item>
        </div>
        <div className="WebsitesSettings__benefic-block">
          <Form.Item>
            <h3>
              {intl.formatMessage({
                id: 'referral_payments',
                defaultMessage: 'Referral payments:',
              })}
            </h3>
            {referralAccount ? (
              <SelectUserForAutocomplete
                account={referralAccount}
                resetUser={() => setReferralAccount('')}
              />
            ) : (
              <SearchUsersAutocomplete
                handleSelect={({ account }) => setReferralAccount(account)}
                style={{ width: '100%' }}
              />
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
  settings: PropTypes.shape({
    googleAnalyticsTag: PropTypes.string,
  }).isRequired,
  location: PropTypes.shape().isRequired,
  saveWebSettings: PropTypes.func.isRequired,
  getWebSettings: PropTypes.func.isRequired,
  referralUserForWeb: PropTypes.func.isRequired,
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
    settings: getSettingsSite(state),
  }),
  {
    saveWebSettings: saveWebsiteSettings,
    getWebSettings: getWebsiteSettings,
    referralUserForWeb: referralUserForWebsite,
  },
)(Form.create()(withRouter(injectIntl(WebsitesSettings))));
