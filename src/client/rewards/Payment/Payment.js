import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty, includes, get } from 'lodash';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PaymentTable from './PaymentTable/PaymentTable';
import { getLenders } from '../../../waivioApi/ApiClient';
import Action from '../../components/Button/Action';
import { openTransfer } from '../../wallet/walletActions';
import { openLinkHiveAccountModal } from '../../settings/settingsActions';
import { WAIVIO_PARENT_PERMLINK } from '../../../common/constants/waivio';
import { getHiveBeneficiaryAccount, isGuestUser } from '../../reducers';
import { HIVE } from '../../../common/constants/cryptos';
import { getMemo } from '../rewardsHelper';
import { guestUserRegex } from '../../helpers/regexHelpers';
import Transfer from '../../wallet/Transfer/Transfer';
import './Payment.less';

const Payment = ({
  match,
  intl,
  userName,
  isGuest,
  hiveBeneficiaryAccount,
  openLinkModal,
  openTransf,
  history,
}) => {
  const [sponsors, setSponsors] = useState({});
  const [payable, setPayable] = useState({});
  const [notPayedPeriod, setNotPayedPeriod] = useState(0);
  const { reservationPermlink } = match.params;
  const payables = get(match, ['params', '0']) === 'payables';
  const getRequestParams = () => ({
    sponsor: reservationPermlink || payables ? userName : match.params.userName,
    user: reservationPermlink || payables ? match.params.userName : userName,
  });

  const isReceiverGuest = guestUserRegex.test(match.params.userName);
  const pathRecivables = includes(match.path, 'receivables');
  const isOverpayment = payable < 0;

  const memo = getMemo(isReceiverGuest, pathRecivables, isOverpayment);
  const app = WAIVIO_PARENT_PERMLINK;
  const currency = HIVE.symbol;
  const notPayedPeriodClassList = classNames('Payment__notPayedPeriod', {
    'Payment__notPayedPeriod--expired': notPayedPeriod >= 21,
  });

  const getPayables = () => {
    getLenders(getRequestParams())
      .then(data => {
        setSponsors(data.histories);
        setPayable(data.payable);
        setNotPayedPeriod(data.notPayedPeriod);
      })
      .catch(e => console.log(e));
  };

  useEffect(() => {
    getPayables();
  }, []);

  let titleName;
  let isPayables;
  if (get(match, ['params', '0']) === 'payables') {
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
        {notPayedPeriod && (
          <span className={notPayedPeriodClassList}>
            (
            {intl.formatMessage({
              id: 'over',
              defaultMessage: 'over',
            })}{' '}
            {notPayedPeriod})
          </span>
        )}
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
      {!isEmpty(sponsors) && (
        <PaymentTable
          sponsors={sponsors}
          isHive
          reservationPermlink={match.params.reservationPermlink}
          match={match}
        />
      )}
      <Transfer history={history} getPayables={getPayables} />
    </div>
  );
};

Payment.propTypes = {
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
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
