import { withRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isEmpty, get, map, some } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { sortListItemsBy } from '../wObjectHelper';
import AddItemModal from './AddItemModal/AddItemModal';
import { getSuitableLanguage } from '../../../store/reducers';
import {
  getLastPermlinksFromHash,
  recencySortOrder,
  getListItem,
  getListItems,
  parseWobjectField,
  createNewHash,
  hasType,
} from '../../../common/helpers/wObjectHelper';
import {
  setLoadedNestedWobject,
  setListItems,
  setNestedWobject,
  rejectListItem,
} from '../../../store/wObjectStore/wobjActions';
import * as ApiClient from '../../../waivioApi/ApiClient';
import {
  getObject,
  getObjectLists,
  getWobjectNested,
} from '../../../store/wObjectStore/wObjectSelectors';
import Campaing from '../../newRewards/reuseble/Campaing';
import PropositionNew from '../../newRewards/reuseble/Proposition/Proposition';
import OBJ_TYPE from '../const/objectTypes';
import { statusNoVisibleItem } from '../../../common/constants/listOfFields';
import CategoryItemView from './CategoryItemView/CategoryItemView';
import ObjectCardView from '../../objectCard/ObjectCardView';
import Loading from '../../components/Icon/Loading';
import CatalogBreadcrumb from './CatalogBreadcrumb/CatalogBreadcrumb';
import CatalogSorting from './CatalogSorting/CatalogSorting';
import { getAuthenticatedUserName } from '../../../store/authStore/authSelectors';
import { getAppendDownvotes, getAppendUpvotes } from '../../../common/helpers/voteHelpers';

import './CatalogWrap.less';

