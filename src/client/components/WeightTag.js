import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { getRate, getRewardFund } from '../reducers';
import USDDisplay from './Utils/USDDisplay';

@connect(state => ({
  rewardFund: getRewardFund(state),
  rate: getRate(state),
}))
class WeightTag extends React.Component {
  static propTypes = {
    intl: PropTypes.shape().isRequired,
    rewardFund: PropTypes.shape().isRequired,
    rate: PropTypes.number.isRequired,
    weight: PropTypes.number.isRequired,
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
        <div
          title={intl.formatMessage({
            id: 'total_ralated_payout',
            defaultMessage: 'Total payout for all related posts',
          })}
        >
          {isNaN(value) ? (
            <Icon type="loading" className="text-icon-right" />
          ) : (
            <USDDisplay value={value} />
          )}
        </div>
      );
    }
    return null;
  }
}

export default injectIntl(WeightTag);
