import React from 'react';
import { Button, Icon } from 'antd';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { get, map, max, min, isEmpty } from 'lodash';
import { getObjectLists } from '../../../reducers';
// import PropositionListFromCatalog from './PropositionListFromCatalog';
// import DefaultPropositionList from './DefaultPropositionList';
import Proposition from '../Proposition';
import ObjectCardView from '../../../objectCard/ObjectCardView';

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
  // catalogHandleSortChange,
  // catalogSort,
  // listItems,
  // isLoadingFlag,
  parentPermlink,
  // location,
}) => {
  let minReward;
  let maxReward;
  let rewardPrise;
  let rewardMax;

  if (isCatalogWrap || parentPermlink) {
    minReward = allPropositions
      ? min(map(allPropositions, proposition => proposition.reward))
      : null;
    maxReward = allPropositions
      ? max(map(allPropositions, proposition => proposition.reward))
      : null;
    rewardPrise = minReward ? `${minReward.toFixed(2)} USD` : '';
    rewardMax = maxReward !== minReward ? `${maxReward.toFixed(2)} USD` : '';
  } else {
    minReward = get(currentProposition, ['min_reward'], 0);
    maxReward = get(currentProposition, ['max_reward'], 0);
    rewardPrise = `${minReward.toFixed(2)} USD`;
    rewardMax = `${maxReward.toFixed(2)} USD`;
  }

  // const isReviewPage = location.pathname === `/object/${get(wobject, 'author_permlink', '')}`;

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

  console.log('allPropositions: ', allPropositions);
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

  return (
    <React.Fragment>
      {wobject && isEmpty(wobject.parent) && !isEmpty(currentProposition) && (
        <div>
          <ObjectCardView wObject={wobject} passedParent={currentProposition} />
          <div className="Campaign__button" role="presentation" onClick={goToProducts}>
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
      )}
      {renderPropositions()}
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
  parentPermlink: PropTypes.string,
  // catalogHandleSortChange: PropTypes.func,
  // catalogSort: PropTypes.string,
  // isLoadingFlag: PropTypes.bool,
  // isGetNested: PropTypes.bool,
  // listItems: PropTypes.shape(),
  // location: PropTypes.shape().isRequired,
};

PropositionList.defaultProps = {
  allPropositions: [],
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
