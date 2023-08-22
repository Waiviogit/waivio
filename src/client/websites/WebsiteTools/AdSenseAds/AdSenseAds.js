import React, { useState } from 'react';
import { isEmpty } from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Select, Input, Button } from 'antd';
import './AdSenseAds.less';

const AdSenseAds = ({ intl }) => {
  const adIntensityLevels = ['1 - Minimal', '2 - Moderate', '3 - Intensive'];
  const [level, setLevel] = useState(adIntensityLevels[0]);
  const [adSense, setAdSense] = useState('');

  const handleChangeAdSense = e => {
    setAdSense(e.target.value);
  };

  const handleSaveAdSenseSettings = () => {
    // eslint-disable-next-line no-console
    console.log(level, adSense);
  };

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
        onChange={e => handleChangeAdSense(e)}
        placeholder={'Add your AdSense code'}
        autoSize={{ minRows: 2 }}
      />
      <p>This code will be displayed within the tags on every page of your site.</p>
      <h3>Level:</h3>
      <Select defaultValue={adIntensityLevels[0]} onSelect={l => setLevel(l)}>
        {adIntensityLevels.map(o => (
          <Select.Option key={o}>{o}</Select.Option>
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
};

export default injectIntl(AdSenseAds);
