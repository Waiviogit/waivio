import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { Checkbox } from 'antd';
import { useSelector } from 'react-redux';

import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { getMinExpertise } from '../../rewards/rewardsHelper';
import { getRate, getRewardFund } from '../../../store/appStore/appSelectors';

import './Details.less';

const DetailsModalBody = ({ proposition, requirements }) => {
  const getClassForCurrCreteria = creteria => classNames({ 'criteria-row__required': !creteria });
  const rate = useSelector(getRate);
  const rewardFund = useSelector(getRewardFund);
  const minExpertise = getMinExpertise({
    campaignMinExpertise: proposition?.userRequirements?.minExpertise,
    rewardFundRecentClaims: rewardFund.recent_claims,
    rewardFundRewardBalance: rewardFund.reward_balance,
    rate,
  });

  return (
    <div className="Details__text-wrap">
      {!proposition?.reserved && (
        <React.Fragment>
          <div className="Details__text fw6 mv3">User eligibility requirements::</div>
          <div className="Details__text mv3">
            Only users who meet all eligibility criteria can participate in this rewards campaign.
          </div>
          <div className="Details__criteria-wrap">
            <div className="Details__criteria-row">
              <Checkbox checked={requirements?.expertise} disabled />
              <div className={getClassForCurrCreteria(requirements?.expertise)}>
                Minimum Waivio expertise: {minExpertise}
              </div>
            </div>
            <div className="Details__criteria-row">
              <Checkbox checked={requirements?.followers} disabled />
              <div className={getClassForCurrCreteria(requirements?.followers)}>
                Minimum number of followers: {proposition?.userRequirements?.minFollowers}
              </div>
            </div>
            <div className="Details__criteria-row">
              <Checkbox checked={requirements?.posts} disabled />
              <div className={getClassForCurrCreteria(requirements?.posts)}>
                Minimum number of posts: {proposition?.userRequirements?.minPosts}
              </div>
            </div>
            {!!proposition?.frequencyAssign && (
              <div className="Details__criteria-row">
                <Checkbox checked={requirements?.frequency} disabled />
                <div className={getClassForCurrCreteria(requirements?.frequency)}>
                  Have not received a reward from
                  <Link to={`/@${proposition?.guideName}`}>{` @${proposition?.guideName} `}</Link>
                  for reviewing
                  <Link
                    className="nowrap"
                    to={`/object/${proposition?.object?.parent?.author_permlink}`}
                  >
                    {` ${getObjectName(proposition?.object?.parent)} `}
                  </Link>
                  in the last {proposition?.frequencyAssign} days and does not have an active
                  reservation for such a reward at the moment.
                </div>
              </div>
            )}
            <div className="Details__criteria-row">
              <Checkbox checked={requirements?.notBlacklisted} disabled />
              <div className={getClassForCurrCreteria(requirements?.notBlacklisted)}>
                User account is not blacklisted by{' '}
                <Link to={`/@${proposition?.guideName}`}>@{proposition?.guideName}</Link> or
                referenced accounts.
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
      <div>
        <div className="Details__text fw6 mv3">Post requirements:</div>
        <div className="Details__text mv3">
          For the review to be eligible for the award, all the following requirements must be met:
        </div>
        <ol className="DetailsModal__requirementsList">
          <li>
            <span className="nowrap">Minimum 2 original photos of</span>
            <Link
              className="ml1"
              to={`/object/${proposition?.object.id || proposition?.object.author_permlink}`}
            >
              {getObjectName(proposition?.object)}
            </Link>
            ;
          </li>
          {proposition?.requirements.receiptPhoto && (
            <li>Photo of the receipt (without personal details);</li>
          )}
          <li>
            <span className="nowrap">Link to</span>
            <Link
              className="ml1 Details__container"
              to={`/object/${proposition?.object?.author_permlink}`}
            >
              {getObjectName(proposition?.object)}
            </Link>
            ;
          </li>
          <li>
            <span className="nowrap">Link to</span>
            <Link
              className="ml1 Details__container"
              to={`/object/${proposition?.object?.parent?.author_permlink}`}
            >
              {getObjectName(proposition?.object?.parent)}
            </Link>
            ;
          </li>
          {proposition?.description && (
            <li>
              <span>Additional requirements/notes: {proposition?.description}</span>
            </li>
          )}
        </ol>
        <div className="Details__text mv3">
          Sponsor reserves the right to refuse the payment if review is suspected to be fraudulent,
          spam, poorly written or for other reasons as stated in the agreement.
        </div>
      </div>
      {!proposition?.reserved && (
        <React.Fragment>
          <div className="Details__text fw6 mv3">Reward:</div>
          <span>
            The amount of the reward is determined in {proposition?.payoutToken} at the time of
            reservation. The reward will be paid in the form of a combination of upvotes (
            {proposition?.payoutToken} Power) and direct payments (liquid {proposition?.payoutToken}
            ). Only upvotes from registered accounts (
            <Link to={`/@${proposition?.guideName}`}>{`@${proposition?.guideName}`}</Link>
            {!isEmpty(proposition?.matchBots) &&
              proposition?.matchBots?.map(bot => (
                <React.Fragment key={bot}>
                  ,
                  <Link className="ml1" to={`/@${bot}`}>
                    {`@${bot}`}
                  </Link>
                </React.Fragment>
              ))}
            ) count towards the payment of rewards. The value of all other upvotes is not subtracted
            from the specified amount of the reward.
          </span>
          <div className="Details__text fw6 mv3">Legal:</div>
          <span>
            By making the reservation, you confirm that you have read and agree to the
            <Link className="ml1" to="/object/xrj-terms-and-conditions/page">
              Terms and Conditions of the Service Agreement
            </Link>
            {!isEmpty(proposition?.agreementObjects) && (
              <React.Fragment>
                <span>including the following: Legal highlights:</span>
                {proposition?.agreementObjects?.map(obj => (
                  <Link key={obj} className="ml1" to={`/object/${obj}/page`}>
                    {obj}
                  </Link>
                ))}
              </React.Fragment>
            )}
          </span>
          {proposition?.usersLegalNotice && (
            <div>
              <div className="Details__text fw6 mv3">Legal notice:</div>
              <span>{proposition?.usersLegalNotice}</span>
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

DetailsModalBody.propTypes = {
  requirements: PropTypes.shape({
    expertise: PropTypes.bool,
    followers: PropTypes.bool,
    posts: PropTypes.bool,
    frequency: PropTypes.bool,
    notBlacklisted: PropTypes.bool,
  }).isRequired,
  proposition: PropTypes.shape({
    usersLegalNotice: PropTypes.string,
    guideName: PropTypes.string,
    activationPermlink: PropTypes.string,
    description: PropTypes.string,
    reserved: PropTypes.bool,
    frequencyAssign: PropTypes.number,
    payoutToken: PropTypes.string,
    agreementObjects: PropTypes.arrayOf(PropTypes.string),
    matchBots: PropTypes.arrayOf(PropTypes.shape()),
    requirements: PropTypes.shape({
      receiptPhoto: PropTypes.bool,
    }),
    userRequirements: PropTypes.shape({
      minPhotos: PropTypes.number,
      minPosts: PropTypes.number,
      minFollowers: PropTypes.number,
      minExpertise: PropTypes.number,
    }),
    object: PropTypes.shape({
      parent: PropTypes.shape({
        author_permlink: PropTypes.string,
      }),
      author_permlink: PropTypes.string,
      id: PropTypes.string,
    }),
  }).isRequired,
};

export default DetailsModalBody;
