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

  useEffect(() => {
    getLenders({
      sponsor: userName,
      user: match.params.userName,
    })
      .then(data => {
        setSponsors(data.histories);
        setPayable(data.payable);
      })
      .catch(e => console.log(e));
  }, []);
  return (
    <div className="Payment">
      <div className="Payment__title">
        <div className="Payment__title-payment">
          {intl.formatMessage({
            id: 'payables_page_payables',
            defaultMessage: 'Payables',
          })}
          {` > @${userName} (${payable} SBD)`}
        </div>
        <div className="Payment__title-pay">
          <Link to={'/rewards/pay-now'}>
            {intl.formatMessage({
              id: 'payables_page_pay_now',
              defaultMessage: 'Pay now',
            })}
            (mock)
          </Link>
        </div>
      </div>
      <div className="Payment__information-row">
        <div className="Payment__information-row-important">
          {intl.formatMessage({
            id: 'payables_page_important',
            defaultMessage: 'Important',
          })}
          :
        </div>
        {intl.formatMessage({
          id: 'payables_page_transfers_with_hashtag_included',
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
