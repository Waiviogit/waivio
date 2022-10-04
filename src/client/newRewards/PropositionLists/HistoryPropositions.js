import React from 'react';
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import { getFiltersForHistoryProposition, getHistoryList } from '../../../waivioApi/ApiClient';

const filterConfig = [
  { title: 'Rewards', type: 'statuses' },
  { title: 'Sponsors', type: 'guideNames' },
];

const sortConfig = [
  { key: 'reservation', title: 'Reservation' },
  { key: 'lastAction', title: 'Action (date)' },
];

const HistoryPropositions = () => {
  const getPropositionReservedPropos = (obj, userName, skip, search, sort) =>
    getHistoryList(userName, skip, search, sort);

  const getPropositionFilters = (requiredObject, authUserName) =>
    getFiltersForHistoryProposition(authUserName);

  return (
    <RenderPropositionList
      getProposition={getPropositionReservedPropos}
      getPropositionFilters={getPropositionFilters}
      customFilterConfig={filterConfig}
      tab={'history'}
      customSortConfig={sortConfig}
      defaultSort={'reservation'}
    />
  );
};

export default HistoryPropositions;
