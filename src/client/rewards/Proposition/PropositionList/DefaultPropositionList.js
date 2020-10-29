import React from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty, map } from 'lodash';
import PropositionMainObjectCard from '../PropositionMainObjectCard';
import Proposition from '../Proposition';

const DefaultPropositionList = ({
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
}) =>
  wobject && isEmpty(wobject.parent) && !isEmpty(currentProposition) ? (
    <PropositionMainObjectCard
      intl={intl}
      wobject={wobject}
      currentProposition={currentProposition}
      goToProducts={goToProducts}
      maxReward={maxReward}
      minReward={minReward}
      rewardPrise={rewardPrise}
      rewardMax={rewardMax}
    />
  ) : (
    map(allPropositions, propos =>
      map(
        propos.objects,
        wobj =>
          (get(wobj, ['object', 'author_permlink']) === match.params.name ||
            get(wobj, ['object', 'parent', 'author_permlink']) === match.params.name) && (
            <Proposition
              proposition={propos}
              wobj={wobj.object}
              wobjPrice={wobj.reward}
              assignCommentPermlink={wobj.permlink}
              assignProposition={assignPropositionHandler}
              discardProposition={discardProposition}
              authorizedUserName={userName}
              loading={loadingAssignDiscard}
              key={`${wobj.object.author_permlink}`}
              assigned={wobj.assigned}
              history={history}
              isAssign={isAssign}
              match={match}
              user={user}
            />
          ),
      ),
    )
  );

DefaultPropositionList.propTypes = {
  intl: PropTypes.shape(),
  wobject: PropTypes.shape(),
  currentProposition: PropTypes.arrayOf(PropTypes.shape()),
  goToProducts: PropTypes.func,
  maxReward: PropTypes.number,
  minReward: PropTypes.number,
  rewardPrise: PropTypes.string,
  rewardMax: PropTypes.string,
  allPropositions: PropTypes.arrayOf(PropTypes.shape()),
  match: PropTypes.shape(),
  assignPropositionHandler: PropTypes.func,
  discardProposition: PropTypes.func,
  userName: PropTypes.string,
  loadingAssignDiscard: PropTypes.bool,
  isAssign: PropTypes.bool,
  user: PropTypes.shape(),
  history: PropTypes.shape(),
};

DefaultPropositionList.defaultProps = {
  intl: {},
  wobject: {},
  history: {},
  userName: '',
  currentProposition: [],
  goToProducts: () => {},
  maxReward: null,
  minReward: null,
  rewardPrise: '',
  rewardMax: '',
  allPropositions: [],
  match: {},
  assignPropositionHandler: () => {},
  discardProposition: () => {},
  loadingAssignDiscard: false,
  isAssign: false,
  user: {},
};

export default DefaultPropositionList;
