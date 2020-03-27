import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import TradeButton from '../TradeButton';
import './PostQuotation.less';

const propTypes = {
  /* connect */
  quote: PropTypes.string.isRequired,
  quoteSettings: PropTypes.string.isRequired,
  platformName: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  toggleModal: PropTypes.func.isRequired,

  /* passed props */
  className: PropTypes.string,
  caller: PropTypes.string.isRequired,
  // quoteSecurity: PropTypes.string.isRequired, // used in connect to get quote
};

const PostQuotation = ({
  className,
  quote,
  quoteSettings,
  platformName,
  isAuthenticated,
  toggleModal,
  caller,
}) => {
  const handleButtonClick = useCallback(() => {
    if (platformName === 'widgets') {
      toggleModal('broker');
    } else {
      toggleModal('openDeals', { quote, quoteSettings, platform: platformName, caller });
    }
  }, [platformName, quoteSettings]);
  return isAuthenticated && quoteSettings ? (
    <div className={`st-post-quotation-wrap ${className}`}>
      {platformName !== 'widgets' ? (
        <React.Fragment>
          <TradeButton type="buy" onClick={handleButtonClick} />
          <TradeButton type="sell" onClick={handleButtonClick} />
        </React.Fragment>
      ) : (
        <TradeButton type="broker" onClick={handleButtonClick}>
          <FormattedMessage
            id="headerAuthorized.connectToBeaxy"
            defaultMessage="Connect to beaxy"
          />
        </TradeButton>
      )}
    </div>
  ) : null;
};

PostQuotation.propTypes = propTypes;
PostQuotation.defaultProps = {
  className: '',
};

export default PostQuotation;