const CatalogWrap = props => {
  const {
    userName,
    listItems,
    wobjectNested,
    locale,
    isEditMode,
    wobject,
    setLists,
    setNestedWobj,
    location,
    setLoadingNestedWobject,
    isLoadingFlag,
    intl,
  } = props;
  const [sortBy, setSortingBy] = useState();
  const [reward, setReward] = useState();
  const [recencySortList, setRecencySortList] = useState([]);

  useEffect(() => {
    const defaultSortBy = obj => (isEmpty(obj.sortCustom) ? 'rank' : 'custom');

    ApiClient.getObjectsRewards(wobject.author_permlink, userName).then(res => {
      setReward(res);
    });
    if (!isEmpty(wobject)) {
      if (location.hash) {
        const pathUrl = getLastPermlinksFromHash(location.hash);

        if (!isEmpty(wobjectNested) && wobjectNested.author_permlink === pathUrl) {
          setLists(
            sortListItemsBy(
              getListItems(wobjectNested),
              defaultSortBy(wobjectNested),
              wobjectNested.sortCustom,
            ),
          );
          setRecencySortList(recencySortOrder(getListItem(wobjectNested)));
        } else {
          setLoadingNestedWobject(true);

          ApiClient.getObject(pathUrl, userName, locale).then(wObject => {
            setSortingBy(defaultSortBy(wObject));
            setLists(
              sortListItemsBy(
                getListItems(wObject),
                defaultSortBy(wObject),
                get(wObject, 'sortCustom', {}),
              ),
            );
            setNestedWobj(wObject);
            setLoadingNestedWobject(false);
            setRecencySortList(recencySortOrder(getListItem(wObject)));
          });
        }
      } else {
        setSortingBy(defaultSortBy(wobject));

        setLists(
          sortListItemsBy(
            getListItems(wobject),
            defaultSortBy(wobject),
            get(wobject, 'sortCustom', {}),
          ),
        );
        setLoadingNestedWobject(false);
        setRecencySortList(recencySortOrder(getListItem(wobject)));
      }
    }

    return () => {
      setNestedWobj({});
    };
  }, [location.hash, wobject.author_permlink]);

  const handleAddItem = listItem => {
    let currentList;

    if (isEmpty(listItems)) {
      currentList = [listItem];
    } else if (listItems.some(item => item.author_permlink === listItem.author_permlink)) {
      currentList = listItems;
    } else {
      currentList = [...listItems, listItem];
    }

    const currentRecencySortList = [listItem.author_permlink, ...recencySortList];

    setLists(sortListItemsBy(currentList, 'recency', currentRecencySortList));
    setRecencySortList(currentRecencySortList);
  };
  const obj = isEmpty(wobjectNested) ? wobject : wobjectNested;
  const handleReportClick = permlink => {
    const post = obj?.listItem.find(({ body }) => body === permlink);
    const upVotes = getAppendUpvotes(post.active_votes);
    const isLiked = some(upVotes, { voter: userName });
    const onlyMyLike = isLiked && post.active_votes.length === 1;
    const voteWeight = onlyMyLike || isEmpty(post.active_votes) ? 1 : 9999;

    return props.rejectListItem(userName, post.author, post.permlink, voteWeight);
  };

  const handleSortChange = sortType => {
    setSortingBy(sortType);
    setLists(sortListItemsBy(getListItems(obj), sortType, get(obj, 'sortCustom', {})));
  };

  const isReviewPage = location.pathname === `/object/${get(wobject, 'author_permlink', '')}`;

  const getListRow = listItem => {
    const isRejected = getAppendDownvotes(listItem?.active_votes).some(
      item => item?.voter === userName,
    );
    const onReportClick = isEditMode ? handleReportClick : null;

    if (listItem?.propositions)
      return listItem?.propositions.map(propos => (
        <PropositionNew
          key={listItem._id}
          proposition={{
            ...propos,
            object: listItem,
            requiredObject: !isEmpty(listItem.parent) ? listItem.parent : propos?.requiredObject,
          }}
          handleReportClick={onReportClick}
          isRejected={isRejected}
          type={propos.reserved ? 'reserved' : ''}
        />
      ));

    if (listItem?.campaigns) {
      return (
        <Campaing
          handleReportClick={onReportClick}
          isRejected={isRejected}
          campain={{ object: listItem, ...listItem?.campaigns }}
        />
      );
    }

    const isList = listItem.object_type === OBJ_TYPE.LIST || listItem.type === OBJ_TYPE.LIST;
    const status = get(parseWobjectField(listItem, 'status'), 'title');

    if (statusNoVisibleItem.includes(status)) return null;

    const hash = createNewHash(listItem.author_permlink, location.hash);
    const path = hasType(listItem, 'page') ? `/object/${wobject.author_permlink}/page#${hash}` : '';

    let item;

    if (isList) {
      item = (
        <CategoryItemView
          handleReportClick={onReportClick}
          wObject={listItem}
          location={location}
          isRejected={isRejected}
        />
      );
    } else {
      item = (
        <ObjectCardView
          handleReportClick={onReportClick}
          wObject={listItem}
          path={path}
          inList
          isRejected={isRejected}
        />
      );
    }

    return !isReviewPage && <div key={`category-${listItem.author_permlink}`}>{item}</div>;
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

  const itemsIdsToOmit = [obj.author_permlink];
  const addedItemsPermlinks = listItems?.map(i => i.author_permlink);

  return (
    <div>
      <React.Fragment>
        {isEditMode && (
          <div className="CatalogWrap__add-item">
            <AddItemModal
              addedItemsPermlinks={addedItemsPermlinks}
              addItem
              wobject={obj}
              itemsIdsToOmit={itemsIdsToOmit}
              onAddItem={handleAddItem}
            />
          </div>
        )}
        {!isEmpty(reward?.main) && <Campaing campain={reward?.main} />}
        <React.Fragment>
          {isLoadingFlag ? (
            <Loading />
          ) : (
            <React.Fragment>
              <div className="CatalogWrap__breadcrumb">
                <CatalogBreadcrumb intl={intl} wobject={wobject} />
              </div>
              <div className="CatalogWrap__sort">
                <CatalogSorting
                  sort={sortBy}
                  currWobject={wobjectNested}
                  handleSortChange={handleSortChange}
                />
              </div>
              <div className={isEmpty(listItems) && 'CatalogWrap__empty'}>
                <div className="CatalogWrap__list">{getMenuList()}</div>
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      </React.Fragment>
    </div>
  );
};

CatalogWrap.propTypes = {
  location: PropTypes.shape().isRequired,
  wobject: PropTypes.shape(),
  isEditMode: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  wobjectNested: PropTypes.shape().isRequired,
  locale: PropTypes.string.isRequired,
  listItems: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  intl: PropTypes.arrayOf(PropTypes.shape({ formatMessage: PropTypes.func })).isRequired,
  setLists: PropTypes.func.isRequired,
  setNestedWobj: PropTypes.func.isRequired,
  rejectListItem: PropTypes.func.isRequired,
  setLoadingNestedWobject: PropTypes.func.isRequired,
  isLoadingFlag: PropTypes.bool,
};

CatalogWrap.defaultProps = {
  wobject: {},
  isEditMode: false,
  userName: '',
  locale: '',
  listItems: [],
  setLists: () => {},
  setNestedWobj: () => {},
  setLoadingNestedWobject: () => {},
  isLoadingFlag: false,
};

const mapStateToProps = state => ({
  listItems: getObjectLists(state),
  wobjectNested: getWobjectNested(state),
  wobject: getObject(state),
  locale: getSuitableLanguage(state),
  userName: getAuthenticatedUserName(state),
});

const mapDispatchToProps = {
  setLists: setListItems,
  setNestedWobj: setNestedWobject,
  setLoadingNestedWobject: setLoadedNestedWobject,
  rejectListItem,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(CatalogWrap)));
