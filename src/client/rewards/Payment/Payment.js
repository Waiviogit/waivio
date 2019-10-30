import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import PaymentTable from './PaymentTable/PaymentTable';
import { getLenders } from '../../../waivioApi/ApiClient';
import './Payment.less';

const Payment = ({ match, intl, userName }) => {
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

  const titleName =
    match.path === '/rewards/payables/@:userName'
      ? intl.formatMessage({
          id: 'payment_page_payables',
          defaultMessage: 'Payables',
        })
      : intl.formatMessage({
          id: 'payment_page_receivables',
          defaultMessage: 'Receivables',
        });

  return (
    <div className="Payment">
      <div className="Payment__title">
        <div className="Payment__title-payment">
          {titleName}
          {` > @${userName} (${payable} SBD)`}
        </div>
        <div className="Payment__title-pay">
          <Link to={'/rewards/pay-now'}>
            {intl.formatMessage({
              id: 'payment_page_pay_now',
              defaultMessage: 'Pay now',
            })}
            (mock)
          </Link>
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
};

export default injectIntl(Payment);
