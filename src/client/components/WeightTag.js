import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon, Tag } from 'antd';
import { connect } from 'react-redux';
import { getRate, getRewardFund } from '../reducers';
import WeightDisplay from './Utils/WeightDisplay';

@connect(state => ({
  rewardFund: getRewardFund(state),
  rate: getRate(state),
}))
class WeightTag extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    rate: PropTypes.number.isRequired,
    weight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  };

  static defaultProps = {
    weight: 0,
    rank: '',
  };

  render() {
    const { intl, weight, rewardFund, rate } = this.props;
    const isFullParams =
      weight && rewardFund && rewardFund.recent_claims && rewardFund.reward_balance && rate;
    if (isFullParams) {
      const value =
        (weight / rewardFund.recent_claims) *
        rewardFund.reward_balance.replace(' STEEM', '') *
        rate *
        1000000;
      return (
        <span
          className="Weight"
          title={intl.formatMessage({
            id: 'total_ralated_payout',
            defaultMessage:
              'Total payout for all related posts in USD, without bidbots and upvote services',
          })}
        >
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
  }
}

export default injectIntl(WeightTag);
