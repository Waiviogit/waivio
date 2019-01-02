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
    {weight && <Tag>{Number(weight).toFixed(0)}</Tag>}
  </BTooltip>
);

WeightTag.propTypes = {
  intl: PropTypes.shape().isRequired,
  weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

WeightTag.defaultProps = {
  weight: '',
};

export default injectIntl(WeightTag);
