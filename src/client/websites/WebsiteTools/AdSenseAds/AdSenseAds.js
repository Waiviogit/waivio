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

export const adIntensityLevels = [
  { value: '1 - Minimal', key: 'minimal', frequency: 15 },
  { value: '2 - Moderate', key: 'moderate', frequency: 10 },
  { value: '3 - Intensive', key: 'intensive', frequency: 5 },
];
const AdSenseAds = ({ intl, saveAdSense, match, getAdSettings }) => {
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [level, setLevel] = useState('');
  const [txtFile, setTxtFile] = useState('');
  const [adSense, setAdSense] = useState('');
  const [displayUnitCode, setDisplayUnitCode] = useState('');
  const host = match.params.site;
  const scriptRegex = /<script[^>]*>/g;

  const scriptTags = adSense.match(scriptRegex);

  const showError =
    !isEmpty(adSense) &&
    (!adSense.includes('async') ||
      !adSense.includes('<script') ||
      !adSense.includes('src="https://pagead2.googlesyndication.com') ||
      scriptTags.length > 1);
  const showDisplayUnitCodeError = !isEmpty(displayUnitCode) && !displayUnitCode.includes('<ins');
  const handleChangeAdSense = e => {
    setAdSense(e.target.value);
  };
  const handleChangeDisplayUnitCode = e => {
    setDisplayUnitCode(e.target.value);
  };
  const handleChangeAdSenseText = e => {
    setTxtFile(e.target.value);
  };
  const showTextError =
    !isEmpty(txtFile) &&
    (txtFile.includes('<script') ||
      txtFile.includes('</script') ||
      !txtFile.includes('google.com') ||
      !txtFile.includes('pub'));

  const disabled = showError && showTextError;

  const handleSaveAdSenseSettings = () => {
    setButtonLoading(true);
    saveAdSense(host, adSense, level, txtFile, displayUnitCode).then(res => {
      setButtonLoading(false);
      if (!res.value.error)
        message.success(intl.formatMessage({ id: 'adSense_advertisements_updated_successfully' }));
    });
  };

  useEffect(() => {
    setLoading(true);
    host &&
      getAdSettings(host).then(res => {
        setLevel(isEmpty(res.value.level) ? adIntensityLevels[0].key : res.value.level);
        setAdSense(res.value.code);
        setTxtFile(res.value.txtFile);
        setLoading(false);
      });
  }, [host]);

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
        {intl.formatMessage({
          id: 'adsense_advertisements_text_part1',
          defaultMessage:
            'Google AdSense is a program that allows website owners to earn revenue by displaying targeted advertisements on their site. These ads are chosen based on the content of the site and the interests of the visitors, ensuring relevance to your audience.',
        })}
      </p>
      <p>
        {intl.formatMessage({
          id: 'adsense_advertisements_text_part2',
          defaultMessage:
            'When integrating the AdSense code into your website, you can choose the level of ad intensity, allowing you to control how prominently the ads are displayed. Simply add the code from Google AdSense and select the desired intensity level on our platform.',
        })}
      </p>
      <h3>
        {intl.formatMessage({
          id: 'adsense_advertisements_code',
          defaultMessage: 'AdSense code',
        })}
        :
      </h3>
      <Input.TextArea
        value={adSense}
        onChange={e => handleChangeAdSense(e)}
        placeholder={intl.formatMessage({
          id: 'adsense_advertisements_add_yours',
          defaultMessage: 'Add your AdSense code',
        })}
        autoSize={{ minRows: 2 }}
      />
      {showError && (
        <div className="AdSenseAds__error">
          {' '}
          {intl.formatMessage({
            id: 'adsense_advertisements_invalid_code',
            defaultMessage: 'Invalid AdSense code entered. Please provide a valid script.',
          })}
        </div>
      )}
      <p>
        {intl.formatMessage({
          id: 'adsense_advertisements_adsense_code_note',
          defaultMessage:
            'This code will be displayed within the &lt;head&gt;&lt;/head&gt; tags on every page of your site.',
        })}
      </p>
      <h3>Ads.txt:</h3>
      <Input.TextArea
        value={txtFile}
        onChange={e => handleChangeAdSenseText(e)}
        placeholder={intl.formatMessage({
          id: 'adsense_advertisements_add_txt',
          defaultMessage: 'Add your AdSense .txt text',
        })}
        autoSize={{ minRows: 2 }}
      />
      {showTextError && (
        <div className="AdSenseAds__error">
          {' '}
          {intl.formatMessage({
            id: 'adsense_advertisements_invalid_txt',
            defaultMessage: 'Invalid AdSense text entered. Please provide a valid text.',
          })}
        </div>
      )}
      <p>
        {intl.formatMessage({
          id: 'adsense_advertisements_txt_note',
          defaultMessage: 'This text will be added to ads.txt to your site.',
        })}
      </p>
      <h3>
        {intl.formatMessage({
          id: 'level',
          defaultMessage: 'Level',
        })}
        :
      </h3>
      <Select
        defaultValue={adIntensityLevels?.find(l => l.key === level)?.value}
        onSelect={l => setLevel(l)}
      >
        {adIntensityLevels.map(o => (
          <Select.Option key={o.key}>{o.value}</Select.Option>
        ))}
      </Select>
      <p>
        {intl.formatMessage({
          id: 'adsense_advertisements_level_note',
          defaultMessage:
            'Choose the advertising intensity to balance user experience with revenue generation',
        })}
        .
      </p>
      <h3>
        {intl.formatMessage({
          id: 'display_ad_unit_code',
          defaultMessage: 'Display ad unit code',
        })}
        :
      </h3>
      <Input.TextArea
        value={displayUnitCode}
        onChange={e => handleChangeDisplayUnitCode(e)}
        placeholder={intl.formatMessage({
          id: 'display_unit_code_add_yours',
          defaultMessage: 'Paste your display ad unit code here',
        })}
        autoSize={{ minRows: 2 }}
      />
      {showDisplayUnitCodeError && (
        <div className="AdSenseAds__error">
          {' '}
          {intl.formatMessage({
            id: 'ad_unit_invalid_code',
            defaultMessage: 'Invalid display ad unit code entered. Please provide a valid script.',
          })}
        </div>
      )}
      <Button
        disabled={disabled}
        type="primary"
        htmlType="submit"
        loading={buttonLoading}
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
