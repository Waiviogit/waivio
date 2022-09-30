import React from 'react';
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import { getFiltersForHistoryProposition, getHistoryList } from '../../../waivioApi/ApiClient';

const filterConfig = [
  { title: 'Rewards', type: 'statuses' },
  { title: 'Sponsors', type: 'guideNames' },
];

const HistoryPropositions = () => {
  const getPropositionReservedPropos = (obj, userName, skip, search) =>
    getHistoryList(userName, skip, search);

  const getPropositionFilters = (requiredObject, authUserName) =>
    getFiltersForHistoryProposition(authUserName);

  return (
    <RenderPropositionList
      getProposition={getPropositionReservedPropos}
      getPropositionFilters={getPropositionFilters}
      customFilterConfig={filterConfig}
      tab={'history'}
    />
  );
};

export default HistoryPropositions;
