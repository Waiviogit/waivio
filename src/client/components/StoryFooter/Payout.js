import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { useSelector } from 'react-redux';

import { calculatePayout, isPostCashout } from '../../vendor/steemitHelpers';
import BTooltip from '../BTooltip';
import USDDisplay from '../Utils/USDDisplay';
import PayoutDetail from '../PayoutDetail';
import { getTokenRatesInUSD } from '../../../store/walletStore/walletSelectors';

import './Payout.less';

const Payout = React.memo(({ intl, post }) => {
  const rates = useSelector(state => getTokenRatesInUSD(state, 'WAIV'));
  const payout = calculatePayout(post, rates);
  const currentPayout = isPostCashout(post) ? payout.pastPayouts : payout.potentialPayout;

  return (
    <span className="Payout">
      <BTooltip title={<PayoutDetail post={post} />}>
        <span
          className={classNames({
            'Payout--rejected': payout.isPayoutDeclined,
          })}
        >
          <USDDisplay value={currentPayout} currencyDisplay="symbol" />
        </span>
      </BTooltip>
      {post.percent_hbd === 0 && (
        <BTooltip
          title={intl.formatMessage({
            id: 'reward_option_100',
            defaultMessage: '100% Hive Power',
          })}
        >
          <i className="iconfont icon-flashlight" />
        </BTooltip>
      )}
    </span>
  );
});

Payout.propTypes = {
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape({
    percent_hbd: PropTypes.number,
  }).isRequired,
};

export default injectIntl(Payout);
