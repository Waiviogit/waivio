import React from 'react';
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import {
  getFiltersForAllProposition,
  getPropositionByCampaingObjectPermlink,
} from '../../../waivioApi/ApiClient';

const AllProposition = () => (
  <RenderPropositionList
    getProposition={getPropositionByCampaingObjectPermlink}
    tab={'all'}
    withoutSort
    getPropositionFilters={getFiltersForAllProposition}
  />
);

export default AllProposition;
