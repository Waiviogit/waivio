import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { get, map, isEmpty, isEqual, some, filter, size } from 'lodash';
import Proposition from '../Proposition';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import Loading from '../../../components/Icon/Loading';
import CatalogBreadcrumb from '../../../object/Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import CatalogSorting from '../../../object/Catalog/CatalogSorting/CatalogSorting';
import OBJ_TYPE from '../../../object/const/objectTypes';
import {
  createNewHash,
  hasType,
  parseWobjectField,
} from '../../../../common/helpers/wObjectHelper';
import { statusNoVisibleItem } from '../../../../common/constants/listOfFields';
import CategoryItemView from '../../../object/Catalog/CategoryItemView/CategoryItemView';
import { getObject } from '../../../../waivioApi/ApiClient';
import Campaign from '../../Campaign/Campaign';
import PropositionNew from '../../../newRewards/reuseble/Proposition/Proposition';

const PropositionList = ({
  wobject,
  currentProposition,
  discardProposition,
  assignPropositionHandler,
  intl,
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
  isCustomExist,
  wObj,
}) => {
  const [isGetWobject, setIsGetWobject] = useState(false);
  let filteredPropos = allCurrentPropositions.filter(prop => {
    const objects = get(prop, ['objects'], []);

    return listItems.some(listItem => {
      const listItemId = get(listItem, '_id', '');

      return objects.some(wobj => get(wobj, ['object', '_id'], '') === listItemId);
    });
  });

  if (!hasType(wobject, 'list') && size(filteredPropos)) {
    filteredPropos = [filteredPropos.sort((a, b) => b.reward - a.reward)[0]];
  }
  useEffect(() => {
    if (!isEmpty(wobject.parent)) {
      setIsGetWobject(true);
      getObject(get(wobject, ['parent', 'author_permlink']), userName, locale).then(() => {
        setIsGetWobject(false);
      });
    }
  }, [wobject.author_permlink]);

  const renderPropositions = () =>
    map(filteredPropos, propos =>
      map(
        get(propos, 'objects', []),
        wobj =>
          listItems.some(item => item.author_permlink === wobj.object.author_permlink) && (
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
    );

  const handleCurrentProposition = (currPropos, currWobject) => {
    if (!isEmpty(currWobject.parent)) {
      if (isEmpty(allCurrentPropositions)) return null;
      const filtPropos = filter(allCurrentPropositions, prop => {
        const objs = get(prop, 'objects', []);

        return objs.some(obj => obj.object.author_permlink === currWobject.author_permlink);
      });

      return isGetWobject ? (
        <Loading />
      ) : (
        map(filtPropos, propos => {
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

    return <Campaign proposition={currentProposition} filterKey="all" />;
  };

  const isReviewPage = location.pathname === `/object/${get(wobject, 'author_permlink', '')}`;

  const getListRow = listItem => {
    if (listItem?.propositions)
      return <PropositionNew proposition={{ ...listItem?.propositions?.[0], object: listItem }} />;
    const isList = listItem.object_type === OBJ_TYPE.LIST || listItem.type === OBJ_TYPE.LIST;
    const status = get(parseWobjectField(listItem, 'status'), 'title');

    if (statusNoVisibleItem.includes(status)) return null;

    const hash = createNewHash(listItem.author_permlink, location.hash);
    const path = hasType(listItem, 'page') ? `/object/${wobject.author_permlink}/page#${hash}` : '';

    let item;

    if (isList) {
      item = <CategoryItemView wObject={listItem} location={location} />;
    } else if (filteredPropos.length) {
      map(filteredPropos, currPropos => {
        const objPermlink = get(currPropos, 'required_object.author_permlink', {});
        const currListItemPermlink = get(listItem, 'author_permlink', {});

        if (isEqual(objPermlink, currListItemPermlink)) {
          item = handleCurrentProposition(currPropos, listItem);
        } else {
          item = <ObjectCardView wObject={listItem} path={path} inList />;
        }
      });
    } else {
      item = <ObjectCardView wObject={listItem} path={path} inList />;
    }

    return !isReviewPage && <div key={`category-${listItem.author_permlink}`}>{item}</div>;
  };

  const getPropositionObjectsData = () =>
    filteredPropos.reduce((acc, propos) => {
      const currentProposObjs = get(propos, 'objects', []);
      const ids = currentProposObjs.map(a => get(a, ['object', '_id'], ''));

      return [...acc, ...ids];
    }, []);

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
    const renderedItems = size(filteredPropos)
      ? filter(listItems, listItem =>
          some(filteredPropos, prop =>
            get(prop, 'objects', []).some(
              obj => listItem.author_permlink !== get(obj, ['object', 'author_permlink']),
            ),
          ),
        )
      : listItems;

    return map(renderedItems, listItem => {
      const proposObj = getPropositionObjectsData();

      return !proposObj.includes(get(listItem, '_id')) && getListRow(listItem);
    });
  };

  const currObj = isEmpty(wobject) ? get(currentProposition, 'required_object', {}) : wobject;

  return (
    <React.Fragment>
      {handleCurrentProposition(currentProposition, currObj)}
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
                  currWobject={wObj}
                  handleSortChange={catalogHandleSortChange}
                  isSortCustomExist={isCustomExist}
                />
              </div>
              {renderPropositions()}
              <div className={isEmpty(listItems) && 'CatalogWrap__empty'}>
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
  isCustomExist: PropTypes.bool,
  wObj: PropTypes.shape().isRequired,
};

PropositionList.defaultProps = {
  allPropositions: [],
  allCurrentPropositions: [],
  currentProposition: [],
  match: {},
  user: {},
  loadingAssignDiscard: false,
  isAssign: false,
  discardProposition: () => {},
  assignPropositionHandler: () => {},
  isCatalogWrap: false,
  catalogHandleSortChange: () => {},
  isLoadingFlag: false,
  parentPermlink: '',
  isGetNested: false,
  listItems: [],
  isCustomExist: false,
};

export default injectIntl(PropositionList);
