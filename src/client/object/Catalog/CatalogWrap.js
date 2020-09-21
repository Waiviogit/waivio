import {message} from 'antd';
import {withRouter} from 'react-router-dom';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import {compose} from "redux";
import {get, isEmpty, map, uniq, filter, max, min, some, size} from 'lodash';
import {injectIntl} from 'react-intl';
import PropTypes from 'prop-types';
import {
  getFieldWithMaxWeight,
  getListItems,
  sortListItemsBy,
  getListSorting,
} from '../wObjectHelper';

import {objectFields, statusNoVisibleItem} from '../../../common/constants/listOfFields';
import OBJ_TYPE from '../const/objectTypes';
import AddItemModal from './AddItemModal/AddItemModal';
import {getObject} from '../../../waivioApi/ApiClient';
import * as wobjectActions from '../../../client/object/wobjectsActions';
import {
  getSuitableLanguage,
  getAuthenticatedUserName
} from '../../reducers';

import ObjectCardView from '../../objectCard/ObjectCardView';
import CategoryItemView from './CategoryItemView/CategoryItemView';
import {getPermLink, hasType, parseWobjectField} from '../../helpers/wObjectHelper';
import BodyContainer from '../../containers/Story/BodyContainer';
import Loading from '../../components/Icon/Loading';
import * as apiConfig from '../../../waivioApi/config.json';

import {
  assignProposition,
  declineProposition
} from '../../user/userActions';

import * as ApiClient from '../../../waivioApi/ApiClient';
import Proposition from '../../rewards/Proposition/Proposition';
import Campaign from '../../rewards/Campaign/Campaign';

import './CatalogWrap.less';
import CatalogSorting from "./CatalogSorting/CatalogSorting";

