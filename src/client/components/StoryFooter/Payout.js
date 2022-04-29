import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';
import { get } from 'lodash';

import { calculatePayout, isPostCashout } from '../../vendor/steemitHelpers';
import BTooltip from '../BTooltip';
import USDDisplay from '../Utils/USDDisplay';
import PayoutDetail from '../PayoutComponents/PayoutDetail/PayoutDetail';
import { getTokenRatesInUSD } from '../../../store/walletStore/walletSelectors';
import { WAIVEligibleTags } from '../../../common/constants/waivio';
import { parseJSON } from '../../../common/helpers/parseJSON';

import './Payout.less';

const Payout = React.memo(({ intl, post }) => {
  const [visible, setVisible] = useState(false);
  const rates = useSelector(state => getTokenRatesInUSD(state, 'WAIV'));
  const payout = calculatePayout(post, rates);
  const currentPayout = isPostCashout(post) ? payout.pastPayouts : payout.potentialPayout;
  const postTags = get(parseJSON(post.json_metadata), 'tags', []);
  const waivEligible = Array.isArray(postTags)
    ? postTags.some(tag => WAIVEligibleTags.includes(tag))
    : WAIVEligibleTags.includes(postTags);
  const payoutClassList = classNames('Payout', {
    'Payout--waiv': waivEligible,
  });
  const toggleModal = () => setVisible(show => !show);
  const modalTitle = isPostCashout(post) ? (
    <FormattedMessage id="payout_total_past_payout_amount" defaultMessage="Total Past Payouts:" />
  ) : (
    <FormattedMessage id="payout_potential_payout_amount" defaultMessage="Potential Payout:" />
  );

  return (
    <React.Fragment>
      <span className={payoutClassList} onClick={toggleModal}>
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
        {waivEligible && (
          <BTooltip
            title={intl.formatMessage({
              id: 'eligible_for_waiv',
              defaultMessage: 'Eligible for WAIV rewards',
            })}
          >
            <img
              src={'/images/logo.png'}
              className="Payout__waiv-eligible"
              alt="Eligible for WAIV rewards"
            />
          </BTooltip>
        )}
      </span>
      {visible && (
        <Modal visible={visible} onCancel={toggleModal} title={modalTitle} footer={null}>
          <PayoutDetail post={post} isModal />
        </Modal>
      )}
    </React.Fragment>
  );
});

Payout.propTypes = {
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape({
    percent_hbd: PropTypes.number,
    json_metadata: PropTypes.string,
  }).isRequired,
};

export default injectIntl(Payout);
