import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Tag } from 'antd';
import BTooltip from './BTooltip';

const WeightTag = ({ intl, weight }) => (
  <BTooltip
    title={intl.formatMessage(
      { id: 'rank_score_value', defaultMessage: 'Rank score: {value}' },
      { value: weight },
    )}
  >
    <Tag>{weight}</Tag>
  </BTooltip>
);

WeightTag.propTypes = {
  intl: PropTypes.shape().isRequired,
  weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default injectIntl(WeightTag);
