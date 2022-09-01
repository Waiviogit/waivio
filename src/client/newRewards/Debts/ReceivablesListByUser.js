import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useRouteMatch } from 'react-router';

import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';

import PaymentTable from '../../rewards/Payment/PaymentTable/PaymentTable';
import { getPaybelsListByUser } from '../../../waivioApi/ApiClient';

const ReceivablesListByUser = ({ intl }) => {
  const [sponsors, setSponsors] = useState({});
  const match = useRouteMatch();
  const authUserName = useSelector(getAuthenticatedUserName);

  const getPayables = () => {
    getPaybelsListByUser(match.params.userName, authUserName)
      .then(data => {
        setSponsors(data.histories);
      })
      .catch(e => console.error(e));
  };

  useEffect(() => {
    getPayables();
  }, []);

  const titleName = intl.formatMessage({
    id: 'payment_page_receivable',
    defaultMessage: 'Receivable',
  });

  const name = match.params.userName;

  return (
    <div className="Payment">
      <div className="Payment__title">
        <div className="Payment__title-payment">
          {titleName}:
          <Link
            className="Payment__title-link"
            to={`/@${authUserName}`}
          >{` ${authUserName} `}</Link>
          <span>&larr;</span>
          <Link className="Payment__title-link" to={`/@${name}`}>{` ${name} `}</Link>
        </div>
      </div>
      {!isEmpty(sponsors) && (
        <PaymentTable
          currency={'WAIV'}
          sponsors={sponsors}
          isHive
          reservationPermlink={match.params.reservationPermlink}
          match={match}
        />
      )}
    </div>
  );
};

ReceivablesListByUser.propTypes = {
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(ReceivablesListByUser);
