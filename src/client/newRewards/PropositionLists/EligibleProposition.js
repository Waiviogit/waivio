import React from 'react';
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import {
  getEligiblePropositionByCampaingObjectPermlink,
  getFiltersForEligibleProposition,
} from '../../../waivioApi/ApiClient';

const EligibleProposition = () => (
  <RenderPropositionList
    getProposition={getEligiblePropositionByCampaingObjectPermlink}
    getPropositionFilters={getFiltersForEligibleProposition}
    tab={'eligible'}
  />
);

export default EligibleProposition;
