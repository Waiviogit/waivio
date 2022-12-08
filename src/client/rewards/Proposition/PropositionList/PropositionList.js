import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { get, map, isEmpty } from 'lodash';
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
import PropositionNew from '../../../newRewards/reuseble/Proposition/Proposition';
import Campaing from '../../../newRewards/reuseble/Campaing';

const PropositionList = ({
  wobject,
  intl,
  catalogHandleSortChange,
  catalogSort,
  listItems,
  isLoadingFlag,
  location,
  isCatalogWrap,
  isCustomExist,
  wObj,
}) => {
  const isReviewPage = location.pathname === `/object/${get(wobject, 'author_permlink', '')}`;

  const getListRow = listItem => {
    if (listItem?.propositions)
      return listItem?.propositions.map(propos => (
        <PropositionNew
          key={listItem._id}
          proposition={{ ...propos, object: listItem, requiredObject: listItem.parent }}
          type={propos.reserved ? 'reserved' : ''}
        />
      ));

    if (listItem?.campaigns) {
      return <Campaing campain={{ object: listItem, ...listItem?.campaigns }} />;
    }

    const isList = listItem.object_type === OBJ_TYPE.LIST || listItem.type === OBJ_TYPE.LIST;
    const status = get(parseWobjectField(listItem, 'status'), 'title');

    if (statusNoVisibleItem.includes(status)) return null;

    const hash = createNewHash(listItem.author_permlink, location.hash);
    const path = hasType(listItem, 'page') ? `/object/${wobject.author_permlink}/page#${hash}` : '';

    let item;

    if (isList) {
      item = <CategoryItemView wObject={listItem} location={location} />;
    } else {
      item = <ObjectCardView wObject={listItem} path={path} inList />;
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

  return (
    <React.Fragment>
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
  catalogHandleSortChange: PropTypes.func,
  catalogSort: PropTypes.string.isRequired,
  isLoadingFlag: PropTypes.bool,
  listItems: PropTypes.shape(),
  location: PropTypes.shape().isRequired,
  isCustomExist: PropTypes.bool,
  wObj: PropTypes.shape().isRequired,
};

export default injectIntl(PropositionList);
