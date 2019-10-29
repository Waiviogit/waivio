import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, Tag } from 'antd';
import { roundNumberToThousands } from '../vendor/steemitHelpers';
import './profitabilityTag.less';

const ProfitabilityTag = ({ prof, intl }) => {
  const shortValue = prof.toFixed(2);
  const formattedValue = roundNumberToThousands(shortValue);
  return (
    <span
      className="Weight"
      title={intl.formatMessage({
        id: 'total_profitability',
        defaultMessage: 'User profitability in percents',
      })}
    >
      {isNaN(prof) ? (
        <Icon type="loading" className="text-icon-right" />
      ) : (
        <Tag>
          <span className={`ProfitabilityTag__value-${formattedValue >= 0 ? 'success' : 'danger'}`}>
            {formattedValue}
          </span>
        </Tag>
      )}
    </span>
  );
};

ProfitabilityTag.defaultProps = {
  prof: 0,
};

ProfitabilityTag.propTypes = {
  prof: PropTypes.number,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ProfitabilityTag);
