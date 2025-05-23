import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Button, Input, message, Icon } from 'antd';
import Loading from '../../../components/Icon/Loading';
import { getAuthenticatedUserName } from '../../../../store/authStore/authSelectors';
import {
  deleteShopifySettings,
  getShopifySettings,
  saveShopifySettings,
} from '../../../../waivioApi/importApi';

const AdSenseAds = ({ intl, match, userName }) => {
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const initialFields = {
    hostName: '',
    accessToken: '',
    apiKey: '',
    apiSecretKey: '',
  };
  const [fields, setFields] = useState(initialFields);

  const [visibility, setVisibility] = useState({
    accessToken: false,
    apiKey: false,
    apiSecretKey: false,
  });

  const waivioHostName = match.params.site;

  useEffect(() => {
    if (waivioHostName) {
      setLoading(true);

      getShopifySettings(userName, waivioHostName).then(r => {
        const showDeleteBtn =
          !isEmpty(r.hostName) ||
          !isEmpty(r.accessToken) ||
          !isEmpty(r.apiKey) ||
          !isEmpty(r.apiSecretKey);

        setShowDelete(showDeleteBtn);
        setFields({
          hostName: r.hostName,
          accessToken: r.accessToken,
          apiKey: r.apiKey,
          apiSecretKey: r.apiSecretKey,
        });
        setLoading(false);
      });
    }
  }, [waivioHostName]);

  const handleChange = (key, value) => {
    setFields(prev => ({ ...prev, [key]: value }));
  };

  const toggleVisibility = key => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveSettings = (hostName, accessToken, apiKey, apiSecretKey) => {
    saveShopifySettings(userName, waivioHostName, hostName, accessToken, apiKey, apiSecretKey).then(
      res => {
        setButtonLoading(false);
        if (!res.message) {
          message.success(intl.formatMessage({ id: 'shopify_updated_successfully' }));
        } else {
          message.error(res.message);
        }
      },
    );
  };
  const handleDeleteShopifySettings = () => {
    deleteShopifySettings(userName, waivioHostName);
    setFields(initialFields);
  };
  const handleSaveShopifySettings = () => {
    setButtonLoading(true);
    const { hostName, accessToken, apiKey, apiSecretKey } = fields;

    saveSettings(hostName, accessToken, apiKey, apiSecretKey);
  };

  if (loading) return <Loading />;

  return (
    <div className="AdSenseAds center">
      <h1 className="AffiliateCodes__mainTitle">
        {intl.formatMessage({
          id: 'shopify',
          defaultMessage: 'Shopify',
        })}
      </h1>
      <p>
        Easily import products from your Shopify store by connecting it to the platform. To get
        started, enter your Shopify API credentials. Once the connection is established, you&apos;ll
        be able to begin importing product data seamlessly.
      </p>
      <p>
        For step-by-step guidance on how to find your Shopify API credentials and locate the
        necessary information in your Shopify admin dashboard, see Details.
      </p>
      <p>
        All required information can be found in your Shopify app account. API details are available
        in the API credentials section. The host name should look like test.myshopify.com. Here are{' '}
        <a
          href={
            'https://www.waivio.com/object/rxj-shopify-api-credentials-setup-guide-for-waivio-integration'
          }
          target={'_blank'}
          rel="noreferrer"
        >
          instructions
        </a>{' '}
        on how to receive all the necessary credentials on Shopify.
      </p>
      <h3 key="label-host">Shopify store host name:</h3>
      <Input
        key="input-host"
        value={fields.hostName}
        onChange={e => handleChange('hostName', e.target.value)}
        placeholder="Enter host"
      />
      <h3 key="label-admin-token">Admin API access token:</h3>
      <Input
        key="input-admin-token"
        type={visibility.accessToken ? 'text' : 'password'}
        value={fields.accessToken}
        onChange={e => handleChange('accessToken', e.target.value)}
        placeholder="Enter access token"
        suffix={
          <Icon
            type={visibility.accessToken ? 'eye-invisible' : 'eye'}
            onClick={() => toggleVisibility('accessToken')}
            style={{ cursor: 'pointer', color: '#99aab5' }}
          />
        }
      />
      <h3 key="label-api-key">API key:</h3>
      <Input
        key="input-api-key"
        type={visibility.apiKey ? 'text' : 'password'}
        value={fields.apiKey}
        onChange={e => handleChange('apiKey', e.target.value)}
        placeholder="Enter API key"
        suffix={
          <Icon
            type={visibility.apiKey ? 'eye-invisible' : 'eye'}
            onClick={() => toggleVisibility('apiKey')}
            style={{ cursor: 'pointer', color: '#99aab5' }}
          />
        }
      />
      <h3 key="label-api-secret">API secret key:</h3>
      <Input
        key="input-api-secret"
        type={visibility.apiSecretKey ? 'text' : 'password'}
        value={fields.apiSecretKey}
        onChange={e => handleChange('apiSecretKey', e.target.value)}
        placeholder="Enter secret key"
        suffix={
          <Icon
            type={visibility.apiSecretKey ? 'eye-invisible' : 'eye'}
            onClick={() => toggleVisibility('apiSecretKey')}
            style={{ cursor: 'pointer', color: '#99aab5' }}
          />
        }
      />
      <Button
        style={{ marginTop: '25px' }}
        type="primary"
        htmlType="submit"
        loading={buttonLoading}
        onClick={handleSaveShopifySettings}
      >
        <FormattedMessage id="save" defaultMessage="Save" />
      </Button>
      {showDelete && (
        <Button
          style={{ marginTop: '25px', marginLeft: '15px' }}
          type="danger"
          htmlType="submit"
          onClick={handleDeleteShopifySettings}
        >
          <FormattedMessage id="matchBot_btn_delete" defaultMessage="Delete" />
        </Button>
      )}{' '}
    </div>
  );
};

AdSenseAds.propTypes = {
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      site: PropTypes.string,
    }),
  }).isRequired,

  userName: PropTypes.string.isRequired,
};

export default connect(
  state => ({
    userName: getAuthenticatedUserName(state),
  }),
  {},
)(withRouter(injectIntl(AdSenseAds)));
