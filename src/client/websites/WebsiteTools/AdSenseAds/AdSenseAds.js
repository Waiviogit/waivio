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

const AdSenseAds = ({ intl, saveAdSense, match, getAdSettings }) => {
  const adIntensityLevels = [
    { value: '1 - Minimal', key: 'minimal' },
    { value: '2 - Moderate', key: 'moderate' },
    { value: '3 - Intensive', key: 'intensive' },
  ];
  const [level, setLevel] = useState('');
  const [adSense, setAdSense] = useState('');
  const host = match.params.site;
  const handleChangeAdSense = e => {
    setAdSense(e.target.value);
  };

  const handleSaveAdSenseSettings = () => {
    saveAdSense(host, adSense, level);
    message.success(intl.formatMessage({ id: 'adSense_advertisements_updated_successfully' }));
  };

  useEffect(() => {
    host &&
      getAdSettings(host).then(res => {
        setLevel(isEmpty(res.value.level) ? adIntensityLevels[0].key : res.value.level);
        setAdSense(res.value.code);
      });
  }, [host]);

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
      <p>
        This code will be displayed within the &lt;head&gt;&lt;/head&gt; tags on every page of your
        site.
      </p>
      <h3>Level:</h3>
      <Select defaultValue={adIntensityLevels[0].value} onSelect={l => setLevel(l)}>
        {adIntensityLevels.map(o => (
          <Select.Option key={o.key}>{o.value}</Select.Option>
        ))}
      </Select>
      <p>Choose the advertising intensity to balance user experience with revenue generation.</p>
      <Button
        type="primary"
        htmlType="submit"
        disabled={isEmpty(adSense)}
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
