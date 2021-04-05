import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { isEmpty } from 'lodash';
import WrappedNormalLoginForm from './ReportsForm';
import { getLenders } from '../../../waivioApi/ApiClient';
import PaymentTable from '../Payment/PaymentTable/PaymentTable';
import './Reports.less';

const Reports = ({ intl, userName }) => {
  const [sponsors, setSponsors] = useState({});
  const [isHive, setIsHive] = useState(true);

  const requestParams = {
    sponsor: userName,
    globalReport: true,
  };

  const getIsHive = currency => currency === 'hive';

  const getHistories = (params, currency) => {
    getLenders(params)
      .then(data => {
        setSponsors(data.histories);
        const hive = currency ? getIsHive(currency) : isHive;

        setIsHive(hive);
      })
      .catch(e => console.error(e));
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
        {!isEmpty(sponsors) && (
          <PaymentTable sponsors={sponsors} isReports userName={userName} isHive={isHive} />
        )}
      </React.Fragment>
    </div>
  );
};

Reports.propTypes = {
  intl: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
};

export default injectIntl(Reports);
