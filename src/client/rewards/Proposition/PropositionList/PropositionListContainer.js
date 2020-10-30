import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { filter, get } from 'lodash';
import { injectIntl } from 'react-intl';
import { message } from 'antd';
import {
  getAuthenticatedUser,
  getIsLoadingPropositions,
  getLocale,
  getPropositionCampaign,
} from '../../../reducers';
import Loading from '../../../components/Icon/Loading';
import PropositionList from './PropositionList';
import * as apiConfig from '../../../../waivioApi/config.json';
import { assignProposition, declineProposition } from '../../../user/userActions';
import { getPropositionsForListContainer } from '../../rewardsActions';

const PropositionListContainer = ({
  wobject,
  userName,
  locale,
  match,
  intl,
  history,
  user,
  assignPropos,
  declinePropos,
  catalogHandleSortChange,
  catalogSort,
  isCatalogWrap,
  getProposListContainer,
  campaigns,
  isLoadingPropositions,
  currentHash,
}) => {
  const [loadingAssignDiscard, setLoadingAssignDiscard] = useState(false);
  const [allPropositions, setAllPropositions] = useState([]);
  const [currentProposition, setCurrentProposition] = useState([]);
  const [proposition, setProposition] = useState([]);
  const [isAssign, setIsAssign] = useState(false);
  const hashArr = currentHash.split('/');
  const firstHash = get(hashArr, '[0]', '');

  useEffect(() => {
    if (wobject && userName) {
      let requiredObject;
      let primaryObject;

      if (isCatalogWrap && firstHash === currentHash) {
        const reqData = {
          userName,
          match,
          requiredObject: get(wobject, ['author_permlink']),
          sort: 'reward',
          locale,
        };
        getProposListContainer(reqData);
      } else {
        const reqData = {
          userName,
          match,
          locale,
        };
        requiredObject = get(wobject, ['parent', 'author_permlink']) || get(wobject, ['parent']);
        primaryObject = get(wobject, ['author_permlink']);

        if (requiredObject) {
          reqData.requiredObject = requiredObject;
        } else {
          reqData.primaryObject = primaryObject;
        }
        getProposListContainer(reqData);
      }
    }
  }, [wobject, userName, currentHash]);

  const updateProposition = (propsId, assigned, objPermlink, companyAuthor) =>
    proposition.map(propos => {
      const updatedProposition = propos;
      const updatedPropositionId = get(updatedProposition, ['_id'], '');
      if (updatedPropositionId === propsId) {
        updatedProposition.objects.forEach((object, index) => {
          const objectAuthorPermlink = get(object, ['object', 'author_permlink']);
          updatedProposition.objects[index].assigned =
            objectAuthorPermlink === objPermlink || assigned;
        });
      }
      if (updatedProposition.guide.name === companyAuthor && updatedPropositionId !== propsId) {
        updatedProposition.isReservedSiblingObj = true;
      }
      return updatedProposition;
    });

  const assignPropositionHandler = ({
    companyAuthor,
    companyPermlink,
    resPermlink,
    objPermlink,
    companyId,
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
        const updatedPropositions = updateProposition(companyId, true, objPermlink, companyAuthor);
        setLoadingAssignDiscard(false);
        setProposition(updatedPropositions);
        setIsAssign(true);

        return { isAssign: true };
      })
      .catch(e => {
        setLoadingAssignDiscard(false);
        setIsAssign(false);
        throw e;
      });
  };

  useEffect(() => {
    const currentPropos = filter(
      campaigns,
      obj => obj.required_object.author_permlink === match.params.name,
    );
    setAllPropositions(campaigns);
    setCurrentProposition(currentPropos[0]);
  }, [campaigns]);

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
        const updatedPropositions = updateProposition(companyId, false, objPermlink);
        setLoadingAssignDiscard(false);
        setProposition(updatedPropositions);
        setIsAssign(true);

        return { isAssign: false };
      })
      .catch(e => {
        message.error(e.error_description);
        setLoadingAssignDiscard(false);
        setIsAssign(true);
      });
  };

  const goToProducts = () => {
    const permlink = get(wobject, 'author_permlink');
    history.push(`/rewards/all/${permlink}`);
  };

  return (
    <React.Fragment>
      {isLoadingPropositions ? (
        <Loading />
      ) : (
        <React.Fragment>
          <PropositionList
            isCatalogWrap={isCatalogWrap}
            catalogHandleSortChange={catalogHandleSortChange}
            catalogSort={catalogSort}
            wobject={wobject}
            allPropositions={allPropositions}
            currentProposition={currentProposition}
            goToProducts={goToProducts}
            discardProposition={discardProposition}
            assignPropositionHandler={assignPropositionHandler}
            user={user}
            loadingAssignDiscard={loadingAssignDiscard}
            isAssign={isAssign}
            match={match}
            userName={userName}
            history={history}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

PropositionListContainer.propTypes = {
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  locale: PropTypes.string,
  match: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
  assignPropos: PropTypes.func,
  declinePropos: PropTypes.func,
  catalogHandleSortChange: PropTypes.func,
  catalogSort: PropTypes.string,
  isCatalogWrap: PropTypes.bool,
  getProposListContainer: PropTypes.func,
  campaigns: PropTypes.shape(),
  isLoadingPropositions: PropTypes.shape(),
  currentHash: PropTypes.string,
};

PropositionListContainer.defaultProps = {
  locale: 'en-US',
  match: {},
  user: {},
  assignPropos: () => {},
  declinePropos: () => {},
  isCatalogWrap: false,
  catalogGetMenuList: () => {},
  catalogHandleSortChange: () => {},
  catalogSort: '',
  getProposListContainer: () => {},
  campaigns: {},
  isLoadingPropositions: false,
  currentHash: '',
};

export default connect(
  state => ({
    locale: getLocale(state),
    user: getAuthenticatedUser(state),
    campaigns: getPropositionCampaign(state),
    isLoadingPropositions: getIsLoadingPropositions(state),
  }),
  {
    assignPropos: assignProposition,
    declinePropos: declineProposition,
    getProposListContainer: getPropositionsForListContainer,
  },
)(withRouter(injectIntl(PropositionListContainer)));
