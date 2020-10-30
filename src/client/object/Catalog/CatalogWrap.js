import { withRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { get, isEmpty } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { sortListItemsBy } from '../wObjectHelper';
import { objectFields } from '../../../common/constants/listOfFields';
import AddItemModal from './AddItemModal/AddItemModal';
import {
  getIsNestedWobject,
  getObjectLists,
  getSuitableLanguage,
  getWobjectNested,
} from '../../reducers';
import { getLastPermlinksFromHash } from '../../helpers/wObjectHelper';
import PropositionListContainer from '../../rewards/Proposition/PropositionList/PropositionListContainer';
import { clearIsGetNestedWobject, setListItems, setNestedWobject } from '../wobjActions';
import { getObject } from '../../../waivioApi/ApiClient';
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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(CatalogWrap)));
