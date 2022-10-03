import React from 'react';
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import {
  getFiltersForReservedProposition,
  getReservedProposition,
} from '../../../waivioApi/ApiClient';

const sortConfig = [
  { key: 'proximity', title: 'proximity' },
  { key: 'payout', title: 'payouts' },
  { key: 'reward', title: 'amount' },
  { key: 'date', title: 'expiry' },
];
const ReservedProposition = () => {
  const getPropositionReservedPropos = (obj, userName, skip, search, sort) =>
    getReservedProposition(userName, skip, search, sort);

  return (
    <RenderPropositionList
      getProposition={getPropositionReservedPropos}
      getPropositionFilters={getFiltersForReservedProposition}
      tab={'reserved'}
      sortConfig={sortConfig}
    />
  );
};

export default ReservedProposition;
