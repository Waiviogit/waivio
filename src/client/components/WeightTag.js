import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, Tag } from 'antd';
import { isNaN } from 'lodash';
import { connect } from 'react-redux';
import { getRate, getRewardFund, getWeightValue } from '../reducers';
import WeightDisplay from './Utils/WeightDisplay';

const WeightTag = ({ intl, weight, rewardFund, weightValue, rate }) => {
  const isFullParams = rewardFund && rewardFund.recent_claims && rewardFund.reward_balance && rate;
  if (isFullParams) {
    const expertize = weightValue > 0 ? weightValue : 0;
    return (
      <span
        className="Weight"
        title={intl.formatMessage({
          id: 'total_ralated_payout',
          defaultMessage:
            'Total payout for all related posts in USD, without bidbots and upvote services',
        })}
      >
        {isNaN(weight) ? (
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
  rate: PropTypes.number,
  weightValue: PropTypes.number,
  rewardFund: PropTypes.shape().isRequired,
};

WeightTag.defaultProps = {
  weight: 0,
  rate: 0,
  weightValue: 0,
};

const mapStateToProps = (state, ownProps) => ({
  weightValue: getWeightValue(state, ownProps.weight),
  rate: getRate(state),
  rewardFund: getRewardFund(state),
});

export default connect(mapStateToProps)(injectIntl(WeightTag));
