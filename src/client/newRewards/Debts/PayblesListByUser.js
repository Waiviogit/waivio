import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty, isNumber, round } from 'lodash';
import classNames from 'classnames';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router';

import { getPaybelsListByUser } from '../../../waivioApi/ApiClient';
import Action from '../../components/Button/Action';
import { openTransfer } from '../../../store/walletStore/walletActions';
import { openLinkHiveAccountModal } from '../../../store/settingsStore/settingsActions';
import { WAIVIO_PARENT_PERMLINK } from '../../../common/constants/waivio';
import { WAIV } from '../../../common/constants/cryptos';
import Transfer from '../../wallet/Transfer/Transfer';
import { getAuthenticatedUserName, isGuestUser } from '../../../store/authStore/authSelectors';
import { getHiveBeneficiaryAccount } from '../../../store/settingsStore/settingsSelectors';

import PaymentTable from '../../rewards/Payment/PaymentTable/PaymentTable';
import { guestUserRegex } from '../../../common/helpers/regexHelpers';

const PayblesListByUser = ({
  intl,
  isGuest,
  hiveBeneficiaryAccount,
  openLinkModal,
  openTransf,
  history,
}) => {
  const [sponsors, setSponsors] = useState({});
  const [payable, setPayable] = useState({});
  const [notPayedPeriod, setNotPayedPeriod] = useState(0);
  const match = useRouteMatch();
  const authUserName = useSelector(getAuthenticatedUserName);
  const app = WAIVIO_PARENT_PERMLINK;
  const currency = WAIV.symbol;
  const notPayedPeriodClassList = classNames({
    Payment__notPayedPeriod: notPayedPeriod,
    'Payment__notPayedPeriod--hidden': !notPayedPeriod,
    'Payment__notPayedPeriod--expired': notPayedPeriod >= 21,
  });

  const getPayables = () => {
    getPaybelsListByUser(authUserName, match.params.userName)
      .then(data => {
        setSponsors(data.histories.map(hist => ({ ...hist, sponsor: authUserName })));
        setPayable(data.totalPayable);
        setNotPayedPeriod(data.notPayedPeriod);
      })
      .catch(e => console.error(e));
  };

  useEffect(() => {
    getPayables();
  }, []);

  const titleName = intl.formatMessage({
    id: 'payment_page_payable',
    defaultMessage: 'Payable',
  });

  const name = match.params.userName;
  const userReward = `"id":"campaignReward"`;
  const payableForRender = Math.abs(payable);
  const handleClick = () => {
    if (!hiveBeneficiaryAccount && isGuest) {
      openLinkModal(true);
    }
    const rewarsMemo = guestUserRegex.test(name)
      ? { id: 'guestCampaignReward' }
      : { id: 'campaignReward' };

    openTransf(name, payableForRender, currency, rewarsMemo, app);
  };

  return (
    <div className="Payment">
      <div className="Payment__title">
        <div className="Payment__title-payment">
          {titleName}:
          <Link
            className="Payment__title-link"
            to={`/@${authUserName}`}
          >{` ${authUserName} `}</Link>
          <span>&rarr;</span>
          <Link className="Payment__title-link" to={`/@${name}`}>{` ${name} `}</Link>
        </div>
        <div className="Payment__title-pay">
          {payable > 0 ? (
            <Action className="WalletSidebar__transfer" primary onClick={handleClick}>
              {intl.formatMessage({
                id: 'pay',
                defaultMessage: 'Pay',
              })}
              {` ${round(payable, 3)} WAIV`}
            </Action>
          ) : (
            ''
          )}
          {isNumber(notPayedPeriod) && (
            <span className={notPayedPeriodClassList}>
              (
              {intl.formatMessage({
                id: 'over',
                defaultMessage: 'over',
              })}{' '}
              {notPayedPeriod} d)
            </span>
          )}
        </div>
      </div>
      <p className="Payment__information-row">
        <span className="Payment__information-row-important">
          {intl.formatMessage({
            id: 'payment_page_important',
            defaultMessage: 'Important',
          })}
          :
        </span>
        {intl.formatMessage(
          {
            id: 'payment_page_transfers_with_user_reward_included',
            defaultMessage:
              'Only transfer with {userRewards} instructions are processed as rewards payments',
          },
          {
            userRewards: userReward,
          },
        )}
      </p>
      {!isEmpty(sponsors) && (
        <PaymentTable
          sponsors={sponsors}
          reservationPermlink={match.params.reservationPermlink}
          match={match}
          currency={'WAIV'}
        />
      )}
      <Transfer history={history} getPayables={getPayables} />
    </div>
  );
};

PayblesListByUser.propTypes = {
  intl: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  isGuest: PropTypes.bool,
  hiveBeneficiaryAccount: PropTypes.string,
  openLinkModal: PropTypes.func,
  openTransf: PropTypes.func,
};

PayblesListByUser.defaultProps = {
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
)(injectIntl(PayblesListByUser));