const CatalogWrap = (props) => {
  const dispatch = useDispatch();

  const locale = useSelector((state) => getSuitableLanguage(state));
  const userName = useSelector((state) => getAuthenticatedUserName(state));

  const [loadingAssignDiscard, setLoadingAssignDiscard] = useState(false);
  const [loadingPropositions, setLoadingPropositions] = useState(false);
  const [propositions, setPropositions] = useState([]);
  const [sort, setSorting] = useState('recency');
  const [isAssign, setIsAssign] = useState(false);
  const [listItems, setListItems] = useState([]);

  const getPropositions = ({userName, match, requiredObject, sort}) => {
    setLoadingPropositions(true);
    ApiClient.getPropositions({
      userName,
      match,
      requiredObject,
      sort: 'reward',
      locale,
    }).then(data => {
      setPropositions(data.campaigns);
      setSorting(sort);
      setLoadingPropositions(false);
    });
  };

  // const sortingWobject = (wobject) => {
  //   let sorting = {};
  //   let sortedItems = [];
  //   const items = getListItems(wobject);
  //
  //   if (size(items)) {
  //     sorting = getListSorting(wobject);
  //     sortedItems = sortListItemsBy(items, sorting.type, sorting.order);
  //   }
  //   setListItems(sortedItems);
  //   setSorting(sorting.type)
  // }


  useEffect(() => {
    const {wobject, match, location: hash} = props;
    const currentHash = getPermLink(hash);

    if (currentHash) {
      getObject(currentHash, userName, locale).then(wObject => {
        const requiredObject = wObject.author_permlink;
        if (requiredObject) {
          getPropositions({userName, match, requiredObject, sort});
        }
        setListItems(wObject.listItems);
      });
    }
    if (wobject.object_type === OBJ_TYPE.LIST) {
      setListItems(wobject.listItems);
    }
  }, [props.location.hash]);


  const handleAddItem = listItem => {
    const {wobject} = props;
    setListItems(sortListItemsBy([...listItems, listItem], 'recency'));
    if (wobject.object_type === OBJ_TYPE.LIST) {
      dispatch(wobjectActions.addListItem(listItem))
    }
  };

  const handleSortChange = sort => {
    const {wobject} = props;
    const sortOrder = wobject && wobject[objectFields.sorting];
    setSorting(sort);
    setListItems(sortListItemsBy(listItems, sort, sortOrder));
  };

  const updateProposition = (propsId, isAssign, objPermlink, companyAuthor) => {
    propositions.map(proposition => {
      const updatedProposition = proposition;
      const propositionId = get(updatedProposition, '_id');

      if (propositionId === propsId) {
        updatedProposition.objects.forEach((object, index) => {
          if (object.object.author_permlink === objPermlink) {
            updatedProposition.objects[index].assigned = isAssign;
          } else {
            updatedProposition.objects[index].assigned = null;
          }
        });
      }

      if (updatedProposition.guide.name === companyAuthor && propositionId !== propsId) {
        updatedProposition.isReservedSiblingObj = true;
      }
      return updatedProposition;
    });
  };


  const assignPropositionHandler = ({
                                      companyAuthor,
                                      companyPermlink,
                                      resPermlink,
                                      objPermlink,
                                      companyId,
                                      primaryObjectName,
                                      secondaryObjectName,
                                      amount,
                                      proposition,
                                      proposedWobj,
                                      userName,
                                      currencyId,
                                    }) => {
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';

    setLoadingAssignDiscard(true);

    return dispatch(assignProposition({
      companyAuthor,
      companyPermlink,
      objPermlink,
      resPermlink,
      appName,
      primaryObjectName,
      secondaryObjectName,
      amount,
      proposition,
      proposedWobj,
      userName,
      currencyId,
    })).then(() => {
      message.success(
        props.intl.formatMessage({
          id: 'assigned_successfully_update',
          defaultMessage: 'Assigned successfully. Your new reservation will be available soon.',
        }),
      );

      const updatedPropositions = updateProposition(
        companyId,
        true,
        objPermlink,
        companyAuthor,
      );

      setPropositions(updatedPropositions);
      setLoadingAssignDiscard(false);
      setIsAssign(true);
    })
      .catch(e => {
        setLoadingAssignDiscard(false);
        setIsAssign(false);
        throw e;
      });
  };

  const discardProposition = ({
                                companyAuthor,
                                companyPermlink,
                                companyId,
                                objPermlink,
                                unreservationPermlink,
                                reservationPermlink,
                              }) => {

    setLoadingAssignDiscard(true);

    return dispatch(declineProposition({
      companyAuthor,
      companyPermlink,
      companyId,
      objPermlink,
      unreservationPermlink,
      reservationPermlink,
    })).then(() => {
      const updatedPropositions = updateProposition(companyId, false, objPermlink);
      setPropositions(updatedPropositions);
      setLoadingAssignDiscard(false);
      setIsAssign(false);
    }).catch(e => {
      message.error(e.error_description);
      setLoadingAssignDiscard(false);
      setIsAssign(true);
    });
  };

  const renderProposition = (propositions, listItem) =>
    map(propositions, proposition =>
      map(
        filter(
          proposition.objects,
          object => get(object, ['object', 'author_permlink']) === listItem.author_permlink,
        ),
        wobj =>
          wobj.object &&
          wobj.object.author_permlink && (
            <Proposition
              proposition={proposition}
              wobj={wobj.object}
              wobjPrice={wobj.reward}
              assignCommentPermlink={wobj.permlink}
              assignProposition={assignPropositionHandler}
              discardProposition={discardProposition}
              authorizedUserName={userName}
              loading={loadingAssignDiscard}
              key={`${wobj.object.author_permlink}`}
              assigned={wobj.assigned}
              history={props.history}
              isAssign={isAssign}
              match={props.match}
            />
          ),
      ),
    );

  const renderCampaign = propositions => {
    const minReward = propositions
      ? min(map(propositions, proposition => proposition.reward))
      : null;
    const rewardPriceCatalogWrap = minReward ? `${minReward.toFixed(2)} USD` : '';
    const maxReward = propositions
      ? max(map(propositions, proposition => proposition.reward))
      : null;
    const rewardMaxCatalogWrap = maxReward !== minReward ? `${maxReward.toFixed(2)} USD` : '';

    return (
      <Campaign
        proposition={propositions[0]}
        filterKey="all"
        rewardPricePassed={!rewardMaxCatalogWrap ? rewardPriceCatalogWrap : null}
        rewardMaxPassed={rewardMaxCatalogWrap || null}
        key={`${propositions[0].required_object.author_permlink}${propositions[0].required_object.createdAt}`}
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
      item = <CategoryItemView wObject={listItem} location={location}/>;
    } else if (objects.length && isMatchedPermlinks) {
      item = renderProposition(propositions, listItem);
    } else {
      item = <ObjectCardView wObject={listItem} passedParent={props.wobject}/>;
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

      const campaignObjects = map(propositions, item => map(item.objects, obj => get(obj, ['object', 'author_permlink'])));
      listRow = map(listItems, listItem => getListRow(listItem, campaignObjects));
    }
    return listRow;
  };

  const {isEditMode, wobject} = props;

  // const itemsIdsToOmit = uniq([
  //   ...listItems.map(item => item.id)
  // ]);

  return (
    <div>
      {
        !hasType(wobject, OBJ_TYPE.PAGE) && (
          <React.Fragment>
            {
              !isEmpty(propositions) && renderCampaign(propositions)
            }
            {isEditMode && (
              <div className="CatalogWrap__add-item">
                <AddItemModal
                  wobject={wobject}
                  onAddItem={handleAddItem}
                />
              </div>
            )}
            {loadingPropositions ? (
              <Loading/>
            ) : (
              <React.Fragment>
                <div className="CatalogWrap__sort">
                  <CatalogSorting sort={sort} currWobject={wobject} handleSortChange={handleSortChange}/>
                </div>
                <div className="CatalogWrap">
                  <div>{getMenuList()}</div>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      <BodyContainer full body={getFieldWithMaxWeight(wobject, objectFields.pageContent)}/>
    </div>
  );
};

CatalogWrap.propTypes = {
  intl: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  locale: PropTypes.string,
  addItemToWobjStore: PropTypes.func.isRequired,
  wobject: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
  userName: PropTypes.string,
  assignProposition: PropTypes.func.isRequired,
  declineProposition: PropTypes.func.isRequired,
};

CatalogWrap.defaultProps = {
  wobject: {},
  locale: 'en-US',
  userName: '',
};

export default compose(
  injectIntl,
  withRouter
)(CatalogWrap);
