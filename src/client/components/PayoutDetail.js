import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { isNumber, get, isNil, isEmpty, map } from 'lodash';
import USDDisplay from './Utils/USDDisplay';
import { calculatePayout, isPostCashout } from '../vendor/steemitHelpers';
import PayoutCurrencyBlock from './PayoutComponents/PayoutCurrencyBlock';
import { getTokenRatesInUSD } from '../../store/walletStore/walletSelectors';

const AmountWithLabel = ({ id, defaultMessage, nonzero, amount }) =>
  isNumber(amount) &&
  (nonzero ? amount !== 0 : true) && (
    <div>
      <FormattedMessage id={id} defaultMessage={defaultMessage} />{' '}
      <USDDisplay value={amount} currencyDisplay="symbol" />
    </div>
  );

AmountWithLabel.propTypes = {
  id: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string.isRequired,
  nonzero: PropTypes.bool,
  amount: PropTypes.number,
};

AmountWithLabel.defaultProps = {
  nonzero: false,
  amount: 0,
};

const getBeneficiariesPercent = user => {
  const weight = parseFloat(get(user, 'weight', 0)) / 10000;

  // eslint-disable-next-line react/style-prop-object
  return <FormattedNumber value={isNil(weight) ? 0 : weight} style="percent" />;
};

const getBeneficaries = post => {
  const beneficiaries = get(post, 'beneficiaries', []);

  if (isEmpty(beneficiaries)) return null;

  return map(beneficiaries, user => (
    <p key={user.account}>
      <Link to={`/@${user.account}`}>{user.account}</Link>{' '}
      <span style={{ opacity: '0.5' }}>{getBeneficiariesPercent(user)}</span>
    </p>
  ));
};

const PayoutDetail = React.memo(({ intl, post }) => {
  const rates = useSelector(state => getTokenRatesInUSD(state, 'WAIV'));
  const {
    payoutLimitHit,
    potentialPayout,
    promotionCost,
    isPayoutDeclined,
    pastPayouts,
    authorPayouts,
    curatorPayouts,
    HBDPayout,
    WAIVPayout,
    HIVEPayout,
  } = calculatePayout(post, rates);
  const beneficaries = getBeneficaries(post);

  if (isPayoutDeclined) {
    return <FormattedMessage id="payout_declined" defaultMessage="Payout declined" />;
  }

  return (
    <div>
      {payoutLimitHit && (
        <FormattedMessage
          id="payout_limit_reached"
          defaultMessage="Payout limit reached on this post"
        />
      )}
      <AmountWithLabel
        nonzero
        id="payout_promoted_amount"
        defaultMessage="Promoted:"
        amount={promotionCost}
      />
      {isPostCashout(post) ? (
        <div>
          <FormattedMessage
            id="payout_total_past_payout_amount"
            defaultMessage="Total Past Payouts:"
          />{' '}
          <PayoutCurrencyBlock
            HBDPayout={HBDPayout}
            HIVEPayout={HIVEPayout}
            WAIVPayout={WAIVPayout}
            totalPayout={pastPayouts}
          />
          <AmountWithLabel
            id="payout_author_payout_amount"
            defaultMessage="Author Payout:"
            amount={authorPayouts}
          />
          <AmountWithLabel
            id="payout_curators_payout_amount"
            defaultMessage="Curators payout:"
            amount={curatorPayouts}
          />
        </div>
      ) : (
        <div>
          <FormattedMessage
            id="payout_potential_payout_amount"
            defaultMessage="Potential Payout:"
          />{' '}
          <PayoutCurrencyBlock
            HBDPayout={HBDPayout}
            WAIVPayout={WAIVPayout}
            HIVEPayout={HIVEPayout}
            totalPayout={potentialPayout}
          />
          <div>
            {beneficaries}
            <FormattedMessage
              id="payout_will_release_in_time"
              defaultMessage="Will release {time}"
              values={{ time: intl.formatRelative(post.cashout_time) }}
            />
          </div>
        </div>
      )}
    </div>
  );
});

PayoutDetail.propTypes = {
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape().isRequired,
};

export default injectIntl(PayoutDetail);
