import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Tag } from 'antd';
import BTooltip from './BTooltip';

const WeightTag = ({ intl, weight, rank }) => (
  <BTooltip
    title={intl.formatMessage(
      { id: 'weight_score_value', defaultMessage: 'Weight score: {value}' },
      { value: weight.toFixed() },
    )}
  >
    {rank && <Tag>{rank}</Tag>}
  </BTooltip>
);

WeightTag.propTypes = {
  intl: PropTypes.shape().isRequired,
  weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  rank: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

WeightTag.defaultProps = {
  weight: 0,
  rank: '',
};

export default injectIntl(WeightTag);
