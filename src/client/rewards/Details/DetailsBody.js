import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEmpty, get } from 'lodash';
import { Checkbox } from 'antd';
import getDetailsMessages from './detailsMessagesData';
import DetailsPostRequirments from './DetailsPostRequirments';
import { getWeightValue } from '../../../store/appStore/appSelectors';
import { getIsAuthenticated } from '../../../store/authStore/authSelectors';

import './Details.less';

const DetailsBody = ({ objectDetails, intl, proposedWobj, requiredObjectName, minExpertise }) => {
  const isAuthenticated = useSelector(getIsAuthenticated);
  const localizer = (id, defaultMessage, variablesData) =>
    intl.formatMessage({ id, defaultMessage }, variablesData);
  const messageData = getDetailsMessages(localizer, objectDetails);
  const requirementFilters = get(objectDetails, ['requirement_filters'], {});
  const frequency =
    requirementFilters.frequency &&
    (requirementFilters.not_same_assigns || requirementFilters.freeReservation);
  const getChecked = useCallback(param => (isAuthenticated ? param : null), []);
  const expertiseRequired = getChecked(requirementFilters.expertise);
  const followersRequired = getChecked(requirementFilters.followers);
  const postsRequired = getChecked(requirementFilters.posts);
  const frequencyRequired = getChecked(frequency);
  const notBlacklistedRequired = getChecked(objectDetails.requirement_filters.not_blacklisted);

  return (
    <div className="Details__text-wrap">
      <div className="Details__text fw6 mv3">{messageData.eligibilityRequirements}:</div>
      <div className="Details__text mv3">{messageData.eligibilityCriteriaParticipate}</div>
      <div className="Details__criteria-wrap">
        <div className="Details__criteria-row">
          <Checkbox checked={expertiseRequired} disabled />
          <div className={classNames({ 'criteria-row__required': !expertiseRequired })}>{`${
            messageData.minimumWaivioExpertise
          }: ${minExpertise.toFixed(2)}`}</div>
        </div>
        <div className="Details__criteria-row">
          <Checkbox checked={followersRequired} disabled />
          <div
            className={classNames({ 'criteria-row__required': !followersRequired })}
          >{`${messageData.minimumNumberFollowers}: ${objectDetails.userRequirements.minFollowers}`}</div>
        </div>
        <div className="Details__criteria-row">
          <Checkbox checked={postsRequired} disabled />
          <div
            className={classNames({ 'criteria-row__required': !postsRequired })}
          >{`${messageData.minimumNumberPosts}: ${objectDetails.userRequirements.minPosts}`}</div>
        </div>
        {!!objectDetails.frequency_assign && (
          <div className="Details__criteria-row">
            <Checkbox checked={frequencyRequired} disabled />
            <div className={classNames({ 'criteria-row__required': !frequencyRequired })}>
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
          <Checkbox checked={notBlacklistedRequired} disabled />
          <div className={classNames({ 'criteria-row__required': !notBlacklistedRequired })}>
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
        {messageData.amountRewardDetermined} (
        <Link to={`/@${objectDetails.guide.name}`}>{`@${objectDetails.guide.name}`}</Link>
        {!isEmpty(objectDetails.match_bots) &&
          objectDetails.match_bots.map(bot => (
            <React.Fragment key={bot}>
              ,
              <Link className="ml1" to={`/@${bot}`}>
                {`@${bot}`}
              </Link>
            </React.Fragment>
          ))}
        ) {messageData.countTowardsPaymentRewards}
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
            <Link key={obj} className="ml1" to={`/object/${obj}/page`}>
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
