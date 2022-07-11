import React from 'react';
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import { getReservedProposition } from '../../../waivioApi/ApiClient';

const ReservedProposition = () => {
  const getPropositionReservedPropos = (obj, userName, skip) =>
    getReservedProposition(userName, skip);

  return <RenderPropositionList getProposition={getPropositionReservedPropos} tab={'Reserved'} />;
};

export default ReservedProposition;
