import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import { injectIntl, FormattedMessage } from 'react-intl';
import { get, isEmpty } from 'lodash';
import USDDisplay from '../../Utils/USDDisplay';
import { calculatePayout, isPostCashout } from '../../../vendor/steemitHelpers';
import PayoutCurrencyBlock from '../PayoutCurrencyBlock/PayoutCurrencyBlock';
import { getTokenRatesInUSD } from '../../../../store/walletStore/walletSelectors';

import './PayoutDetail.less';

const AmountWithLabel = ({ id, defaultMessage, nonzero, amount }) => {
  if (nonzero && amount === 0) return null;

  return (
    <div>
      <FormattedMessage id={id} defaultMessage={defaultMessage} />{' '}
      <USDDisplay value={amount} currencyDisplay="symbol" />
    </div>
  );
};

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

const getBeneficaries = post => {
  const beneficiaries = get(post, 'beneficiaries', []);

  if (isEmpty(beneficiaries)) return [{ account: post.author, percent: 100 }];

  const postBeneficiaries = get(post, 'beneficiaries', []).map(item => {
    if (!item) return null;

    return {
      ...item,
      percent: item.weight * 0.01,
    };
  });

  const beneficiariesPercent = postBeneficiaries.reduce((acc, curr) => acc + curr.percent, 0);

  return [{ account: post.author, percent: 100 - beneficiariesPercent }, ...postBeneficiaries];
};

const PayoutDetail = React.memo(({ intl, post, isModal }) => {
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
  const payout = isPostCashout(post) ? pastPayouts : potentialPayout;
  const authorPayout = payout / 2;
  const beneficaries = getBeneficaries(post, authorPayout, isModal);
  const beneficariesClassList = classNames('PayoutDetail__benefisItem', {
    'PayoutDetail__benefisItem--modal': isModal,
  });
  const labelClassList = classNames({
    'PayoutDetail__title--modal': isModal,
  });

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
          {!isModal && (
            <FormattedMessage
              id="payout_total_past_payout_amount"
              defaultMessage="Total Past Payouts:"
            />
          )}{' '}
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
          {!isModal && (
            <FormattedMessage
              id="payout_potential_payout_amount"
              defaultMessage="Potential Payout:"
            />
          )}{' '}
          <PayoutCurrencyBlock
            HBDPayout={HBDPayout}
            WAIVPayout={WAIVPayout}
            HIVEPayout={HIVEPayout}
            totalPayout={potentialPayout}
          />
          <div>
            {Boolean(beneficaries) && (
              <div>
                <span className={labelClassList}>
                  {intl.formatMessage({ id: isModal ? 'Authors' : 'beneficiaries' })}:
                </span>
                <div className="PayoutDetail__beneficiaries">
                  {beneficaries.map(user => {
                    const amount = (authorPayout * user.percent) / 100;

                    return (
                      <div className={beneficariesClassList} key={user.account}>
                        <p>
                          <Link to={`/@${user.account}`}>{user.account}</Link>{' '}
                          <span style={{ opacity: '0.5' }}>{user.percent}%</span>
                        </p>
                        {isModal && <USDDisplay value={amount} currencyDisplay="symbol" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {isModal && (
              <div className="PayoutDetail__row">
                <b>
                  <FormattedMessage id="curators" />:
                </b>{' '}
                <USDDisplay value={payout / 2} currencyDisplay="symbol" />
              </div>
            )}
            <span className="PayoutDetail__time">
              <FormattedMessage
                id="payout_will_release_in_time"
                defaultMessage="Will release {time}"
                values={{ time: intl.formatRelative(post.cashout_time) }}
              />
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

PayoutDetail.propTypes = {
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape().isRequired,
  isModal: PropTypes.bool,
};

PayoutDetail.defaultProps = {
  isModal: false,
};

export default injectIntl(PayoutDetail);
