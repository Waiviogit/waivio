import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isEmpty, get } from 'lodash';
import { Checkbox } from 'antd';
import getDetailsMessages from './detailsMessagesData';
import DetailsPostRequirments from './DetailsPostRequirments';
import { getWeightValue, getIsAuthenticated } from '../../reducers';
import './Details.less';

const DetailsBody = ({ objectDetails, intl, proposedWobj, requiredObjectName, minExpertise }) => {
  const isAuthenticated = useSelector(getIsAuthenticated);
  const localizer = (id, defaultMessage, variablesData) =>
    intl.formatMessage({ id, defaultMessage }, variablesData);
  const messageData = getDetailsMessages(localizer, objectDetails);
  const requirementFilters = get(objectDetails, ['0', 'requirement_filters'], {});
  const frequency =
    requirementFilters.frequency &&
    (requirementFilters.not_same_assigns || requirementFilters.freeReservation);
  const getChecked = useCallback(param => (isAuthenticated ? param : null), []);
  const minFollowers = get(objectDetails, ['0', 'userRequirements', 'minFollowers']);
  const objectDetailsMinExpertise = get(objectDetails, ['0', 'userRequirements', 'minExpertise']);
  const minPosts = get(objectDetails, ['0', 'userRequirements', 'minPosts']);
  const notBlacklisted = get(objectDetails, ['0', 'requirement_filters', 'not_blacklisted']);
  const guideName = get(objectDetails, ['0', 'guide', 'name']);
  const frequencyAssign = get(objectDetails, ['0', 'frequency_assign']);
  const requiredObject = get(objectDetails, ['0', 'requiredObject']);
  const matchBots = get(objectDetails, ['0', 'match_bots']);
  const agreementObjects = get(objectDetails, ['0', 'agreementObjects']);
  const usersLegalNotice = get(objectDetails, ['0', 'usersLegalNotice']);
  return (
    <div className="Details__text-wrap">
      <div className="Details__text fw6 mv3">{messageData.eligibilityRequirements}:</div>
      <div className="Details__text mv3">{messageData.eligibilityCriteriaParticipate}</div>
      <div className="Details__criteria-wrap">
        <div className="Details__criteria-row">
          <Checkbox checked={getChecked(requirementFilters.expertise)} disabled />
          <div>{`${messageData.minimumWaivioExpertise}: ${(
            minExpertise || objectDetailsMinExpertise
          ).toFixed(2)}`}</div>
        </div>
        <div className="Details__criteria-row">
          <Checkbox checked={getChecked(requirementFilters.followers)} disabled />
          <div>{`${messageData.minimumNumberFollowers}: ${minFollowers}`}</div>
        </div>
        <div className="Details__criteria-row">
          <Checkbox checked={getChecked(requirementFilters.posts)} disabled />
          <div>{`${messageData.minimumNumberPosts}: ${minPosts}`}</div>
        </div>
        {!!frequencyAssign && (
          <div className="Details__criteria-row">
            <Checkbox checked={getChecked(frequency)} disabled />
            <div>
              {messageData.receivedRewardFrom}
              <Link to={`/@${guideName}`}>{` @${guideName} `}</Link>
              {messageData.forReviewing}
              <Link className="nowrap" to={`/object/${requiredObject}`}>
                {` ${requiredObjectName} `}
              </Link>
              {messageData.inTheLast}
            </div>
          </div>
        )}
        <div className="Details__criteria-row">
          <Checkbox checked={getChecked(notBlacklisted)} disabled />
          <div>
            {messageData.accountNotBlacklisted}
            <Link to={`/@${guideName}`}>{` @${guideName} `}</Link>
            {messageData.referencedAccounts}
          </div>
        </div>
      </div>
      <DetailsPostRequirments
        proposedWobj={proposedWobj}
        requiredObjectName={requiredObjectName}
        intl={intl}
        objectDetails={objectDetails}
      />
      <div className="Details__text fw6 mv3">{messageData.reward}:</div>
      <span>
        {messageData.amountRewardDetermined}(<Link to={`/@${guideName}`}>{`@${guideName}`}</Link>
        {!isEmpty(matchBots) &&
          matchBots.map(bot => (
            <React.Fragment key={bot}>
              ,
              <Link className="ml1" to={`/@${bot}`}>
                {`@${bot}`}
              </Link>
            </React.Fragment>
          ))}
        ){messageData.countTowardsPaymentRewards}
      </span>
      <div className="Details__text fw6 mv3">{messageData.legal}:</div>
      <span>
        {messageData.makingReservation}
        <Link className="ml1" to="/object/xrj-terms-and-conditions/page">
          {messageData.legalTermsAndConditions}
        </Link>
        {!isEmpty(agreementObjects) && ` ${messageData.includingTheFollowing}`}
        {!isEmpty(agreementObjects) &&
          agreementObjects.map(obj => (
            <Link key={obj} className="ml1" to={`/object/${obj}/page`}>
              {obj}
            </Link>
          ))}
      </span>
      {usersLegalNotice && (
        <div>
          <div className="Details__text fw6 mv3">{messageData.usersLegalNotice}:</div>
          <span>{usersLegalNotice}</span>
        </div>
      )}
    </div>
  );
};

DetailsBody.propTypes = {
  intl: PropTypes.shape().isRequired,
  objectDetails: PropTypes.shape().isRequired,
  proposedWobj: PropTypes.shape().isRequired,
  requiredObjectName: PropTypes.string.isRequired,
  minExpertise: PropTypes.number,
};

DetailsBody.defaultProps = {
  minExpertise: 0,
};

export default connect((state, ownProp) => ({
  minExpertise: getWeightValue(
    state,
    get(ownProp, ['objectDetails', 'userRequirements', 'minExpertise']),
  ),
}))(injectIntl(DetailsBody));
