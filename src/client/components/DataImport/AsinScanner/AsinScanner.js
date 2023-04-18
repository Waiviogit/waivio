import React, { useCallback, useState } from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Input, message } from 'antd';
import { debounce } from 'lodash';
import { getAmazonAsins } from '../../../../waivioApi/importApi';
import EmptyCampaing from '../../../statics/EmptyCampaing';

import './AsinScanner.less';

const AsinScanner = ({ intl }) => {
  const [uri, setUri] = useState('');
  const [loading, setLoading] = useState(false);
  const [asin, setAsin] = useState(null);

  const getAmazonAsinsLinks = () => {
    setLoading(true);

    getAmazonAsins(uri)
      .then(r => {
        if (!r.result) message.error('Result is empty, try another url');
        setAsin(r.result);
        setLoading(false);
      })
      .catch(e => message.error(e.message));
  };

  const setUrlDebounce = useCallback(
    debounce(value => {
      setUri(value);
    }, 300),
    [],
  );

  const handleInputUrl = e => setUrlDebounce(e.currentTarget.value);

  return (
    <div className="AsinScanner">
      <h2>{intl.formatMessage({ id: 'ASIN_scanner', defaultMessage: 'ASIN scanner' })}</h2>
      <p className="AsinScanner__description">
        {intl.formatMessage({
          id: 'ASIN_scanner_description',
          defaultMessage:
            "The ASIN scanner tool can scan any Amazon URL and extract ASIN numbers of products from that webpage. It generates a search query for Datafiniti's product search API tab. Upon finding a match for these products in the Datafiniti database, users can download a JSON file that can be uploaded to Waivio for further processing using the Data Import tool.",
        })}
      </p>
      <div>
        <h4 className="AsinScanner__label">
          {intl.formatMessage({ id: 'enter_url', defaultMessage: 'Enter URL' })}:
        </h4>
        <Input
          disabled={loading}
          onChange={handleInputUrl}
          className="AsinScanner__input"
          placeholder={'URL'}
        />
        <Button loading={loading} onClick={getAmazonAsinsLinks} type="primary">
          Scan for ASINs
        </Button>
      </div>
      {asin && (
        <div className="AsinScanner__datafinitiBlock">
          <h4>Datafiniti product search request (API tab)</h4>
          {asin}
        </div>
      )}
      {typeof asin === 'string' && !asin && (
        <EmptyCampaing emptyMessage={'There are no ASIN numbers on the webpage'} />
      )}
    </div>
  );
};

AsinScanner.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

export default injectIntl(AsinScanner);
