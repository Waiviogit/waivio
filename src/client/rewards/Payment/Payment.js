import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import _ from 'lodash';
import PaymentTable from './PaymentTable/PaymentTable';
import { getLenders } from '../../../waivioApi/ApiClient';
import './Payment.less';

const Payment = ({ userName, paymentUser, intl }) => {
  const [sponsors, setSponsors] = useState({});
  const [payable, setPayable] = useState({});
  useEffect(() => {
    getLenders({
      sponsor: userName,
      user: paymentUser,
    })
      .then(data => {
        setSponsors(data.histories);
        setPayable(data.payable);
      })
      .catch(e => console.log(e));
  }, []);
  console.log('sponsor', sponsors);
  return (
    <div className="Payment">
      <div className="Payment__title">
        {intl.formatMessage({
          id: 'payables_page_payables',
          defaultMessage: 'Payables',
        })}
        {` > @${userName} (${payable} SBD)`}
      </div>
      {!_.isEmpty(sponsors) ? <PaymentTable sponsor={sponsors} /> : null}
    </div>
  );
};

Payment.propTypes = {
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  paymentUser: PropTypes.string.isRequired,
};

export default injectIntl(Payment);
