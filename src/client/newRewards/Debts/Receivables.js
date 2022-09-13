import React, { useState, useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';

import { get } from 'lodash';
import { getReceivablesList } from '../../../waivioApi/ApiClient';
import Debts from '../../rewards/Debts/Debts';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import RewardsFilters from '../Filters/Filters';

import './DebtsList.less';

const filterConfig = [
  { title: 'Receivables', type: 'days' },
  { title: '', type: 'payable' },
];

const Receivables = () => {
  const [lenders, setLenders] = useState({});
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const authUserName = useSelector(getAuthenticatedUserName);

  useEffect(() => {
    setLoading(true);
    getReceivablesList(authUserName, {
      skip: 0,
      limit: 30,
      days: query.get('days'),
      payable: query.get('payable'),
    })
      .then(data => {
        setLenders({
          ...data,
          histories: data?.histories.sort((a, b) => b.payable - a.payable),
          hasMore: false,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [location.search]);

  const handleLoadingMore = () =>
    getReceivablesList(authUserName, {
      skip: 0,
      limit: 30,
      days: query.get('days'),
      payable: query.get('payable'),
    }).then(data => {
      setLenders({
        ...lenders,
        ...data,
        histories: [...get(lenders, 'histories', []), ...data.histories].sort(
          (a, b) => b.payable - a.payable,
        ),
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
    <div className="DebtsList">
      <div className="DebtsList__list">
        <Debts
          userName={authUserName}
          debtObjsData={lenders}
          handleLoadingMore={handleLoadingMore}
          loading={loading}
          payoutToken={'WAIV'}
        />
      </div>
      <RewardsFilters config={filterConfig} getFilters={getFilters} onlyOne />
    </div>
  );
};

export default injectIntl(Receivables);
