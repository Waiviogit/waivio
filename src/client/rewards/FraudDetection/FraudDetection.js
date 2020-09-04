import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './FraudDetection.less';

const FraudDetection = ({ intl }) => (
  <div className="FraudDetection">
    <div className="FraudDetection__title">
      {intl.formatMessage({
        id: 'fraud_detection_assistant',
        defaultMessage: 'Fraud detection assistant',
      })}
    </div>
    <div className="FraudDetection__disclaimer">
      <span>
        {intl.formatMessage({
          id: 'disclaimer',
          defaultMessage: 'Disclaimer',
        })}
      </span>
      :{' '}
      {intl.formatMessage({
        id: 'fraud_detection_disclaimer',
        defaultMessage:
          'It is an experimental service with a limited scope and is provided "as is" with no guarantee of applicability for the detection of probable fraud attempts. All submissions must always be manually verified and confirmed by the campaign sponsor.',
      })}
    </div>
  </div>
);

FraudDetection.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(FraudDetection);
