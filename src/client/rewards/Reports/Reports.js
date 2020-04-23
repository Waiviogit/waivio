import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import WrappedNormalLoginForm from './ReportsForm';
import { getLenders } from '../../../waivioApi/ApiClient';
import PaymentTable from '../Payment/PaymentTable/PaymentTable';
import './Reports.less';

const Reports = ({ intl, userName }) => {
  const [sponsors, setSponsors] = useState({});

  // const getUserName = data => map(data, user =>  user.userName);
  // const getUserSponsor = data => map(data, user =>  user.sponsor);

  const requestParams = {
    sponsor: userName,
    user: userName,
    // sponsor: match.path === '/rewards/reports' ? userName : match.params.userName,
    // user: match.path === '/rewards/reports' ? match.params.userName : userName,
  };

  useEffect(() => {
    getLenders(requestParams)
      .then(data => {
        setSponsors(data.histories);
      })
      .catch(e => console.log(e));
  }, []);

  return (
    <div className="Reports">
      <React.Fragment>
        <div className="Reports__wrap">
          <div className="Reports__wrap-title">
            {intl.formatMessage({
              id: 'reports',
              defaultMessage: `Reports`,
            })}{' '}
            :
          </div>
        </div>
        <WrappedNormalLoginForm intl={intl} userName={userName} />

        <PaymentTable sponsors={sponsors} isReports userName={userName} />
      </React.Fragment>
    </div>
  );
};

Reports.propTypes = {
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
};

export default injectIntl(Reports);
