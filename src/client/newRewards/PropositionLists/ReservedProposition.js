import React from 'react';
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import {
  getFiltersForReservedProposition,
  getReservedProposition,
} from '../../../waivioApi/ApiClient';

const ReservedProposition = () => {
  const getPropositionReservedPropos = (obj, userName, skip, search) =>
    getReservedProposition(userName, skip, search);

  return (
    <RenderPropositionList
      getProposition={getPropositionReservedPropos}
      getPropositionFilters={getFiltersForReservedProposition}
      tab={'reserved'}
    />
  );
};

export default ReservedProposition;
