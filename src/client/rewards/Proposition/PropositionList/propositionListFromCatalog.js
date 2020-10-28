import React from 'react';
import PropTypes from 'prop-types';
import { get, map } from 'lodash';
import PropositionMainObjectCard from '../PropositionMainObjectCard';
import CatalogBreadcrumb from '../../../object/Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import CatalogSorting from '../../../object/Catalog/CatalogSorting/CatalogSorting';
import Proposition from '../Proposition';
import Loading from '../../../components/Icon/Loading';

const propositionListFromCatalog = ({
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
}) => (
  <React.Fragment>
    {wobject && (
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
    )}
    {isGetNested ? (
      <Loading />
    ) : (
      <React.Fragment>
        <div className="CatalogWrap__breadcrumb">
          <CatalogBreadcrumb intl={intl} wobject={wobject} />
        </div>
        <div className="CatalogWrap__sort">
          <CatalogSorting
            sort={catalogSort}
            currWobject={wobject}
            handleSortChange={catalogHandleSortChange}
          />
        </div>
      </React.Fragment>
    )}
    <React.Fragment>
      {map(allPropositions, propos =>
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
      )}
      <div className="CatalogWrap">
        <div>{catalogGetMenuList()}</div>
      </div>
    </React.Fragment>
  </React.Fragment>
);

propositionListFromCatalog.PropTypes = {
  intl: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
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
  userName: PropTypes.string.isRequired,
  loadingAssignDiscard: PropTypes.bool,
  isAssign: PropTypes.bool,
  user: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
  catalogGetMenuList: PropTypes.func,
  catalogHandleSortChange: PropTypes.func,
  catalogSort: PropTypes.string,
};

PropositionMainObjectCard.defaultProps = {
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
  catalogGetMenuList: () => {},
  catalogHandleSortChange: () => {},
  catalogSort: '',
};

export default propositionListFromCatalog;
