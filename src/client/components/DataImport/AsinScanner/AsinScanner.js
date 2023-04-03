import React from 'react';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';

import './AsinScanner.less';

const AsinScanner = ({ intl }) => (
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
        {intl.formatMessage({ id: 'enter_url', defaultMessage: 'Enter URL' })}
      </h4>
      <Input className="AsinScanner__input" placeholder={'URL'} />
      <Button type="primary">Scans for ASINs</Button>
    </div>
    <div className="AsinScanner__datafinitiBlock">
      <h4>Datafiniti product search request (API tab)</h4>
      asins:0241973031 OR asins:0385494785 OR asins:0385486804 OR asins:1529066336 OR
      asins:0316505110 OR asins:1542030137 OR asins:0007466099 OR asins:006237026X OR
      asins:1774641690 OR asins:0860685411 OR asins:9082103133 OR asins:061834697X OR
      asins:1406775061 OR asins:0060730552 OR asins:1509837051 OR asins:0786170298 OR
      asins:154204295X OR asins:1250312345 OR asins:0007442629
    </div>
  </div>
);

AsinScanner.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }),
};

export default injectIntl(AsinScanner);
