import React from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { isEmpty } from 'lodash';
import { Checkbox } from 'antd';
import getDetailsMessages from './detailsMessagesData';
import DetailsPostRequirments from './DetailsPostRequirments';
import './Details.less';

const DetailsBody = ({ objectDetails, intl, proposedWobj, requiredObjectName }) => {
  const localizer = (id, defaultMessage, variablesData) =>
    intl.formatMessage({ id, defaultMessage }, variablesData);
  const messageData = getDetailsMessages(localizer, objectDetails);
  return (
    <div className="Details__text-wrap">
      <div className="Details__text fw6 mv3">{messageData.eligibilityRequirements}:</div>
      <div className="Details__text mv3">{messageData.eligibilityCriteriaParticipate}</div>
      <div className="Details__criteria-wrap">
        <div className="Details__criteria-row">
          <Checkbox checked={objectDetails.requirement_filters.expertise} disabled />
          <div>{`${messageData.minimumWaivioExpertise}: ${objectDetails.userRequirements.minExpertise}`}</div>
        </div>
        <div className="Details__criteria-row">
          <Checkbox checked={objectDetails.requirement_filters.followers} disabled />
          <div>{`${messageData.minimumNumberFollowers}: ${objectDetails.userRequirements.minFollowers}`}</div>
        </div>
        <div className="Details__criteria-row">
          <Checkbox checked={objectDetails.requirement_filters.posts} disabled />
          <div>{`${messageData.minimumNumberPosts}: ${objectDetails.userRequirements.minPosts}`}</div>
        </div>
        {!!objectDetails.frequency_assign && (
          <div className="Details__criteria-row">
            <Checkbox checked disabled />
            <div>
              {messageData.receivedRewardFrom}
              <Link to={`/@${objectDetails.guide.name}`}>{` @${objectDetails.guide.name} `}</Link>
              {messageData.forReviewing}
              <Link className="nowrap" to={`/object/${objectDetails.requiredObject}`}>
                {` ${requiredObjectName} `}
              </Link>
              {messageData.inTheLast}
            </div>
          </div>
        )}
        <div className="Details__criteria-row">
          <Checkbox checked={objectDetails.requirement_filters.not_blacklisted} disabled />
          <div>
            {messageData.accountNotBlacklisted}
            <Link to={`/@${objectDetails.guide.name}`}>{` @${objectDetails.guide.name} `}</Link>
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
        {messageData.amountRewardDetermined}(
        <Link to={`/@${objectDetails.guide.name}`}>{`@${objectDetails.guide.name}`}</Link>
        {!isEmpty(objectDetails.match_bots) &&
          objectDetails.match_bots.map(bot => (
            <React.Fragment>
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
        {!isEmpty(objectDetails.agreementObjects) && ` ${messageData.includingTheFollowing}`}
        {!isEmpty(objectDetails.agreementObjects) &&
          objectDetails.agreementObjects.map(obj => (
            <Link className="ml1" to={`/object/${obj}/page`}>
              {obj}
            </Link>
          ))}
      </span>
      {objectDetails.usersLegalNotice && (
        <div>
          <div className="Details__text fw6 mv3">{messageData.usersLegalNotice}:</div>
          <span>{objectDetails.usersLegalNotice}</span>
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
};

export default injectIntl(DetailsBody);
