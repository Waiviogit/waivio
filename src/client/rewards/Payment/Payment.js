import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PaymentTable from './PaymentTable/PaymentTable';
import { getLenders } from '../../../waivioApi/ApiClient';
import Action from '../../components/Button/Action';
import { openTransfer } from '../../wallet/walletActions';
import { openLinkHiveAccountModal } from '../../settings/settingsActions';
import {
  BXY_GUEST_PREFIX,
  GUEST_PREFIX,
  WAIVIO_PARENT_PERMLINK,
} from '../../../common/constants/waivio';
import { getHiveBeneficiaryAccount, isGuestUser } from '../../reducers';
import { HIVE } from '../../../common/constants/cryptos';
import { getMemo } from '../rewardsHelper';
import './Payment.less';

// eslint-disable-next-line no-shadow
const Payment = ({
  match,
  intl,
  userName,
  isGuest,
  hiveBeneficiaryAccount,
  openLinkModal,
  openTransf,
}) => {
  const [sponsors, setSponsors] = useState({});
  const [payable, setPayable] = useState({});

  const requestParams = {
    sponsor: match.path === '/rewards/payables/@:userName' ? userName : match.params.userName,
    user: match.path === '/rewards/payables/@:userName' ? match.params.userName : userName,
  };

  const isReceiverGuest =
    match.params.userName.startsWith(GUEST_PREFIX) ||
    match.params.userName.startsWith(BXY_GUEST_PREFIX);

  const memo = getMemo(isReceiverGuest);
  const app = WAIVIO_PARENT_PERMLINK;
  const currency = HIVE.symbol;

  useEffect(() => {
    getLenders(requestParams)
      .then(data => {
        setSponsors(data.histories);
        setPayable(data.payable);
      })
      .catch(e => console.log(e));
  }, []);

  let titleName;
  let isPayables;
  if (match.path === '/rewards/payables/@:userName') {
    titleName = intl.formatMessage({
      id: 'payment_page_payables',
      defaultMessage: 'Payables',
    });
    isPayables = true;
  } else {
    titleName = intl.formatMessage({
      id: 'payment_page_receivables',
      defaultMessage: 'Receivables',
    });
    isPayables = false;
  }

  const name = match.params.userName;
  const userReward = `"id":"user_reward"`;
  const payableForRender = Math.abs(payable);
  const handleClick = () => {
    if (!hiveBeneficiaryAccount && isGuest) {
      openLinkModal(true);
    }
    openTransf(name, payableForRender, currency, memo, app);
  };

  return (
    <div className="Payment">
      <div className="Payment__title">
        <div className="Payment__title-payment">
          {titleName}:
          <Link className="Payment__title-link" to={`/@${userName}`}>{` ${userName} `}</Link>
          {isPayables ? <span>&rarr;</span> : <span>&larr;</span>}
          <Link className="Payment__title-link" to={`/@${name}`}>{` ${name} `}</Link>
        </div>
        <div className="Payment__title-pay">
          {(isPayables && payable > 0) || (!isPayables && payable < 0) ? (
            <Action className="WalletSidebar__transfer" primary onClick={handleClick}>
              {intl.formatMessage({
                id: 'pay',
                defaultMessage: 'Pay',
              })}
              {` ${
                isPayables
                  ? payable && payable.toFixed(3)
                  : payableForRender && payableForRender.toFixed(3)
              } HIVE`}
            </Action>
          ) : (
            ''
          )}
        </div>
      </div>
      <div className="Payment__information-row">
        <div className="Payment__information-row-important">
          {intl.formatMessage({
            id: 'payment_page_important',
            defaultMessage: 'Important',
          })}
          :
        </div>
        {intl.formatMessage(
          {
            id: 'payment_page_transfers_with_user_reward_included',
            defaultMessage:
              'Only transfer with {userRewards} instructions are processed as rewards payments',
          },
          {
            userReward,
          },
        )}
      </div>
      {!isEmpty(sponsors) && <PaymentTable sponsors={sponsors} isHive />}
    </div>
  );
};

Payment.propTypes = {
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  isGuest: PropTypes.bool,
  hiveBeneficiaryAccount: PropTypes.string,
  openLinkModal: PropTypes.func,
  openTransf: PropTypes.func,
};

Payment.defaultProps = {
  isGuest: false,
  hiveBeneficiaryAccount: '',
  openLinkModal: () => {},
  openTransf: () => {},
};

export default connect(
  state => ({
    isGuest: isGuestUser(state),
    hiveBeneficiaryAccount: getHiveBeneficiaryAccount(state),
  }),
  {
    openLinkModal: openLinkHiveAccountModal,
    openTransf: openTransfer,
  },
)(injectIntl(Payment));
