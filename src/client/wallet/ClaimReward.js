import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedRelative } from 'react-intl';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';
import { getFormattedClaimRewardPayout, getTransactionDescription } from './WalletHelper';

const ClaimReward = ({
  timestamp,
  rewardSteem,
  rewardSbd,
  rewardVests,
  totalVestingShares,
  totalVestingFundSteem,
  transactionType,
}) => {
  const formattedClaimReward = getFormattedClaimRewardPayout(
    rewardSteem,
    rewardSbd,
    rewardVests,
    totalVestingShares,
    totalVestingFundSteem,
    'UserWalletTransactions__payout-rewards',
  );
  const description = getTransactionDescription(transactionType);
  return (
    <div className="UserWalletTransactions__transaction">
      <div className="UserWalletTransactions__icon-container">
        <i className="iconfont icon-success_fill UserWalletTransactions__icon" />
      </div>
      <div className="UserWalletTransactions__content">
        <div className="UserWalletTransactions__content-recipient">
          <div>{description.claimRewards}</div>
          <div className="UserWalletTransactions__payout">
            {get(formattedClaimReward, 'payouts')}
          </div>
        </div>
        <span className="UserWalletTransactions__timestamp">
          <BTooltip
            title={
              <span>
                <FormattedRelative value={epochToUTC(timestamp)} />
              </span>
            }
          >
            <span>
              <FormattedRelative value={epochToUTC(timestamp)} />
            </span>
          </BTooltip>
        </span>
      </div>
    </div>
  );
};

ClaimReward.propTypes = {
  timestamp: PropTypes.number.isRequired,
  rewardSteem: PropTypes.string.isRequired,
  rewardSbd: PropTypes.string.isRequired,
  rewardVests: PropTypes.string.isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
  transactionType: PropTypes.string.isRequired,
};

export default ClaimReward;
