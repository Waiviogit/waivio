import React from 'react';
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import { getPropositionByCampaingObjectPermlink } from '../../../waivioApi/ApiClient';

const AllProposition = () => (
  <RenderPropositionList getProposition={getPropositionByCampaingObjectPermlink} tab={'all'} />
);

export default AllProposition;
