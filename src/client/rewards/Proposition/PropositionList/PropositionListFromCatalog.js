import React from 'react';
import PropTypes from 'prop-types';
import { get, isEmpty, map } from 'lodash';
import PropositionMainObjectCard from '../PropositionMainObjectCard';
import CatalogBreadcrumb from '../../../object/Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import CatalogSorting from '../../../object/Catalog/CatalogSorting/CatalogSorting';
import Proposition from '../Proposition';
import OBJ_TYPE from '../../../object/const/objectTypes';
import { parseWobjectField } from '../../../helpers/wObjectHelper';
import { statusNoVisibleItem } from '../../../../common/constants/listOfFields';
import CategoryItemView from '../../../object/Catalog/CategoryItemView/CategoryItemView';
import ObjectCardView from '../../../objectCard/ObjectCardView';

const PropositionListFromCatalog = ({
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
  catalogHandleSortChange,
  catalogSort,
  isGetNested,
  listItems,
}) => {
  const getListRow = listItem => {
    const isList = listItem.object_type === OBJ_TYPE.LIST || listItem.type === OBJ_TYPE.LIST;
    const status = get(parseWobjectField(listItem, 'status'), 'title');

    if (statusNoVisibleItem.includes(status)) return null;
    let item;
    if (isList) {
      item = <CategoryItemView wObject={listItem} location={location} />;
    } else {
      item = <ObjectCardView wObject={listItem} inList />;
    }
    return <div key={`category-${listItem.author_permlink}`}>{item}</div>;
  };

  const getMenuList = () => {
    if (isEmpty(listItems)) {
      return (
        <div>
          {intl.formatMessage({
            id: 'emptyList',
            defaultMessage: 'This list is empty',
          })}
        </div>
      );
    }
    return map(listItems, listItem => getListRow(listItem));
  };

  return (
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
      {!isGetNested && (
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
          <div>{getMenuList()}</div>
        </div>
      </React.Fragment>
    </React.Fragment>
  );
};

PropositionListFromCatalog.propTypes = {
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
  catalogHandleSortChange: PropTypes.func,
  catalogSort: PropTypes.string,
  isGetNested: PropTypes.bool,
  listItems: PropTypes.shape(),
};

PropositionListFromCatalog.defaultProps = {
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
  catalogHandleSortChange: () => {},
  catalogSort: '',
  isGetNested: false,
  listItems: [],
};

export default PropositionListFromCatalog;
