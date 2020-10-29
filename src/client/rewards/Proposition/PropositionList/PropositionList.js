import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { get, map, max, min } from 'lodash';
import { getIsNestedWobject } from '../../../reducers';
import PropositionListFromCatalog from './PropositionListFromCatalog';
import DefaultPropositionList from './DefaultPropositionList';

const PropositionList = ({
  allPropositions,
  wobject,
  currentProposition,
  discardProposition,
  assignPropositionHandler,
  intl,
  goToProducts,
  match,
  history,
  user,
  userName,
  loadingAssignDiscard,
  isAssign,
  isCatalogWrap,
  catalogGetMenuList,
  catalogHandleSortChange,
  catalogSort,
  isGetNested,
}) => {
  let minReward;
  let maxReward;
  let rewardPrise;
  let rewardMax;

  if (isCatalogWrap) {
    minReward = allPropositions
      ? min(map(allPropositions, proposition => proposition.reward))
      : null;
    maxReward = allPropositions
      ? max(map(allPropositions, proposition => proposition.reward))
      : null;
    rewardPrise = minReward ? `${minReward.toFixed(2)} USD` : '';
    rewardMax = maxReward !== minReward ? `${maxReward.toFixed(2)} USD` : '';
  } else {
    minReward = get(currentProposition, ['min_reward'], 0);
    maxReward = get(currentProposition, ['max_reward'], 0);
    rewardPrise = `${minReward.toFixed(2)} USD`;
    rewardMax = `${maxReward.toFixed(2)} USD`;
  }

  const data = {
    intl,
    wobject,
    currentProposition,
    goToProducts,
    maxReward,
    minReward,
    rewardPrise,
    rewardMax,
    allPropositions,
    match,
    assignPropositionHandler,
    discardProposition,
    userName,
    loadingAssignDiscard,
    isAssign,
    user,
    history,
    catalogGetMenuList,
    catalogHandleSortChange,
    catalogSort,
    isGetNested,
  };

  return (
    <React.Fragment>
      {isCatalogWrap ? (
        <PropositionListFromCatalog {...data} />
      ) : (
        <DefaultPropositionList {...data} />
      )}
    </React.Fragment>
  );
};

PropositionList.propTypes = {
  intl: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  allPropositions: PropTypes.arrayOf(PropTypes.shape()),
  currentProposition: PropTypes.arrayOf(PropTypes.shape()),
  discardProposition: PropTypes.func,
  assignPropositionHandler: PropTypes.func,
  goToProducts: PropTypes.func,
  match: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
  userName: PropTypes.string.isRequired,
  loadingAssignDiscard: PropTypes.bool,
  isAssign: PropTypes.bool,
  isCatalogWrap: PropTypes.bool,
  catalogGetMenuList: PropTypes.func,
  catalogHandleSortChange: PropTypes.func,
  catalogSort: PropTypes.string,
  isGetNested: PropTypes.bool,
};

PropositionList.defaultProps = {
  allPropositions: [],
  currentProposition: [],
  match: {},
  user: {},
  loadingAssignDiscard: false,
  isAssign: false,
  goToProducts: () => {},
  discardProposition: () => {},
  assignPropositionHandler: () => {},
  isCatalogWrap: false,
  catalogGetMenuList: () => {},
  catalogHandleSortChange: () => {},
  catalogSort: '',
  isGetNested: false,
};

export default connect(state => ({
  isGetNested: getIsNestedWobject(state),
}))(injectIntl(PropositionList));
