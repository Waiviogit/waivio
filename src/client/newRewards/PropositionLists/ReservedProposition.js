import React from 'react';
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import {
  getFiltersForReservedProposition,
  getReservedProposition,
} from '../../../waivioApi/ApiClient';

const sortConfig = [
  { key: 'proximity', title: 'Proximity' },
  { key: 'payout', title: 'Payouts' },
  { key: 'reward', title: 'Amount' },
  { key: 'date', title: 'Expiry' },
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
      emptyMessage={"You don't have any rewards reserved."}
      withMap
    />
  );
};

export default ReservedProposition;
