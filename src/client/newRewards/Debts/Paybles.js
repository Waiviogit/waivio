import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { get } from 'lodash';
import { getPaybelsList } from '../../../waivioApi/ApiClient';
import Debts from '../../rewards/Debts/Debts';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import RewardsFilters from '../Filters/Filters';

const filterConfig = [
  { title: 'Receivables', type: 'days' },
  { title: '', type: 'payable' },
];

const Payables = ({ currentSteemDollarPrice }) => {
  const [lenders, setLenders] = useState({});
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const authUserName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    setLoading(true);
    getPaybelsList(authUserName, {
      skip: 0,
      limit: 30,
      days: query.get('days'),
      payable: query.get('payable'),
    })
      .then(data => {
        setLenders({ ...data, hasMore: false });
        setLoading(false);
      })
      .catch(e => console.error(e));
  }, [location.search]);

  const handleLoadingMore = () =>
    getPaybelsList(authUserName, {
      skip: 0,
      limit: 30,
      days: query.get('days'),
      payable: query.get('payable'),
    }).then(data => {
      setLenders({
        ...lenders,
        histories: [...get(lenders, 'histories', []), ...data.histories],
        hasMore: data.hasMore,
      });
    });

  const getFilters = async () => ({
    days: [
      { title: 'Over 15 days', value: '15' },
      { title: 'Over 30 days', value: '30' },
    ],
    payable: [{ title: 'Over 20 WAIV', value: '20' }],
  });

  return (
    <React.Fragment>
      <div className="">
        <Debts
          userName={authUserName}
          currentSteemDollarPrice={currentSteemDollarPrice}
          debtObjsData={lenders}
          handleLoadingMore={handleLoadingMore}
          loading={loading}
        />
      </div>
      <div className="">
        <RewardsFilters config={filterConfig} getFilters={getFilters} onlyOne />
      </div>
    </React.Fragment>
  );
};

Payables.propTypes = {
  currentSteemDollarPrice: PropTypes.number,
};

Payables.defaultProps = {
  currentSteemDollarPrice: 0,
};

export default injectIntl(Payables);
