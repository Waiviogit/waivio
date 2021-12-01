import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import { Modal } from 'antd';

import { calculatePayout, isPostCashout } from '../../vendor/steemitHelpers';
import BTooltip from '../BTooltip';
import USDDisplay from '../Utils/USDDisplay';
import PayoutDetail from '../PayoutDetail';
import { getTokenRatesInUSD } from '../../../store/walletStore/walletSelectors';

import './Payout.less';

const Payout = React.memo(({ intl, post }) => {
  const [visible, setVisible] = useState(false);
  const rates = useSelector(state => getTokenRatesInUSD(state, 'WAIV'));
  const payout = calculatePayout(post, rates);
  const currentPayout = isPostCashout(post) ? payout.pastPayouts : payout.potentialPayout;
  const toggleModal = () => setVisible(show => !show);
  const modalTitle = isPostCashout(post) ? (
    <FormattedMessage id="payout_total_past_payout_amount" defaultMessage="Total Past Payouts:" />
  ) : (
    <FormattedMessage id="payout_potential_payout_amount" defaultMessage="Potential Payout:" />
  );

  return (
    <React.Fragment>
      <span className="Payout" onClick={toggleModal}>
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
      {visible && (
        <Modal visible={visible} onCancel={toggleModal} title={modalTitle} footer={null}>
          <PayoutDetail post={post} withoutTitle />
        </Modal>
      )}
    </React.Fragment>
  );
});

Payout.propTypes = {
  intl: PropTypes.shape().isRequired,
  post: PropTypes.shape({
    percent_hbd: PropTypes.number,
  }).isRequired,
};

export default injectIntl(Payout);
