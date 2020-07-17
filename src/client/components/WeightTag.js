import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, Tag } from 'antd';
import { isNil, isNaN } from 'lodash';
import { connect } from 'react-redux';
import { getRate, getRewardFund, getWeightValue } from '../reducers';
import WeightDisplay from './Utils/WeightDisplay';

const WeightTag = ({ intl, weight, rewardFund, rate, weightValue }) => {
  const isValidWeight = !isNil(weight) && !isNaN(weight);
  const isFullParams = rewardFund && rewardFund.recent_claims && rewardFund.reward_balance && rate;
  const tagTitle = intl.formatMessage({
    id: 'total_ralated_payout',
    defaultMessage:
      'Total payout for all related posts in USD, without bidbots and upvote services',
  });
  if (isFullParams && isValidWeight && weightValue) {
    const expertize = weightValue > 0 ? weightValue : 0;
    return (
      <span className="Weight" title={tagTitle}>
        {isNaN(weightValue) ? (
          <Icon type="loading" className="text-icon-right" />
        ) : (
          <Tag>
            <WeightDisplay value={expertize} />
          </Tag>
        )}
      </span>
    );
  }
  return null;
};

WeightTag.propTypes = {
  intl: PropTypes.shape().isRequired,
  weight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  rewardFund: PropTypes.shape().isRequired,
  rate: PropTypes.number,
  weightValue: PropTypes.number,
};

WeightTag.defaultProps = {
  weight: 0,
  rate: 0,
  weightValue: 0,
};

export default connect((state, ownProp) => ({
  weightValue: getWeightValue(state, ownProp.weight),
  rate: getRate(state),
  rewardFund: getRewardFund(state),
}))(injectIntl(WeightTag));
