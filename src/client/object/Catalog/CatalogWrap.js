import { withRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { get, isEmpty, map } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { sortListItemsBy } from '../wObjectHelper';
import { objectFields, statusNoVisibleItem } from '../../../common/constants/listOfFields';
import OBJ_TYPE from '../const/objectTypes';
import AddItemModal from './AddItemModal/AddItemModal';
import {
  getIsNestedWobject,
  getObjectLists,
  getSuitableLanguage,
  getWobjectNested,
} from '../../reducers';
import ObjectCardView from '../../objectCard/ObjectCardView';
import CategoryItemView from './CategoryItemView/CategoryItemView';
import { getLastPermlinksFromHash, parseWobjectField } from '../../helpers/wObjectHelper';
import PropositionListContainer from '../../rewards/Proposition/PropositionList/PropositionListContainer';
import { clearIsGetNestedWobject, setListItems, setNestedWobject } from '../wobjActions';
import { getObject } from '../../../waivioApi/ApiClient';
import './CatalogWrap.less';

const CatalogWrap = props => {
  const {
    intl,
    userName,
    listItems,
    wobjectNested,
    locale,
    isEditMode,
    wobject,
    setLists,
    setNestedWobj,
    location: { hash },
    clearNestedWobjFlag,
  } = props;

  const [sortBy, setSortingBy] = useState('recency');

  useEffect(() => {
    if (!isEmpty(wobject)) {
      if (hash) {
        const pathUrl = getLastPermlinksFromHash(hash);
        getObject(pathUrl, userName, locale).then(wObject => {
          setLists(get(wObject, 'listItems', []));
          setNestedWobj(wObject);
        });
      } else {
        setLists(wobject.listItems);
      }
    }
  }, [hash, wobject.author_permlink, userName]);

  useEffect(() => {
    if (wobjectNested) {
      clearNestedWobjFlag();
    }
  }, [wobjectNested]);

  const handleAddItem = listItem => {
    const currentList = isEmpty(listItems) ? [listItem] : [...listItems, listItem];
    setLists(sortListItemsBy(currentList, 'recency'));
  };

  /**
   *
   * @param propositionsObject
   * @param listItem
   */

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

  const handleSortChange = sortType => {
    const sortOrder = wobject && wobject[objectFields.sorting];
    setSortingBy(sortType);
    setLists(sortListItemsBy(listItems, sortType, sortOrder));
  };

  const obj = isEmpty(wobjectNested) ? wobject : wobjectNested;

  return (
    <div>
      <React.Fragment>
        <PropositionListContainer
          wobject={wobject}
          userName={userName}
          catalogGetMenuList={getMenuList}
          catalogHandleSortChange={handleSortChange}
          catalogSort={sortBy}
          isCatalogWrap
          currentHash={hash}
        />
        {isEditMode && (
          <div className="CatalogWrap__add-item">
            <AddItemModal wobject={obj} onAddItem={handleAddItem} />
          </div>
        )}
      </React.Fragment>
    </div>
  );
};

CatalogWrap.propTypes = {
  intl: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  wobject: PropTypes.shape(),
  isEditMode: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  wobjectNested: PropTypes.shape().isRequired,
  locale: PropTypes.string.isRequired,
  listItems: PropTypes.shape({}).isRequired,
  setLists: PropTypes.func.isRequired,
  setNestedWobj: PropTypes.func.isRequired,
  clearNestedWobjFlag: PropTypes.func,
};

CatalogWrap.defaultProps = {
  wobject: {},
  isEditMode: false,
  userName: '',
  locale: '',
  listItems: [],
  setLists: () => {},
  setNestedWobj: () => {},
  clearNestedWobjFlag: () => {},
  isGetNestedWobj: false,
};

const mapStateToProps = state => ({
  listItems: getObjectLists(state),
  wobjectNested: getWobjectNested(state),
  locale: getSuitableLanguage(state),
  isGetNestedWobj: getIsNestedWobject(state),
});

const mapDispatchToProps = {
  setLists: setListItems,
  setNestedWobj: setNestedWobject,
  clearNestedWobjFlag: clearIsGetNestedWobject,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
  withRouter,
)(CatalogWrap);
