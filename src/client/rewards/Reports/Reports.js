import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
// import {useSelector} from "react-redux";
import WrappedNormalLoginForm from './ReportsForm';
import { getLenders } from '../../../waivioApi/ApiClient';
import PaymentTable from '../Payment/PaymentTable/PaymentTable';
// import { getGlobalReportData } from '../../reducers';
import './Reports.less';

const Reports = ({ intl, userName }) => {
  const [sponsors, setSponsors] = useState({});
  // const globalReportData = useSelector(getGlobalReportData);

  const requestParams = {
    sponsor: userName,
    user: userName,
  };

  const getHistories = params => {
    getLenders(params)
      .then(data => {
        setSponsors(data.histories);
      })
      .catch(e => console.log(e));
  };

  useEffect(() => {
    getHistories(requestParams);
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
        <WrappedNormalLoginForm intl={intl} userName={userName} getHistories={getHistories} />
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
