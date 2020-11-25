import { get, isEmpty, isEqual, map } from 'lodash';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { message } from 'antd';
import PropTypes from 'prop-types';

import Proposition from '../../rewards/Proposition/Proposition';
import PropositionMainObjectCard from '../../rewards/Proposition/PropositionMainObjectCard';
import * as apiConfig from '../../../waivioApi/config.json';
import {
  getAuthenticatedUser,
  getLocale,
  getObjectLists,
  getWobjProposition,
} from '../../reducers';
import { assignProposition, declineProposition } from '../../user/userActions';
import ObjectCardView from '../../objectCard/ObjectCardView';
import { getWobjectPropositions } from '../wobjActions';

const WobjectsProposition = ({
  currWobject,
  wobject,
  match,
  userName,
  locale,
  user,
  assignPropos,
  declinePropos,
  intl,
  listItems,
  listItem,
  getCurrWobjProposition,
  propositions,
}) => {
  const [loadingAssignDiscard, setLoadingAssignDiscard] = useState(false);
  const [isAssign, setIsAssign] = useState(false);
  const parentPermlink = get(wobject, 'parent.author_permlink', '');
  const primaryObject = match.params.name;
  const requiredObject = parentPermlink || get(wobject, ['parent']);
  const currentProposition = propositions[0];

  useEffect(() => {
    if (wobject && userName) {
      const reqData = {
        userName,
        match,
        locale,
      };

      if (isEmpty(wobject.parent)) {
        reqData.requiredObject = primaryObject;
      } else {
        reqData.requiredObject = requiredObject;
      }

      getCurrWobjProposition(reqData, primaryObject);
    }
  }, [wobject.author_permlink, userName, listItems]);

  const assignPropositionHandler = ({
    companyAuthor,
    companyPermlink,
    resPermlink,
    objPermlink,
    primaryObjectName,
    secondaryObjectName,
    amount,
    // eslint-disable-next-line no-shadow
    proposition,
    proposedWobj,
    username,
    currencyId,
  }) => {
    const appName = apiConfig[process.env.NODE_ENV].appName || 'waivio';
    setLoadingAssignDiscard(true);
    return assignPropos({
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
      userName: username,
      currencyId,
    })
      .then(() => {
        message.success(
          intl.formatMessage({
            id: 'assigned_successfully_update',
            defaultMessage: 'Assigned successfully. Your new reservation will be available soon.',
          }),
        );

        setLoadingAssignDiscard(false);
        setIsAssign(true);

        return { isAssign: true };
      })
      .catch(e => {
        setLoadingAssignDiscard(false);
        setIsAssign(false);
        throw e;
      });
  };

  const goToProducts = wobj => {
    const permlink = get(wobj, 'author_permlink');

    history.push(`/rewards/all/${permlink}`);
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
    return declinePropos({
      companyAuthor,
      companyPermlink,
      companyId,
      objPermlink,
      unreservationPermlink,
      reservationPermlink,
    })
      .then(() => {
        setLoadingAssignDiscard(false);
        setIsAssign(true);

        return { isAssign: false };
      })
      .catch(e => {
        message.error(e.error_description);
        setLoadingAssignDiscard(false);
        setIsAssign(true);
      });
  };

  const activePropos = () => {
    if (!isEmpty(currWobject.parent)) {
      if (isEmpty(propositions)) return null;
      const filteredPropos = propositions.filter(
        prop =>
          get(prop, ['objects', '0', 'object', 'author_permlink']) === currWobject.author_permlink,
      );

      return map(filteredPropos, propos => {
        if (!isEmpty(propos)) {
          return (
            <Proposition
              proposition={propos}
              wobj={wobject}
              wobjPrice={wobject.reward}
              assignCommentPermlink={wobject.permlink}
              assignProposition={assignPropositionHandler}
              discardProposition={discardProposition}
              authorizedUserName={userName}
              loading={loadingAssignDiscard}
              key={`${wobject.author_permlink}`}
              assigned={wobject.assigned}
              history={history}
              isAssign={isAssign}
              match={match}
              user={user}
            />
          );
        }

        return null;
      });
    }

    if (isEmpty(currentProposition)) return null;

    const minReward = get(currentProposition, ['min_reward'], 0);
    const maxReward = get(currentProposition, ['max_reward'], 0);
    const rewardPrise = `${minReward.toFixed(2)} USD`;
    const rewardMax = `${maxReward.toFixed(2)} USD`;

    return (
      <PropositionMainObjectCard
        intl={intl}
        wobject={currWobject}
        currentProposition={currentProposition}
        goToProducts={goToProducts}
        maxReward={maxReward}
        minReward={minReward}
        rewardPrise={rewardPrise}
        rewardMax={rewardMax}
      />
    );
  };

  return map(propositions, currPropos => {
    const objPermlink = get(currPropos, 'required_object.author_permlink', {});
    const currListItemPermlink = get(listItem, 'author_permlink', {});

    if (isEqual(objPermlink, currListItemPermlink)) {
      return activePropos();
    }

    return <ObjectCardView wObject={listItem} inList />;
  });
};

WobjectsProposition.propTypes = {
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  locale: PropTypes.string,
  match: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
  assignPropos: PropTypes.func,
  getCurrWobjProposition: PropTypes.func,
  declinePropos: PropTypes.func,
  listItems: PropTypes.shape(),
  proposition: PropTypes.shape(),
  currWobject: PropTypes.shape({
    parent: PropTypes.string,
    author_permlink: PropTypes.string,
  }),
};

WobjectsProposition.defaultProps = {
  locale: 'en-US',
  match: {},
  user: {},
  assignPropos: () => {},
  declinePropos: () => {},
  catalogGetMenuList: () => {},
  catalogHandleSortChange: () => {},
  getCurrWobjProposition: () => {},
  currWobject: {},
  isLoadingPropositions: false,
  isLoadingFlag: false,
  currentHash: '',
  listItems: [],
  propositions: [],
};

export default connect(
  state => ({
    locale: getLocale(state),
    user: getAuthenticatedUser(state),
    listItems: getObjectLists(state),
    propositions: getWobjProposition(state),
  }),
  {
    assignPropos: assignProposition,
    declinePropos: declineProposition,
    getCurrWobjProposition: getWobjectPropositions,
  },
)(withRouter(injectIntl(WobjectsProposition)));
