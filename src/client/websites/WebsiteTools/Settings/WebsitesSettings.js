import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Checkbox, Form, Input, message, Select } from 'antd';
import { connect } from 'react-redux';
import { get } from 'lodash';
import languages from '../../../../common/translations/languages';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import {
  getWebsiteSettings,
  referralUserForWebsite,
  saveWebsiteSettings,
} from '../../../../store/websiteStore/websiteActions';
import Loading from '../../../components/Icon/Loading';
import {
  getSettingsSite,
  getWebsiteLoading,
} from '../../../../store/websiteStore/websiteSelectors';
import { currencyTypes, defaultCurrency } from '../../constants/currencyTypes';

import './WebsitesSettings.less';
import { showGoogleGSCTagError } from '../../helper';

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
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [objectControl, setObjectControl] = useState(false);
  const [googleGSC, setGoogleGSC] = useState('');
  const host = match.params.site;

  useEffect(() => {
    setSettingsLoading(true);
    getWebSettings(host)
      .then(res => {
        const percent = get(res, ['value', 'beneficiary', 'percent']) / 100;
        const account = get(res, ['value', 'beneficiary', 'account']);
        const googleGscTag = get(res, ['value', 'googleGSCTag']);
        const referral = get(res, ['value', 'referralCommissionAcc']);
        const objControl = get(res, ['value', 'objectControl']);

        setBeneficiaryPercent(percent);
        setGoogleGSC(googleGscTag);
        setObjectControl(objControl);
        setBeneficiaryAccount(account);
        setReferralAccount(referral);
        setSettingsLoading(false);
      })
      .catch(() => setSettingsLoading(false));
  }, [location.pathname]);

  const handleChange = (e, fieldsName) =>
    form.setFieldsValue({ [fieldsName]: e.currentTarget.value });
  const handleChangeGoogleGSCTag = e => {
    form.setFieldsValue({ googleGSCTag: e.currentTarget.value });
    setGoogleGSC(e.currentTarget.value);
  };

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
        const percent = (beneficiaryPercent || 3) * 100;
        const account = beneficiaryAccount || 'waivio';
        const tag = values.googleAnalyticsTag || '';
        const gscTag = values.googleGSCTag || '';
        const beneficiary = { account, percent };

        saveWebSettings(
          host,
          tag,
          gscTag,
          beneficiary,
          values.currency,
          values.language,
          objectControl,
        );
        referralUserForWeb(referralAccount, host);
        message.success(intl.formatMessage({ id: 'settings_updated_successfully' }));
      }
    });
  };

  if (settingsLoading) return <Loading />;

  return (
    <div className="WebsitesSettings-middle center">
      <h1>{intl.formatMessage({ id: 'settings' })}</h1>
      <Form className="WebsitesSettings" id="WebsitesSettings" onSubmit={handleSubmit}>
        <Form.Item>
          <h3>{intl.formatMessage({ id: 'default_language' })}</h3>
          {getFieldDecorator('language', {
            initialValue: get(settings, 'language') || 'en-US',
          })(
            <Select className="WebsitesSettings__language">
              {languages.map(lang => (
                <Select.Option key={lang.id}>{lang.name}</Select.Option>
              ))}
            </Select>,
          )}
          <p>{intl.formatMessage({ id: 'disclaimer_language' })}</p>
        </Form.Item>
        <Form.Item>
          <h3>{intl.formatMessage({ id: 'base_currency' })}</h3>
          {getFieldDecorator('currency', {
            initialValue: get(settings, 'currency') || defaultCurrency,
          })(
            <Select className="WebsitesSettings__currency">
              {currencyTypes.map(currency => (
                <Select.Option key={currency}>{currency}</Select.Option>
              ))}
            </Select>,
          )}
          <p>{intl.formatMessage({ id: 'disclaimer_exchange_rates' })}</p>
        </Form.Item>
        <Form.Item>
          <h3>{intl.formatMessage({ id: 'object_editing_by_users' })}:</h3>
          <div className={'WebsitesSettings__obj-editing'}>
            <Checkbox onClick={() => setObjectControl(!objectControl)} checked={objectControl} />
            <p className={'WebsitesSettings__obj-editing-info '}>
              {intl.formatMessage({ id: 'object_editing_by_users_info' })}
            </p>
          </div>
        </Form.Item>
        <Form.Item>
          <h3>{intl.formatMessage({ id: 'google_analytic_tag' })}</h3>
          {getFieldDecorator('googleAnalyticsTag', {
            initialValue: get(settings, 'googleAnalyticsTag', ''),
          })(
            <Input
              type="text"
              placeholder={intl.formatMessage({ id: 'paste_tag_here' })}
              onChange={e => handleChange(e, 'googleAnalyticsTag')}
            />,
          )}
          <p>{intl.formatMessage({ id: 'website_performance' })}</p>
        </Form.Item>
        <Form.Item
          validateStatus={showGoogleGSCTagError(googleGSC) ? 'error' : ''}
          help={
            showGoogleGSCTagError(googleGSC)
              ? 'Invalid HTML meta tag entered. Please provide a valid tag.'
              : null
          }
        >
          <h3>
            {intl.formatMessage({
              id: 'google_search_console_html_verification_tag',
              defaultMessage: 'Google Search Console HTML verification tag',
            })}
          </h3>
          {getFieldDecorator('googleGSCTag', {
            initialValue: get(settings, 'googleGSCTag', ''),
          })(
            <Input
              type="text"
              placeholder={intl.formatMessage({ id: 'paste_your_meta_tag_here' })}
              onChange={e => handleChangeGoogleGSCTag(e)}
            />,
          )}
          <p>{intl.formatMessage({ id: 'gsc_tag_description_info' })}</p>
        </Form.Item>
        <h3>{intl.formatMessage({ id: 'beneficiary' })}</h3>
        <p>{intl.formatMessage({ id: 'beneficiary_rules' })}</p>
        <div className="WebsitesSettings__benefic-block">
          <Form.Item>
            <h3>{intl.formatMessage({ id: 'beneficiary_account' })}</h3>
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
            <h3>{intl.formatMessage({ id: 'beneficiary_percent' })}</h3>
            {getFieldDecorator('beneficiaryPercent', {
              initialValue: beneficiaryPercent,
              rules: [
                {
                  required: beneficiaryAccount,
                  message: intl.formatMessage({ id: 'beneficiary_is_required' }),
                },
                {
                  validator: (rule, value) => {
                    if (value) {
                      return Number(value)
                        ? Promise.resolve()
                        : Promise.reject(intl.formatMessage({ id: 'beneficiary_error' }));
                    }

                    return Promise.resolve();
                  },
                },
              ],
            })(
              <Input
                disabled={!beneficiaryAccount}
                placeholder={intl.formatMessage({ id: 'enter_percentage' })}
                onChange={handleChangePercent}
              />,
            )}
          </Form.Item>
        </div>
        <h3>{intl.formatMessage({ id: 'referral_payments' })}</h3>
        <p>{intl.formatMessage({ id: 'referral_rules' })}</p>
        <div className="WebsitesSettings__benefic-block">
          <Form.Item>
            <h3>{intl.formatMessage({ id: 'referral_payments_acc' })}</h3>
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
        <p className="WebsitesSettings__referral-terms">
          {intl.formatMessage({ id: 'referral_terms' })}
        </p>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          disabled={showGoogleGSCTagError(googleGSC)}
        >
          {intl.formatMessage({ id: 'save' })}
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
    objectControl: PropTypes.bool,
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
