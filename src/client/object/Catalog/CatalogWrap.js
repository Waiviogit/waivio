import { withRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { isEmpty, get } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { sortListItemsBy } from '../wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import AddItemModal from './AddItemModal/AddItemModal';
import {
  getObjectLists,
  getSuitableLanguage,
  getWobjectNested,
  getLoadingFlag,
  getObject,
} from '../../reducers';
import { getLastPermlinksFromHash, getListItems, itemsList } from '../../helpers/wObjectHelper';
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

  useEffect(() => {
    const defaultSortBy = obj => (isEmpty(obj.sortCustom) ? 'recency' : 'custom');

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
              wObject.sortCustom,
            ),
          );
          setNestedWobj(wObject);
          setLoadingNestedWobject(false);
        });
      } else {
        setSortingBy(defaultSortBy(wobject));
        // eslint-disable-next-line no-use-before-define
        setLists(
          sortListItemsBy(
            itemsList(get(wobject, 'sortCustom', []), wobject),
            defaultSortBy(wobject),
            wobject.sortCustom,
          ),
        );
        setLoadingNestedWobject(false);
      }
    }
    return () => {
      setNestedWobj({});
    };
  }, [hash, wobject.author_permlink]);

  const handleAddItem = listItem => {
    const currentList = isEmpty(listItems) ? [listItem] : [...listItems, listItem];
    setLists(sortListItemsBy(currentList, 'recency'));
  };

  const handleSortChange = sortType => {
    const currentList =
      sortType === 'custom'
        ? itemsList(get(wobject, 'sortCustom', []), wobject)
        : getListItems(wobject);
    const sortOrder = wobject && wobject[objectFields.sorting];
    setSortingBy(sortType);
    setLists(sortListItemsBy(currentList, sortType, sortOrder));
  };

  const obj = isEmpty(wobjectNested) ? wobject : wobjectNested;
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
