import React, { useEffect, useState } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Form, Input } from 'antd';
import { connect } from 'react-redux';
import { get, isEmpty } from 'lodash';

import MobileNavigation from '../../../components/Navigation/MobileNavigation/MobileNavigation';
import { getSettingsSite, getWebsiteLoading } from '../../../reducers';
import SelectUserForAutocomplete from '../../../widgets/SelectUserForAutocomplete';
import SearchUsersAutocomplete from '../../../components/EditorUser/SearchUsersAutocomplete';
import { getWebsiteSettings, saveWebsiteSettings } from '../../websiteActions';
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
}) => {
  const { getFieldDecorator } = form;
  const [beneficiaryAccount, setBeneficiaryAccount] = useState('');
  const host = match.params.site;

  useEffect(() => {
    getWebSettings(host);
  }, []);

  useEffect(() => {
    const beneficiaryAcc = get(settings, ['beneficiary', 'account']);

    if (beneficiaryAcc) setBeneficiaryAccount(beneficiaryAcc);
  }, [settings]);

  const handleChange = (e, fieldsName) =>
    form.setFieldsValue({ [fieldsName]: e.currentTarget.value });

  const handleSubmit = e => {
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const percent = values.beneficiaryPercent || get(settings, ['beneficiary', 'percent']);
        const account = beneficiaryAccount || get(settings, ['beneficiary', 'account']);
        const tag = values.googleAnalyticsTag || get(settings, 'googleAnalyticsTag');
        const beneficiary = account && percent ? { account, percent } : {};

        saveWebSettings(host, tag, beneficiary);
      }
    });
  };

  if (isEmpty(settings)) return <Loading />;

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
              <Input.Group>
                <Input
                  disabled={!beneficiaryAccount}
                  placeholder={intl.formatMessage({
                    id: 'enter_percentage',
                    defaultMessage: 'Enter percentage',
                  })}
                  defaultValue={get(settings, ['beneficiary', 'percent'])}
                  onChange={e => handleChange(e, 'beneficiaryPercent')}
                  required={beneficiaryAccount}
                />
              </Input.Group>,
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
  settings: PropTypes.shape({}).isRequired,
  saveWebSettings: PropTypes.func.isRequired,
  getWebSettings: PropTypes.func.isRequired,
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
  },
)(Form.create()(injectIntl(WebsitesSettings)));
