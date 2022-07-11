import React from 'react';
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import { getEligiblePropositionByCampaingObjectPermlink } from '../../../waivioApi/ApiClient';

const EligibleProposition = () => (
  <RenderPropositionList
    getProposition={getEligiblePropositionByCampaingObjectPermlink}
    tab={'eligible'}
  />
);

export default EligibleProposition;
