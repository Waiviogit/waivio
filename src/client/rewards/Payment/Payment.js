import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import { connect } from 'react-redux';
import PaymentTable from './PaymentTable/PaymentTable';
import { getLenders } from '../../../waivioApi/ApiClient';
import Action from '../../components/Button/Action';
import { openTransfer } from '../../wallet/walletActions';
import './Payment.less';

// eslint-disable-next-line no-shadow
const Payment = ({ match, intl, userName, openTransfer }) => {
  const [sponsors, setSponsors] = useState({});
  const [payable, setPayable] = useState({});

  const requestParams = {
    sponsor: match.path === '/rewards/payables/@:userName' ? userName : match.params.userName,
    user: match.path === '/rewards/payables/@:userName' ? match.params.userName : userName,
  };

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

  return (
    <div className="Payment">
      <div className="Payment__title">
        <div className="Payment__title-payment">
          {titleName}
          {`: ${userName} `}
          {isPayables ? <span>&rarr;</span> : <span>&larr;</span>}
          {` ${name} `}
        </div>
        <div className="Payment__title-pay">
          {isPayables && (
            <Action
              className="WalletSidebar__transfer"
              primary
              onClick={() => openTransfer(name, payable, 'SBD')}
            >
              {intl.formatMessage({
                id: 'pay',
                defaultMessage: 'Pay',
              })}
              {` ${payable} SBD`}
            </Action>
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
        {intl.formatMessage({
          id: 'payment_page_transfers_with_hashtag_included',
          defaultMessage: 'Only transfer with hashtag "#waivio" are included',
        })}
      </div>
      {!_.isEmpty(sponsors) ? <PaymentTable sponsors={sponsors} /> : null}
    </div>
  );
};

Payment.propTypes = {
  intl: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  openTransfer: PropTypes.func.isRequired,
};

export default injectIntl(
  connect(
    null,
    { openTransfer },
  )(Payment),
);
