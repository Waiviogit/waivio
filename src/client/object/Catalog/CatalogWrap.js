import { withRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { compose } from 'redux';
import { get, isEmpty, map, filter, max, min, some } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { sortListItemsBy } from '../wObjectHelper';
import { objectFields, statusNoVisibleItem } from '../../../common/constants/listOfFields';
import OBJ_TYPE from '../const/objectTypes';
import AddItemModal from './AddItemModal/AddItemModal';
import { getObjectLists, getSuitableLanguage, getWobjectNested } from '../../reducers';
import ObjectCardView from '../../objectCard/ObjectCardView';
import CategoryItemView from './CategoryItemView/CategoryItemView';
import { getPermLink, hasType, parseWobjectField } from '../../helpers/wObjectHelper';
import BodyContainer from '../../containers/Story/BodyContainer';
import Loading from '../../components/Icon/Loading';
import * as ApiClient from '../../../waivioApi/ApiClient';
import Campaign from '../../rewards/Campaign/Campaign';
import CatalogSorting from './CatalogSorting/CatalogSorting';
import CatalogBreadcrumb from './CatalogBreadcrumb/CatalogBreadcrumb';
import PropositionListContainer from '../../rewards/Proposition/PropositionList/PropositionListContainer';
import { getObjectCreator, setListItems, setNestedWobject } from '../wobjActions';
import './CatalogWrap.less';
import { getObject } from '../../../waivioApi/ApiClient';

const CatalogWrap = props => {
  const { userName, wobjectNested, listItems, locale } = props;
  const dispatch = useDispatch();

  const [loadingPropositions, setLoadingPropositions] = useState(true);
  const [propositions, setPropositions] = useState([]);
  const [sort, setSorting] = useState('recency');

  const getPropositions = ({ username, match, requiredObject, sorting }) => {
    setLoadingPropositions(true);
    ApiClient.getPropositions({
      username,
      match,
      requiredObject,
      sort: 'reward',
      locale,
    }).then(data => {
      setPropositions(data.campaigns);
      setSorting(sorting);
      setLoadingPropositions(false);
    });
  };

  useEffect(() => {
    const {
      wobject,
      match,
      location: { hash },
    } = props;

    if (!isEmpty(wobject)) {
      if (hash) {
        const pathUrl = getPermLink(hash);
        getObject(pathUrl, userName, locale).then(wObject => {
          const requiredObject = get(wObject, ['parent', 'author_permlink']);
          if (requiredObject) {
            getPropositions({ userName, match, requiredObject, sort });
          } else {
            setLoadingPropositions(false);
          }
          dispatch(setListItems(wObject.listItems));
          dispatch(setNestedWobject(wObject));
        });
      } else {
        const requiredObject = get(wobject, ['parent', 'author_permlink']);
        dispatch(setListItems(wobject.listItems));
        getPropositions({ userName, match, requiredObject, sort });
      }
    }
  }, [props.location.hash, props.wobject.author_permlink, userName]);

  const handleAddItem = listItem => {
    const currentList = isEmpty(listItems) ? [listItem] : [...listItems, listItem];
    dispatch(setListItems(sortListItemsBy(currentList, 'recency')));
  };

  /**
   *
   * @param propositionsObject
   * @param listItem
   */

  const renderProposition = (propositionsObject, listItem) =>
    map(propositionsObject, proposition =>
      map(
        filter(
          proposition.objects,
          object => get(object, ['object', 'author_permlink']) === listItem.author_permlink,
        ),
        wobj => <PropositionListContainer wobject={wobj.object} userName={userName} />,
      ),
    );

  const renderCampaign = propositionsObject => {
    const minReward = propositionsObject
      ? min(map(propositionsObject, proposition => proposition.reward))
      : null;
    const rewardPriceCatalogWrap = minReward ? `${minReward.toFixed(2)} USD` : '';
    const maxReward = propositionsObject
      ? max(map(propositionsObject, proposition => proposition.reward))
      : null;
    const rewardMaxCatalogWrap = maxReward !== minReward ? `${maxReward.toFixed(2)} USD` : '';

    return (
      <Campaign
        proposition={propositionsObject[0]}
        filterKey="all"
        rewardPricePassed={!rewardMaxCatalogWrap ? rewardPriceCatalogWrap : null}
        rewardMaxPassed={rewardMaxCatalogWrap || null}
        key={`${propositionsObject[0].required_object.author_permlink}${propositionsObject[0].required_object.createdAt}`}
        userName={userName}
      />
    );
  };

  const getListRow = (listItem, objects) => {
    const isList = listItem.object_type === OBJ_TYPE.LIST || listItem.type === OBJ_TYPE.LIST;
    const isMatchedPermlinks = some(objects, object => object.includes(listItem.author_permlink));
    const status = get(parseWobjectField(listItem, 'status'), 'title');

    if (statusNoVisibleItem.includes(status)) return null;

    let item;
    if (isList) {
      item = <CategoryItemView wObject={listItem} location={location} />;
    } else if (objects.length && isMatchedPermlinks) {
      item = renderProposition(propositions, listItem);
    } else {
      item = <ObjectCardView wObject={listItem} inList />;
    }
    return <div key={`category-${listItem.author_permlink}`}>{item}</div>;
  };

  const getMenuList = () => {
    let listRow;
    if (propositions) {
      if (isEmpty(listItems)) {
        return (
          <div>
            {props.intl.formatMessage({
              id: 'emptyList',
              defaultMessage: 'This list is empty',
            })}
          </div>
        );
      }

      const campaignObjects = map(propositions, item =>
        map(item.objects, obj => get(obj, ['object', 'author_permlink'])),
      );
      listRow = map(listItems, listItem => getListRow(listItem, campaignObjects));
    }
    return listRow;
  };

  const { isEditMode, wobject, intl } = props;

  const handleSortChange = sortType => {
    const sortOrder = wobject && wobject[objectFields.sorting];
    setSorting(sortType);
    dispatch(setListItems(sortListItemsBy(listItems, sortType, sortOrder)));
  };

  const obj = isEmpty(getWobjectNested) ? wobject : getWobjectNested;

  return (
    <div>
      {!hasType(wobjectNested, OBJ_TYPE.PAGE) || !hasType(wobject, OBJ_TYPE.PAGE) ? (
        <React.Fragment>
          {!isEmpty(propositions) && renderCampaign(propositions)}
          {isEditMode && (
            <div className="CatalogWrap__add-item">
              <AddItemModal wobject={obj} onAddItem={handleAddItem} />
            </div>
          )}
          {loadingPropositions || isEmpty(wobject) ? (
            <Loading />
          ) : (
            <React.Fragment>
              <div className="CatalogWrap__breadcrumb">
                <CatalogBreadcrumb intl={intl} wobject={wobject} />
              </div>
              <div className="CatalogWrap__sort">
                <CatalogSorting
                  sort={sort}
                  currWobject={wobject}
                  handleSortChange={handleSortChange}
                />
              </div>
              <div className="CatalogWrap">
                <div>{getMenuList()}</div>
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        <BodyContainer full body={wobjectNested.pageContent} />
      )}
    </div>
  );
};

CatalogWrap.propTypes = {
  intl: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  wobject: PropTypes.shape(),
  wobjectNested: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
  userName: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  listItems: PropTypes.shape({}).isRequired,
};

CatalogWrap.defaultProps = {
  wobject: {},
  isEditMode: false,
  userName: '',
  locale: '',
  getObjectCreator: () => {},
  listItems: [],
};

const mapStateToProps = state => ({
  listItems: getObjectLists(state),
  wobjectNested: getWobjectNested(state),
  locale: getSuitableLanguage(state),
});

const mapDispatchToProps = {
  setListItems,
  getObjectCreator,
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl,
  withRouter,
)(CatalogWrap);
