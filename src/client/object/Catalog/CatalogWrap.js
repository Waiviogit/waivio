import { message } from 'antd';
import { withRouter } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { compose } from 'redux';
import { get, isEmpty, map, filter, max, min, some } from 'lodash';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { sortListItemsBy } from '../wObjectHelper';
import { objectFields, statusNoVisibleItem } from '../../../common/constants/listOfFields';
import OBJ_TYPE from '../const/objectTypes';
import AddItemModal from './AddItemModal/AddItemModal';
import { getObject } from '../../../waivioApi/ApiClient';
import {
  getSuitableLanguage,
  getAuthenticatedUserName,
  getWobjectBreadCrumbs,
} from '../../reducers';
import ObjectCardView from '../../objectCard/ObjectCardView';
import CategoryItemView from './CategoryItemView/CategoryItemView';
import { getPermLink, hasType, parseWobjectField } from '../../helpers/wObjectHelper';
import BodyContainer from '../../containers/Story/BodyContainer';
import Loading from '../../components/Icon/Loading';
import * as apiConfig from '../../../waivioApi/config.json';
import { assignProposition, declineProposition } from '../../user/userActions';
import * as ApiClient from '../../../waivioApi/ApiClient';
import Proposition from '../../rewards/Proposition/Proposition';
import Campaign from '../../rewards/Campaign/Campaign';
import CatalogSorting from './CatalogSorting/CatalogSorting';
import CatalogBreadcrumb from './CatalogBreadcrumb/CatalogBreadcrumb';
import { setWobjectForBreadCrumbs } from '../wobjActions';

import './CatalogWrap.less';

const CatalogWrap = props => {
  const dispatch = useDispatch();

  const locale = useSelector(getSuitableLanguage);
  const userName = useSelector(getAuthenticatedUserName);
  const currentWobject = useSelector(getWobjectBreadCrumbs);

  const [loadingAssignDiscard, setLoadingAssignDiscard] = useState(false);
  const [loadingPropositions, setLoadingPropositions] = useState(true);
  const [propositions, setPropositions] = useState([]);
  const [sort, setSorting] = useState('recency');
  const [isAssign, setIsAssign] = useState(false);
  const [listItems, setListItems] = useState([]);

  const getPropositions = ({ match, requiredObject, sorting }) => {
    setLoadingPropositions(true);
    ApiClient.getPropositions({
      userName,
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
            getPropositions({ match, requiredObject, sort });
          }
          setListItems(wObject.listItems);
          dispatch(setWobjectForBreadCrumbs(wObject));
        });
      } else {
        const requiredObject = wobject.listItems
          ? get(wobject, ['listItems', '0', 'parent', 'author_permlink'])
          : null;
        setListItems(wobject.listItems);
        getPropositions({ userName, match, requiredObject, sort });
      }
    }
  }, [props.location.hash, props.wobject, userName]);

  const handleAddItem = listItem => {
    const currentList = isEmpty(listItems) ? [listItem] : [...listItems, listItem];
    setListItems(sortListItemsBy(currentList, 'recency'));
  };

  const updateProposition = (propsId, isassign, objPermlink, companyAuthor) => {
    propositions.map(proposition => {
      const updatedProposition = proposition;
      const propositionId = get(updatedProposition, '_id');

      if (propositionId === propsId) {
        updatedProposition.objects.forEach((object, index) => {
          if (object.object.author_permlink === objPermlink) {
            updatedProposition.objects[index].assigned = isassign;
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

  /**
   *
   * @param companyAuthor
   * @param companyPermlink
   * @param resPermlink
   * @param objPermlink
   * @param companyId
   * @param primaryObjectName
   * @param secondaryObjectName
   * @param amount
   * @param proposition
   * @param proposedWobj
   * @param username
   * @param currencyId
   */
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
    username,
    currencyId,
  }) => {
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';

    setLoadingAssignDiscard(true);

    dispatch(
      assignProposition({
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
        username,
        currencyId,
      }),
    )
      .then(() => {
        message.success(
          props.intl.formatMessage({
            id: 'assigned_successfully_update',
            defaultMessage: 'Assigned successfully. Your new reservation will be available soon.',
          }),
        );

        setPropositions(updateProposition(companyId, true, objPermlink, companyAuthor));

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

    dispatch(
      declineProposition({
        companyAuthor,
        companyPermlink,
        companyId,
        objPermlink,
        unreservationPermlink,
        reservationPermlink,
      }),
    )
      .then(() => {
        const updatedPropositions = updateProposition(companyId, false, objPermlink);
        setPropositions(updatedPropositions);
        setLoadingAssignDiscard(false);
        setIsAssign(false);
      })
      .catch(e => {
        message.error(e.error_description);
        setLoadingAssignDiscard(false);
        setIsAssign(true);
      });
  };

  const renderProposition = (propositionsObject, listItem) =>
    map(propositionsObject, proposition =>
      map(
        filter(
          proposition.objects,
          object => get(object, ['object', 'author_permlink']) === listItem.author_permlink,
        ),
        wobj =>
          wobj.object &&
          wobj.object.author_permlink && (
            <Proposition
              proposition={propositionsObject[0]}
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
      item = <ObjectCardView wObject={listItem} />;
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
    setListItems(sortListItemsBy(listItems, sortType, sortOrder));
  };

  const obj = isEmpty(currentWobject) ? wobject : currentWobject;

  return (
    <div>
      {!hasType(wobject, OBJ_TYPE.PAGE) && (
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
      )}
      <BodyContainer full body={wobject.pageContent} />
    </div>
  );
};

CatalogWrap.propTypes = {
  intl: PropTypes.shape().isRequired,
  location: PropTypes.shape().isRequired,
  match: PropTypes.shape().isRequired,
  wobject: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
  isEditMode: PropTypes.bool.isRequired,
};

CatalogWrap.defaultProps = {
  wobject: {},
  locale: 'en-US',
  userName: '',
};

export default compose(injectIntl, withRouter)(CatalogWrap);
