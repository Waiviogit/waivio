import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, Tag } from 'antd';
import { isNaN } from 'lodash';
import { connect } from 'react-redux';
import WeightDisplay from './Utils/WeightDisplay';
import { getRate, getRewardFund } from '../../store/appStore/appSelectors';

const WeightTag = ({ intl, weight, rewardFund, rate }) => {
  const isValidWeight = isNaN(weight);
  const isFullParams = rewardFund && rewardFund.recent_claims && rewardFund.reward_balance && rate;
  const tagTitle = intl.formatMessage({
    id: 'total_ralated_payout',
    defaultMessage:
      'Total payout for all related posts in USD, without bidbots and upvote services',
  });

  if (isFullParams) {
    const expertize = weight > 0 ? weight : 0;

    return (
      <span className="Weight" title={tagTitle}>
        {isValidWeight ? (
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
  weight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rewardFund: PropTypes.shape().isRequired,
  rate: PropTypes.number,
};

WeightTag.defaultProps = {
  weight: 0,
  rate: 0,
  weightValue: 0,
};

export default connect(state => ({
  rate: getRate(state),
  rewardFund: getRewardFund(state),
}))(injectIntl(WeightTag));
