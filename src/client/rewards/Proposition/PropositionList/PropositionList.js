import React from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { get, map, isEmpty, isEqual } from 'lodash';
import { getObjectLists } from '../../../reducers';
// import PropositionListFromCatalog from './PropositionListFromCatalog';
// import DefaultPropositionList from './DefaultPropositionList';
import Proposition from '../Proposition';
import ObjectCardView from '../../../objectCard/ObjectCardView';
import Loading from '../../../components/Icon/Loading';
import CatalogBreadcrumb from '../../../object/Catalog/CatalogBreadcrumb/CatalogBreadcrumb';
import CatalogSorting from '../../../object/Catalog/CatalogSorting/CatalogSorting';
import OBJ_TYPE from '../../../object/const/objectTypes';
import { parseWobjectField } from '../../../helpers/wObjectHelper';
import { statusNoVisibleItem } from '../../../../common/constants/listOfFields';
import CategoryItemView from '../../../object/Catalog/CategoryItemView/CategoryItemView';

const PropositionList = ({
  allPropositions,
  wobject,
  currentProposition,
  discardProposition,
  assignPropositionHandler,
  intl,
  goToProducts,
  match,
  history,
  user,
  userName,
  loadingAssignDiscard,
  isAssign,
  isCatalogWrap,
  catalogHandleSortChange,
  catalogSort,
  listItems,
  isLoadingFlag,
  parentPermlink,
  location,
  allCurrentPropositions,
}) => {
  // let minReward;
  // let maxReward;
  // let rewardPrise;
  // let rewardMax;
  const forSave = {
    isCatalogWrap,
    parentPermlink,
  };
  console.log(forSave);
  // if (isCatalogWrap || parentPermlink) {
  //   minReward = allPropositions
  //     ? min(map(allPropositions, proposition => proposition.reward))
  //     : null;
  //   maxReward = allPropositions
  //     ? max(map(allPropositions, proposition => proposition.reward))
  //     : null;
  //   rewardPrise = minReward ? `${minReward.toFixed(2)} USD` : '';
  //   rewardMax = maxReward !== minReward ? `${maxReward.toFixed(2)} USD` : '';
  // } else {
  //   minReward = get(currentProposition, ['min_reward'], 0);
  //   maxReward = get(currentProposition, ['max_reward'], 0);
  //   rewardPrise = `${minReward.toFixed(2)} USD`;
  //   rewardMax = `${maxReward.toFixed(2)} USD`;
  // }

  const handleCurrentProposition = (currPropos, currWobject) => {
    const minReward = get(currPropos, ['min_reward'], 0);
    const maxReward = get(currPropos, ['max_reward'], 0);
    const rewardPrise = `${minReward.toFixed(2)} USD`;
    const rewardMax = `${maxReward.toFixed(2)} USD`;

    // console.log('minReward: ', minReward)
    // console.log('maxReward: ', maxReward)

    return (
      wobject &&
      isEmpty(wobject.parent) &&
      !isEmpty(currPropos) && (
        <div>
          <ObjectCardView wObject={currWobject} passedParent={currPropos} />
          <div
            className="Campaign__button"
            role="presentation"
            onClick={() => goToProducts(currWobject)}
          >
            <Button type="primary" size="large">
              {maxReward === minReward ? (
                <React.Fragment>
                  <span>
                    {intl.formatMessage({
                      id: 'rewards_details_earn',
                      defaultMessage: 'Earn',
                    })}
                  </span>
                  <span>
                    <span className="fw6 ml1">{rewardPrise}</span>
                    <Icon type="right" />
                  </span>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <span>
                    {intl.formatMessage({
                      id: 'rewards_details_earn_up_to',
                      defaultMessage: 'Earn up to',
                    })}
                  </span>
                  <span>
                    <span className="fw6 ml1">{`${rewardMax}`}</span>
                    <Icon type="right" />
                  </span>
                </React.Fragment>
              )}
            </Button>
          </div>
        </div>
      )
    );
  };

  // const minReward = get(currentProposition, ['min_reward'], 0);
  // const maxReward = get(currentProposition, ['max_reward'], 0);
  // const rewardPrise = `${minReward.toFixed(2)} USD`;
  // const rewardMax = `${maxReward.toFixed(2)} USD`;

  const isReviewPage = location.pathname === `/object/${get(wobject, 'author_permlink', '')}`;

  // const data = {
  //   intl,
  //   wobject,
  //   currentProposition,
  //   goToProducts,
  //   maxReward,
  //   minReward,
  //   rewardPrise,
  //   rewardMax,
  //   allPropositions,
  //   match,
  //   assignPropositionHandler,
  //   discardProposition,
  //   userName,
  //   loadingAssignDiscard,
  //   isAssign,
  //   user,
  //   history,
  //   catalogHandleSortChange,
  //   catalogSort,
  //   listItems,
  //   isLoadingFlag,
  //   isReviewPage,
  // };

  const getListRow = listItem => {
    const isList = listItem.object_type === OBJ_TYPE.LIST || listItem.type === OBJ_TYPE.LIST;
    const status = get(parseWobjectField(listItem, 'status'), 'title');

    if (statusNoVisibleItem.includes(status)) return null;
    let item;
    if (isList) {
      item = <CategoryItemView wObject={listItem} location={location} />;
    } else {
      map(allCurrentPropositions, currPropos => {
        const objPermlink = get(currPropos, 'required_object.author_permlink', {});
        const currListItemPermlink = get(listItem, 'author_permlink', {});

        console.log('objPermlink: ', objPermlink);
        console.log('currListItemPermlink: ', currListItemPermlink);
        console.log('allCurrentPropositions: ', allCurrentPropositions);

        if (isEqual(objPermlink, currListItemPermlink)) {
          item = handleCurrentProposition(currPropos, listItem);
        } else {
          item = <ObjectCardView wObject={listItem} inList />;
        }
      });

      // item = <ObjectCardView wObject={listItem} inList />;
    }
    return !isReviewPage && <div key={`category-${listItem.author_permlink}`}>{item}</div>;
  };

  const getPropositionObjects = () => {
    const arr = [];
    const propositionObjects = get(allPropositions, '[0]objects', []);
    propositionObjects.forEach(propos => {
      const currentProposObj = get(propos, 'object', {});
      arr.push(get(currentProposObj, '_id'));
    });
    return arr;
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

    return map(listItems, listItem => {
      const proposObj = getPropositionObjects();
      return !proposObj.includes(get(listItem, '_id')) && getListRow(listItem);
    });
  };

  const renderPropositions = () =>
    map(allPropositions, propos =>
      map(propos.objects, wobj => (
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
      )),
    );
  // console.log('allPropositions: ', allPropositions);
  // console.log('currentProposition: ', currentProposition)
  // console.log('wobject: ', wobject)
  return (
    <React.Fragment>
      {handleCurrentProposition(currentProposition, wobject)}
      {isLoadingFlag ? (
        <Loading />
      ) : (
        <React.Fragment>
          {!isReviewPage && (
            <React.Fragment>
              <div className="CatalogWrap__breadcrumb">
                <CatalogBreadcrumb intl={intl} wobject={wobject} />
              </div>
              <div className="CatalogWrap__sort">
                <CatalogSorting
                  sort={catalogSort}
                  currWobject={wobject}
                  handleSortChange={catalogHandleSortChange}
                />
              </div>
              {!isReviewPage && renderPropositions()}
              <div className="CatalogWrap">
                <div>{getMenuList()}</div>
              </div>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
    // <React.Fragment>
    //   <PropositionListFromCatalog {...data} />
    //   <div>-----------------------------------------------------------------</div>
    //   <DefaultPropositionList {...data} />
    // </React.Fragment>
  );

  // return (
  //   <React.Fragment>
  //     {isCatalogWrap || parentPermlink ? (
  //       <PropositionListFromCatalog {...data} />
  //     ) : (
  //       <DefaultPropositionList {...data} />
  //     )}
  //   </React.Fragment>
  // );
};

PropositionList.propTypes = {
  intl: PropTypes.shape().isRequired,
  wobject: PropTypes.shape().isRequired,
  allPropositions: PropTypes.arrayOf(PropTypes.shape()),
  allCurrentPropositions: PropTypes.arrayOf(PropTypes.shape()),
  currentProposition: PropTypes.arrayOf(PropTypes.shape()),
  discardProposition: PropTypes.func,
  assignPropositionHandler: PropTypes.func,
  goToProducts: PropTypes.func,
  match: PropTypes.shape(),
  history: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
  userName: PropTypes.string.isRequired,
  loadingAssignDiscard: PropTypes.bool,
  isAssign: PropTypes.bool,
  isCatalogWrap: PropTypes.bool,
  catalogHandleSortChange: PropTypes.func,
  catalogSort: PropTypes.string,
  isLoadingFlag: PropTypes.bool,
  parentPermlink: PropTypes.string,
  // isGetNested: PropTypes.bool,
  listItems: PropTypes.shape(),
  location: PropTypes.shape().isRequired,
};

PropositionList.defaultProps = {
  allPropositions: [],
  allCurrentPropositions: [],
  currentProposition: [],
  match: {},
  user: {},
  loadingAssignDiscard: false,
  isAssign: false,
  goToProducts: () => {},
  discardProposition: () => {},
  assignPropositionHandler: () => {},
  isCatalogWrap: false,
  catalogHandleSortChange: () => {},
  catalogSort: '',
  isLoadingFlag: false,
  parentPermlink: '',
  isGetNested: false,
  listItems: [],
};

export default connect(state => ({
  listItems: getObjectLists(state),
}))(injectIntl(PropositionList));
