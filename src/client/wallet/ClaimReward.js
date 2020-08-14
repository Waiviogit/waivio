import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedRelative, FormattedNumber } from 'react-intl';
import formatter from '../helpers/steemitFormatter';
import BTooltip from '../components/BTooltip';
import { epochToUTC } from '../helpers/formatter';

const getFormattedPayout = (
  rewardSteem,
  rewardSbd,
  rewardVests,
  totalVestingShares,
  totalVestingFundSteem,
) => {
  const payouts = [];
  const parsedRewardSteem = parseFloat(rewardSteem);
  const parsedRewardSbd = parseFloat(rewardSbd);
  const parsedRewardVests = parseFloat(
    formatter.vestToSteem(rewardVests, totalVestingShares, totalVestingFundSteem),
  );

  if (parsedRewardSteem > 0) {
    payouts.push(
      <span key="HIVE" className="UserWalletTransactions__payout-rewards">
        <FormattedNumber
          value={parsedRewardSteem}
          minimumFractionDigits={3}
          maximumFractionDigits={3}
        />
        {' HIVE'}
      </span>,
    );
  }

  if (parsedRewardSbd > 0) {
    payouts.push(
      <span key="HBD" className="UserWalletTransactions__payout-rewards">
        <FormattedNumber
          value={parsedRewardSbd}
          minimumFractionDigits={3}
          maximumFractionDigits={3}
        />
        {' HBD'}
      </span>,
    );
  }

  if (parsedRewardVests > 0) {
    payouts.push(
      <span key="HP" className="UserWalletTransactions__payout-rewards">
        <FormattedNumber
          value={parsedRewardVests}
          minimumFractionDigits={3}
          maximumFractionDigits={3}
        />
        {' HP'}
      </span>,
    );
  }

  return payouts;
};

const ClaimReward = ({
  timestamp,
  rewardSteem,
  rewardSbd,
  rewardVests,
  totalVestingShares,
  totalVestingFundSteem,
}) => (
  <div className="UserWalletTransactions__transaction">
    <div className="UserWalletTransactions__icon-container">
      <i className="iconfont icon-success_fill UserWalletTransactions__icon" />
    </div>
    <div className="UserWalletTransactions__content">
      <div className="UserWalletTransactions__content-recipient">
        <div>
          <FormattedMessage id="claim_rewards" defaultMessage="Claim rewards" />
        </div>
        <div className="UserWalletTransactions__payout">
          {getFormattedPayout(
            rewardSteem,
            rewardSbd,
            rewardVests,
            totalVestingShares,
            totalVestingFundSteem,
          )}
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

ClaimReward.propTypes = {
  timestamp: PropTypes.number.isRequired,
  rewardSteem: PropTypes.string.isRequired,
  rewardSbd: PropTypes.string.isRequired,
  rewardVests: PropTypes.string.isRequired,
  totalVestingShares: PropTypes.string.isRequired,
  totalVestingFundSteem: PropTypes.string.isRequired,
};

export default ClaimReward;
