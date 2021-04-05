import { withRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { sortListItemsBy } from '../wObjectHelper';
import AddItemModal from './AddItemModal/AddItemModal';
import {
  getObjectLists,
  getSuitableLanguage,
  getWobjectNested,
  getLoadingFlag,
  getObject,
} from '../../reducers';
import {
  getLastPermlinksFromHash,
  itemsList,
  recencySortOrder,
  getListItem,
  getListItems,
} from '../../helpers/wObjectHelper';
import PropositionListContainer from '../../rewards/Proposition/PropositionList/PropositionListContainer';
import { setLoadedNestedWobject, setListItems, setNestedWobject } from '../wobjActions';
import * as ApiClient from '../../../waivioApi/ApiClient';
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
    location: { hash },
    setLoadingNestedWobject,
    isLoadingFlag,
  } = props;
  const [sortBy, setSortingBy] = useState();
  const [recencySortList, setRecencySortList] = useState();

  useEffect(() => {
    const defaultSortBy = obj => (isEmpty(obj.sortCustom) ? 'rank' : 'custom');
    const isDefaultCustom = obj => defaultSortBy(obj) === 'custom';

    if (!isEmpty(wobject)) {
      if (hash) {
        setLoadingNestedWobject(true);
        const pathUrl = getLastPermlinksFromHash(hash);
        ApiClient.getObject(pathUrl, userName, locale).then(wObject => {
          setSortingBy(defaultSortBy(wObject));
          setLists(
            sortListItemsBy(
              itemsList(get(wObject, 'sortCustom', []), wObject),
              defaultSortBy(wObject),
              isDefaultCustom(wObject)
                ? wObject.sortCustom
                : recencySortOrder(getListItem(wObject)),
            ),
          );
          setNestedWobj(wObject);
          setLoadingNestedWobject(false);
          setRecencySortList(recencySortOrder(getListItem(wObject)));
        });
      } else {
        setSortingBy(defaultSortBy(wobject));
        // eslint-disable-next-line no-use-before-define
        setLists(
          sortListItemsBy(
            itemsList(get(wobject, 'sortCustom', []), wobject),
            defaultSortBy(wobject),
            isDefaultCustom(wobject) ? wobject.sortCustom : recencySortOrder(getListItem(wobject)),
          ),
        );
        setLoadingNestedWobject(false);
        setRecencySortList(recencySortOrder(getListItem(wobject)));
      }
    }
    return () => {
      setNestedWobj({});
    };
  }, [hash, wobject.author_permlink]);

  const handleAddItem = listItem => {
    const currentList = isEmpty(listItems) ? [listItem] : [...listItems, listItem];
    const currentRecencySortList = isEmpty(recencySortList)
      ? [listItem.author_permlink]
      : [listItem.author_permlink, ...recencySortList];
    setLists(sortListItemsBy(currentList, 'recency', currentRecencySortList));
    setRecencySortList(currentRecencySortList);
  };
  const obj = isEmpty(wobjectNested) ? wobject : wobjectNested;

  const handleSortChange = sortType => {
    const currentList =
      sortType === 'custom' ? itemsList(get(obj, 'sortCustom', []), obj) : getListItems(obj);
    const sortOrder = sortType === 'recency' ? recencySortList : get(obj, 'sortCustom', []);
    setSortingBy(sortType);
    setLists(sortListItemsBy(currentList, sortType, sortOrder));
  };

  const isSortCustomExist = !isEmpty(get(obj, 'sortCustom', []));
  return (
    <div>
      <React.Fragment>
        {isEditMode && (
          <div className="CatalogWrap__add-item">
            <AddItemModal wobject={obj} onAddItem={handleAddItem} />
          </div>
        )}
        <PropositionListContainer
          wobject={wobject}
          userName={userName}
          catalogHandleSortChange={handleSortChange}
          catalogSort={sortBy}
          isCatalogWrap
          currentHash={hash}
          isLoadingFlag={isLoadingFlag}
          location={location}
          listItems={listItems}
          isSortCustomExist={isSortCustomExist}
          wObj={obj}
        />
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
  listItems: PropTypes.shape({}).isRequired,
  setLists: PropTypes.func.isRequired,
  setNestedWobj: PropTypes.func.isRequired,
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
  isLoadingFlag: getLoadingFlag(state),
});

const mapDispatchToProps = {
  setLists: setListItems,
  setNestedWobj: setNestedWobject,
  setLoadingNestedWobject: setLoadedNestedWobject,
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(CatalogWrap)));
