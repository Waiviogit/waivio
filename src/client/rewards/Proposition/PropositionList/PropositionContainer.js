import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { filter, get, map } from 'lodash';
import { injectIntl } from 'react-intl';
import { message } from 'antd';
import { getAuthenticatedUser, getLocale } from '../../../reducers';
import Loading from '../../../components/Icon/Loading';
import Proposition from '../Proposition';
import PropositionList from './PropositionList';
import * as apiConfig from '../../../../waivioApi/config.json';
import { assignProposition, declineProposition } from '../../../user/userActions';
import * as ApiClient from '../../../../waivioApi/ApiClient';

const PropositionContainer = ({
  wobject,
  userName,
  locale,
  match,
  intl,
  history,
  user,
  assignPropos,
  declinePropos,
}) => {
  const [loadingPropositions, setLoadingPropositions] = useState(false);
  const [loadingAssignDiscard, setLoadingAssignDiscard] = useState(false);
  const [allPropositions, setAllPropositions] = useState([]);
  const [currentProposition, setCurrentProposition] = useState([]);
  const [proposition, setProposition] = useState([]);
  const [isAssign, setIsAssign] = useState(false);
  const getPropositions = reqData => {
    setLoadingPropositions(true);
    ApiClient.getPropositions(reqData).then(data => {
      const currentPropos = filter(
        data.campaigns,
        obj => obj.required_object.author_permlink === match.params.name,
      );
      setAllPropositions(data.campaigns);
      setLoadingPropositions(false);
      setCurrentProposition(currentPropos[0]);
    });
  };

  useEffect(() => {
    if (wobject && userName) {
      const requiredObject =
        get(wobject, ['parent', 'author_permlink']) || get(wobject, ['parent']);
      const primaryObject = get(wobject, ['author_permlink']);
      const reqData = {
        userName,
        match,
        locale,
      };
      if (requiredObject) {
        reqData.requiredObject = requiredObject;
      } else {
        reqData.primaryObject = primaryObject;
      }
      getPropositions(reqData);
    }
  }, [wobject, userName]);

  const updateProposition = (propsId, assigned, objPermlink, companyAuthor) =>
    proposition.map(propos => {
      const updatedProposition = propos;
      // eslint-disable-next-line no-underscore-dangle
      if (updatedProposition._id === propsId) {
        updatedProposition.objects.forEach((object, index) => {
          if (object.object.author_permlink === objPermlink) {
            updatedProposition.objects[index].assigned = assigned;
          } else {
            updatedProposition.objects[index].assigned = null;
          }
        });
      }
      // eslint-disable-next-line no-underscore-dangle
      if (updatedProposition.guide.name === companyAuthor && updatedProposition._id !== propsId) {
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

  const renderProposition = propositions =>
    map(propositions, propos =>
      map(
        propos.objects,
        wobj =>
          get(wobj, ['object', 'author_permlink']) === match.params.name && (
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
          ),
      ),
    );

  const goToProducts = () => {
    const permlink = get(wobject, 'author_permlink');
    history.push(`/rewards/all/${permlink}`);
  };

  return (
    <React.Fragment>
      {loadingPropositions ? (
        <Loading />
      ) : (
        <React.Fragment>
          <PropositionList
            wobject={wobject}
            allPropositions={allPropositions}
            currentProposition={currentProposition}
            goToProducts={goToProducts}
            renderProposition={renderProposition}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

PropositionContainer.propTypes = {
  wobject: PropTypes.shape().isRequired,
  userName: PropTypes.string.isRequired,
  locale: PropTypes.string,
  match: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  history: PropTypes.shape().isRequired,
  user: PropTypes.shape(),
  assignPropos: PropTypes.func,
  declinePropos: PropTypes.func,
};

PropositionContainer.defaultProps = {
  locale: 'en-US',
  match: {},
  user: {},
  assignPropos: () => {},
  declinePropos: () => {},
};

export default connect(
  state => ({
    locale: getLocale(state),
    user: getAuthenticatedUser(state),
  }),
  {
    assignPropos: assignProposition,
    declinePropos: declineProposition,
  },
)(withRouter(injectIntl(PropositionContainer)));
