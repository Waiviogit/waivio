import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { get, map, isEmpty, isEqual } from 'lodash';
import Proposition from '../Proposition';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import Loading from '../../../components/Icon/Loading';
import CatalogBreadcrumb from '../../../object/Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import CatalogSorting from '../../../object/Catalog/CatalogSorting/CatalogSorting';
import OBJ_TYPE from '../../../object/const/objectTypes';
import { parseWobjectField } from '../../../helpers/wObjectHelper';
import { statusNoVisibleItem } from '../../../../common/constants/listOfFields';
import CategoryItemView from '../../../object/Catalog/CategoryItemView/CategoryItemView';
import PropositionMainObjectCard from '../PropositionMainObjectCard';
import { getObject } from '../../../../waivioApi/ApiClient';

const PropositionList = ({
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
  catalogHandleSortChange,
  catalogSort,
  listItems,
  isLoadingFlag,
  location,
  allCurrentPropositions,
  locale,
  isCatalogWrap,
}) => {
  const [isGetWobject, setIsGetWobject] = useState(false);

  useEffect(() => {
    if (!isEmpty(wobject.parent)) {
      setIsGetWobject(true);
      getObject(get(wobject, ['parent', 'author_permlink']), userName, locale).then(() => {
        setIsGetWobject(false);
      });
    }
  }, [wobject.author_permlink]);

  const renderPropositions = () => {
    const filteredPropos = allCurrentPropositions.filter(prop => {
      const objects = get(prop, ['objects'], []);
      console.log(objects);
      return listItems.some(listItem =>
        objects.some(wobj => get(wobj, 'object', '_id', '') === get(listItem, '_id', '')));
    });

    console.log(filteredPropos);
    return map(allCurrentPropositions, propos =>
      map(propos.objects, wobj => {
        const wobjId = get(wobj, ['object', '_id'], '');
        return map(listItems, listItem => {
          const listItemId = get(listItem, '_id', '');
          if (isEqual(listItemId, wobjId)) {
            return (
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
            );
          }
          return null;
        });
      }),
    )
  };

  const handleCurrentProposition = (currPropos, currWobject) => {
    if (!isEmpty(currWobject.parent)) {
      if (isEmpty(allCurrentPropositions)) return null;
      const filteredPropos = allCurrentPropositions.filter(prop =>
        prop.objects.some(obj => obj.object.author_permlink === currWobject.author_permlink),
      );

      return isGetWobject ? (
        <Loading />
      ) : (
        map(filteredPropos, propos => {
          if (!isEmpty(propos)) {
            return (
              <Proposition
                proposition={propos}
                wobj={wobject}
                wobjPrice={wobject.reward}
                assignCommentPermlink={wobject.permlink}
                assignProposition={assignPropositionHandler}
                discardProposition={discardProposition}
                authorizedUserName={userName}
                loading={loadingAssignDiscard}
                key={`${currWobject.author_permlink}`}
                assigned={currWobject.assigned}
                history={history}
                isAssign={isAssign}
                match={match}
                user={user}
              />
            );
          }

          return null;
        })
      );
    }

    if (isEmpty(currPropos)) return null;

    const minReward = get(currentProposition, ['min_reward'], 0);
    const maxReward = get(currentProposition, ['max_reward'], 0);
    const rewardPrise = `${get(currentProposition, ['reward'], 0).toFixed(2)} USD`;
    const rewardMax = `${maxReward.toFixed(2)} USD`;

    return (
      <PropositionMainObjectCard
        intl={intl}
        wobject={currWobject}
        currentProposition={currPropos}
        goToProducts={goToProducts}
        maxReward={maxReward}
        minReward={minReward}
        rewardPrise={rewardPrise}
        rewardMax={rewardMax}
      />
    );
  };

  const isReviewPage = location.pathname === `/object/${get(wobject, 'author_permlink', '')}`;

  const getListRow = listItem => {
    const isList = listItem.object_type === OBJ_TYPE.LIST || listItem.type === OBJ_TYPE.LIST;
    const status = get(parseWobjectField(listItem, 'status'), 'title');

    if (statusNoVisibleItem.includes(status)) return null;

    let item;

    if (isList) {
      item = <CategoryItemView wObject={listItem} location={location} />;
    } else if (allCurrentPropositions.length) {
      map(allCurrentPropositions, currPropos => {
        const objPermlink = get(currPropos, 'required_object.author_permlink', {});
        const currListItemPermlink = get(listItem, 'author_permlink', {});

        if (isEqual(objPermlink, currListItemPermlink)) {
          item = handleCurrentProposition(currPropos, listItem);
        } else {
          item = <ObjectCardView wObject={listItem} inList />;
        }
      });
    } else {
      item = <ObjectCardView wObject={listItem} inList />;
    }

    return !isReviewPage && <div key={`category-${listItem.author_permlink}`}>{item}</div>;
  };

  const getPropositionObjectsData = item => {
    const arr = [];
    const propositionObjects = get(allCurrentPropositions, '[0]objects', []);
    propositionObjects.forEach(propos => {
      const currentProposObj = get(propos, 'object', {});
      if (item) {
        arr.push(get(currentProposObj, `${item}`, ''));
      } else {
        arr.push(currentProposObj);
      }
    });
    return arr;
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

    return map(listItems, listItem => {
      const proposObj = getPropositionObjectsData('_id');
      return !proposObj.includes(get(listItem, '_id')) && getListRow(listItem);
    });
  };

  return (
    <React.Fragment>
      {handleCurrentProposition(currentProposition, wobject)}
      {isLoadingFlag ? (
        <Loading />
      ) : (
        <React.Fragment>
          {isCatalogWrap && (
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
              {renderPropositions()}
              <div className="CatalogWrap">
                <div>{getMenuList()}</div>
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

PropositionList.propTypes = {
  intl: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  isCatalogWrap: PropTypes.bool,
  allCurrentPropositions: PropTypes.arrayOf(PropTypes.shape()),
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
  catalogHandleSortChange: PropTypes.func,
  catalogSort: PropTypes.string.isRequired,
  isLoadingFlag: PropTypes.bool,
  listItems: PropTypes.shape(),
  location: PropTypes.shape().isRequired,
  locale: PropTypes.string.isRequired,
};

PropositionList.defaultProps = {
  allPropositions: [],
  allCurrentPropositions: [],
  currentProposition: [],
  match: {},
  user: {},
  loadingAssignDiscard: false,
  isAssign: false,
  goToProducts: () => {},
  discardProposition: () => {},
  assignPropositionHandler: () => {},
  isCatalogWrap: false,
  catalogHandleSortChange: () => {},
  isLoadingFlag: false,
  parentPermlink: '',
  isGetNested: false,
  listItems: [],
};

export default injectIntl(PropositionList);
