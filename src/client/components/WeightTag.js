import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, Tag } from 'antd';
import { isNil, isNaN } from 'lodash';
import { useSelector } from 'react-redux';
import { getRate, getRewardFund } from '../reducers';
import WeightDisplay from './Utils/WeightDisplay';

const WeightTag = ({ intl, weight }) => {
  // redux-store
  const rate = useSelector(getRate);
  const rewardFund = useSelector(getRewardFund);
  const isValidWeight = !isNil(weight) && !isNaN(weight);
  const isFullParams = rewardFund && rewardFund.recent_claims && rewardFund.reward_balance && rate;
  const tagTitle = intl.formatMessage({
    id: 'total_ralated_payout',
    defaultMessage:
      'Total payout for all related posts in USD, without bidbots and upvote services',
  });
  if (isFullParams && isValidWeight) {
    const value =
      (weight / rewardFund.recent_claims) *
      rewardFund.reward_balance.replace(' HIVE', '') *
      rate *
      1000000;
    return (
      <span className="Weight" title={tagTitle}>
        {isNaN(value) ? (
          <Icon type="loading" className="text-icon-right" />
        ) : (
          <Tag>
            <WeightDisplay value={value} />
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
};

WeightTag.defaultProps = {
  weight: 0,
};

export default injectIntl(WeightTag);
