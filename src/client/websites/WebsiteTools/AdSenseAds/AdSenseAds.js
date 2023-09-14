import React, { useEffect, useState } from 'react';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Select, Input, Button, message } from 'antd';
import './AdSenseAds.less';

import {
  getAdsenseSettings,
  saveAdSenseSettings,
} from '../../../../store/websiteStore/websiteActions';
import Loading from '../../../components/Icon/Loading';

const AdSenseAds = ({ intl, saveAdSense, match, getAdSettings }) => {
  const adIntensityLevels = [
    { value: '1 - Minimal', key: 'minimal' },
    { value: '2 - Moderate', key: 'moderate' },
    { value: '3 - Intensive', key: 'intensive' },
  ];
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState('');
  const [adText, setAdText] = useState('');
  const [adSense, setAdSense] = useState('');
  const host = match.params.site;
  const scriptRegex = /<script[^>]*>/g;

  const scriptTags = adSense.match(scriptRegex);

  const showError =
    !isEmpty(adSense) &&
    (!adSense.includes('async') ||
      !adSense.includes('<script') ||
      !adSense.includes('src="https://pagead2.googlesyndication.com') ||
      scriptTags.length > 1);
  const handleChangeAdSense = e => {
    setAdSense(e.target.value);
  };
  const handleChangeAdSenseText = e => {
    setAdText(e.target.value);
  };
  const showTextError =
    !isEmpty(adText) &&
    (adText.includes('<script') ||
      adText.includes('</script') ||
      !adText.includes('google.com') ||
      !adText.includes('pub'));

  const disabled = showError && showTextError;

  const handleSaveAdSenseSettings = () => {
    handleWriteTxtFile();
    saveAdSense(host, adSense, level);
    message.success(intl.formatMessage({ id: 'adSense_advertisements_updated_successfully' }));
  };

  useEffect(() => {
    setLoading(true);
    host &&
      getAdSettings(host).then(res => {
        setLevel(isEmpty(res.value.level) ? adIntensityLevels[0].key : res.value.level);
        setAdSense(res.value.code);
        setLoading(false);
      });
  }, [host]);

  const handleWriteTxtFile = () => {
    fetch('/write-txt-to-file', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ adText }),
    })
      .then(response => response.text())
      // .then(m => {
      //   console.log(m);
      //   // Optionally, clear the adText input field
      //   setAdText('');
      // })
      .catch(error => {
        console.error(error);
      });
  };

  if (loading) return <Loading />;

  return (
    <div className="AdSenseAds">
      <h1 className="AffiliateCodes__mainTitle">
        {intl.formatMessage({
          id: 'adsense_advertisements',
          defaultMessage: 'AdSense advertisements',
        })}
      </h1>
      <p>
        {' '}
        Google AdSense is a program that allows website owners to earn revenue by displaying
        targeted advertisements on their site. These ads are chosen based on the content of the site
        and the interests of the visitors, ensuring relevance to your audience.
      </p>
      <p>
        When integrating the AdSense code into your website, you can choose the level of ad
        intensity, allowing you to control how prominently the ads are displayed. Simply add the
        code from Google AdSense and select the desired intensity level on our platform.
      </p>
      <h3>AdSense code:</h3>
      <Input.TextArea
        value={adSense}
        onChange={e => handleChangeAdSense(e)}
        placeholder={'Add your AdSense code'}
        autoSize={{ minRows: 2 }}
      />
      {showError && (
        <div className="AdSenseAds__error">
          {' '}
          Invalid AdSense code entered. Please provide a valid script.
        </div>
      )}
      <p>
        This code will be displayed within the &lt;head&gt;&lt;/head&gt; tags on every page of your
        site.
      </p>
      <h3>Ads.txt:</h3>
      <Input.TextArea
        value={adText}
        onChange={e => handleChangeAdSenseText(e)}
        placeholder={'Add your AdSense .txt text'}
        autoSize={{ minRows: 2 }}
      />
      {showTextError && (
        <div className="AdSenseAds__error">
          {' '}
          Invalid AdSense text entered. Please provide a valid text.
        </div>
      )}
      <p>This text will be added to ads.txt to your site.</p>
      <h3>Level:</h3>
      <Select
        defaultValue={adIntensityLevels?.find(l => l.key === level)?.value}
        onSelect={l => setLevel(l)}
      >
        {adIntensityLevels.map(o => (
          <Select.Option key={o.key}>{o.value}</Select.Option>
        ))}
      </Select>
      <p>Choose the advertising intensity to balance user experience with revenue generation.</p>
      <Button
        disabled={disabled}
        type="primary"
        htmlType="submit"
        // loading={isLoading}
        onClick={handleSaveAdSenseSettings}
      >
        <FormattedMessage id="save" defaultMessage="Save" />
      </Button>
    </div>
  );
};

AdSenseAds.propTypes = {
  intl: PropTypes.shape(),
  match: PropTypes.shape(),
  saveAdSense: PropTypes.func,
  getAdSettings: PropTypes.func,
};

export default connect(null, {
  saveAdSense: saveAdSenseSettings,
  getAdSettings: getAdsenseSettings,
})(withRouter(injectIntl(AdSenseAds)));
