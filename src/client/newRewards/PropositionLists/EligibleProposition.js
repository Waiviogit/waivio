import React from 'react';
import { useRouteMatch } from 'react-router';
import RenderPropositionList from '../PropositionList/RenderPropositionList';
import {
  getEligiblePropositionByCampaingObjectPermlink,
  getFiltersForEligibleProposition,
  getJudgeRewardsByObject,
  getJudgeRewardsFiltersBySponsor,
} from '../../../waivioApi/ApiClient';

const EligibleProposition = () => {
  const match = useRouteMatch();
  const isJudges = match.params[0] === 'judges';
  const method = isJudges
    ? getJudgeRewardsByObject
    : getEligiblePropositionByCampaingObjectPermlink;
  const filterMethod = isJudges
    ? getJudgeRewardsFiltersBySponsor
    : getFiltersForEligibleProposition;

  return (
    <RenderPropositionList
      getProposition={method}
      getPropositionFilters={filterMethod}
      withoutSort
      tab={isJudges ? 'judges' : 'eligible'}
      withMap
    />
  );
};

export default EligibleProposition;
