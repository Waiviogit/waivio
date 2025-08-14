import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { isEmpty } from 'lodash';
import { Checkbox } from 'antd';
import { useSelector } from 'react-redux';
import { injectIntl } from 'react-intl';

import { getObjectName } from '../../../common/helpers/wObjectHelper';
import USDDisplay from '../../components/Utils/USDDisplay';
import { getMinExpertise, campaignTypes } from '../../rewards/rewardsHelper';
import { getRate, getRewardFund } from '../../../store/appStore/appSelectors';

import './Details.less';

const DetailsModalBody = ({
  proposition,
  requirements,
  agreementObjects,
  intl,
  withoutSecondary,
}) => {
  const getClassForCurrCreteria = creteria => classNames({ 'criteria-row__required': !creteria });
  const rate = useSelector(getRate);
  const rewardFund = useSelector(getRewardFund);
  const requiredObject = proposition.requiredObject;
  const minExpertise = getMinExpertise({
    campaignMinExpertise: proposition?.userRequirements?.minExpertise,
    rewardFundRecentClaims: rewardFund.recent_claims,
    rewardFundRewardBalance: rewardFund.reward_balance,
    rate,
  });
  const isMentions = proposition?.type === campaignTypes?.MENTIONS;
  const isContests = campaignTypes.CONTESTS_OBJECT === proposition.type;
  const showQualifiedInfo = proposition?.qualifiedPayoutToken && proposition?.type !== 'reviews';

  return (
    <div className="DetailsModal__text-wrap">
      {!proposition?.reserved && (
        <React.Fragment>
          <div className="DetailsModal__text fw6 mv3">
            {intl.formatMessage({
              id: 'rewards_details_eligibility_requirements',
              defaultMessage: 'User eligibility requirements',
            })}
            :
          </div>
          <div className="DetailsModal__text mv3">
            {intl.formatMessage({
              id: 'rewards_details_eligibility_criteria_can_participate',
              defaultMessage:
                'Only users who meet all eligibility criteria can participate in this rewards campaign.',
            })}
          </div>
          <div className="DetailsModal__criteria-wrap">
            {Boolean(minExpertise) && (
              <div className="DetailsModal__criteria-row">
                <Checkbox checked={requirements?.expertise} disabled />
                <div className={getClassForCurrCreteria(requirements?.expertise)}>
                  {intl.formatMessage({
                    id: 'rewards_details_minimum_waivio_expertise',
                    defaultMessage: 'Minimum Waivio expertise',
                  })}
                  : {minExpertise}
                </div>
              </div>
            )}
            {Boolean(proposition?.userRequirements?.minFollowers) && (
              <div className="DetailsModal__criteria-row">
                <Checkbox checked={requirements?.followers} disabled />
                <div className={getClassForCurrCreteria(requirements?.followers)}>
                  {intl.formatMessage({
                    id: 'rewards_details_minimum_number_followers',
                    defaultMessage: 'Minimum number of followers',
                  })}
                  : {proposition?.userRequirements?.minFollowers}
                </div>
              </div>
            )}
            {Boolean(proposition?.userRequirements?.minPosts) && (
              <div className="DetailsModal__criteria-row">
                <Checkbox checked={requirements?.posts} disabled />
                <div className={getClassForCurrCreteria(requirements?.posts)}>
                  {intl.formatMessage({
                    id: 'rewards_details_minimum_number_posts',
                    defaultMessage: 'Minimum number of posts',
                  })}
                  : {proposition?.userRequirements?.minPosts}
                </div>
              </div>
            )}
            {!!proposition?.frequencyAssign && (
              <div className="DetailsModal__criteria-row">
                <Checkbox checked={requirements?.frequency} disabled />
                <div className={getClassForCurrCreteria(requirements?.frequency)}>
                  {intl.formatMessage({
                    id: 'rewards_details_received_reward_from',
                    defaultMessage: 'Have not received a reward from',
                  })}
                  <Link to={`/@${proposition?.guideName}`}>{` @${proposition?.guideName} `}</Link>
                  {intl.formatMessage({
                    id: 'rewards_details_for_reviewing',
                    defaultMessage: 'for reviewing',
                  })}
                  <Link to={requiredObject?.defaultShowLink}>
                    {` ${getObjectName(requiredObject)} `}
                  </Link>
                  {intl.formatMessage({ id: 'in_the_last', defaultMessage: 'in the last' })}{' '}
                  {proposition?.frequencyAssign}{' '}
                  {intl.formatMessage({ id: 'days', defaultMessage: 'days' })}.
                </div>
              </div>
            )}
            <div className="DetailsModal__criteria-row">
              <Checkbox checked={requirements?.notBlacklisted} disabled />
              <div className={getClassForCurrCreteria(requirements?.notBlacklisted)}>
                {intl.formatMessage({
                  id: `rewards_details_account_not_blacklisted`,
                  defaultMessage: 'User account is not blacklisted by',
                })}{' '}
                <Link to={`/@${proposition?.guideName}`}>@{proposition?.guideName}</Link>{' '}
                {intl.formatMessage({
                  id: 'rewards_details_referenced_accounts',
                  defaultMessage: 'or referenced accounts',
                })}
              </div>
            </div>
            {!isMentions && (
              <div className="DetailsModal__criteria-row">
                <Checkbox checked={requirements?.notAssigned} disabled />
                <div className={getClassForCurrCreteria(requirements?.notAssigned)}>
                  {intl.formatMessage({
                    id: 'rewards_details_account_without_active_reservation',
                    defaultMessage:
                      'User does not have an active reservation for such a reward at the moment.',
                  })}
                </div>
              </div>
            )}{' '}
          </div>
        </React.Fragment>
      )}
      <div>
        <div className="DetailsModal__text fw6 mv3">
          {intl.formatMessage({
            id: 'rewards_details_post_requirements',
            defaultMessage: 'Post requirements',
          })}
          :
        </div>
        <div className="DetailsModal__text mv3">
          {intl.formatMessage({
            id:
              proposition?.type === 'reviews'
                ? 'rewards_details_review_eligible_award'
                : 'post_details_review_eligible_award',
            defaultMessage:
              'For the review to be eligible for the award, all the following requirements must be met',
          })}
        </div>
        <ol className="DetailsModal__requirementsList">
          {Boolean(proposition?.requirements?.minPhotos) && (
            <li>
              <span className="nowrap">
                {intl.formatMessage({ id: 'minimum', defaultMessage: 'Minimum' })}{' '}
                {proposition?.requirements?.minPhotos}{' '}
                {intl.formatMessage({
                  id: 'original_photos_of',
                  defaultMessage: 'original photos of',
                })}
              </span>
              {proposition?.user ? (
                <Link className="ml1" to={`/@${proposition?.user.name}`}>
                  {proposition?.user.name}
                </Link>
              ) : (
                <Link className="ml1" to={proposition?.object?.defaultShowLink}>
                  {getObjectName(proposition?.object)}
                </Link>
              )}
              ;
            </li>
          )}
          {proposition?.requirements.receiptPhoto && (
            <li>
              {intl.formatMessage({
                id: 'rewards_details_photo_the_receipt',
                defaultMessage: 'Photo of the receipt (without personal details);',
              })}
            </li>
          )}
          <li>
            <span className="nowrap">
              {intl.formatMessage({ id: 'rewards_details_link_to', defaultMessage: 'Link to' })}
            </span>
            {isMentions ? (
              <a
                className="ml1 DetailsModal__container"
                href={
                  proposition?.object?.url?.endsWith('*')
                    ? proposition?.object?.url?.slice(0, -1)
                    : proposition?.object?.url || proposition?.object?.defaultShowLink
                }
                target={'_blank'}
                rel="noreferrer"
              >
                {proposition?.user ? proposition?.user.name : getObjectName(proposition?.object)}
              </a>
            ) : (
              <Link
                className="ml1 DetailsModal__container"
                to={
                  proposition?.user
                    ? `/@${proposition?.user.name}`
                    : proposition?.object?.defaultShowLink
                }
              >
                {proposition?.user ? proposition?.user.name : getObjectName(proposition?.object)}
              </Link>
            )}
            ;
          </li>
          {!withoutSecondary && (
            <li>
              <span className="nowrap">
                {intl.formatMessage({ id: 'rewards_details_link_to', defaultMessage: 'Link to' })}
              </span>
              {isMentions ? (
                <a
                  className="ml1 DetailsModal__container"
                  href={
                    requiredObject?.url?.endsWith('*')
                      ? requiredObject?.url?.slice(0, -1)
                      : requiredObject?.url || requiredObject?.defaultShowLink
                  }
                  target={'_blank'}
                  rel="noreferrer"
                >
                  {getObjectName(requiredObject)}
                </a>
              ) : (
                <Link className="ml1 DetailsModal__container" to={requiredObject?.defaultShowLink}>
                  {getObjectName(requiredObject)}
                </Link>
              )}
              ;
            </li>
          )}
          {showQualifiedInfo && (
            <li>
              <span className="nowrap">Include hashtag #waivio to qualify for WAIV rewards</span>.
            </li>
          )}
          {proposition?.description && (
            <li>
              <span>
                {intl.formatMessage({
                  id: 'rewards_details_additional_requirements',
                  defaultMessage: 'Additional requirements/notes',
                })}
                : {proposition?.description}
              </span>
            </li>
          )}
        </ol>
        {proposition?.type === campaignTypes?.GIVEAWAYS_OBJECT ? (
          <div className="DetailsModal__text mv3">
            {intl.formatMessage({
              id: 'rewards_details_sponsor_reserves_payment_giveaways_object',
              defaultMessage:
                'Sponsor reserves the right to refuse the payment if post is suspected to be fraudulent, spam, poorly written or for other reasons.',
            })}
          </div>
        ) : (
          <div className="DetailsModal__text mv3">
            {isMentions
              ? intl.formatMessage({
                  id: 'rewards_details_sponsor_reserves_payment_mentions',
                  defaultMessage:
                    'Sponsor reserves the right to refuse the payment if review is suspected to be fraudulent, spam, poorly written or for other reasons.',
                })
              : intl.formatMessage({
                  id: 'rewards_details_sponsor_reserves_payment',
                  defaultMessage:
                    'Sponsor reserves the right to refuse the payment if review is suspected to be fraudulent, spam, poorly written or for other reasons as stated in the agreement.',
                })}
          </div>
        )}
      </div>
      {!proposition?.reserved && (
        <React.Fragment>
          <div
            className={classNames({
              mv3: isContests,
            })}
          >
            <div
              className={classNames('DetailsModal__text fw6 ', {
                mv3: !isContests,
                'DetailsModal__text--marginBottom': isContests,
              })}
            >
              {isContests
                ? intl.formatMessage({ id: 'rewards_details_rewards', defaultMessage: 'Rewards' })
                : intl.formatMessage({ id: 'rewards_details_reward', defaultMessage: 'Reward' })}
              :
            </div>
            {isContests && (
              <React.Fragment>
                <div>
                  {proposition?.contestRewards?.map(reward => (
                    <div className="DetailsModal__text fw6" key={reward?.place}>
                      Place #{reward?.place}: <USDDisplay value={reward?.rewardInUSD} />
                    </div>
                  ))}
                </div>
                <div
                  className={classNames({
                    mv3: isContests,
                  })}
                >
                  Contest judges (
                  {proposition.contestJudges.map((judges, i, arr) => (
                    <Link key={judges} to={`/@${judges}`}>
                      @{arr?.length > 1 && arr?.length - 1 !== i ? `${judges}, ` : judges}
                    </Link>
                  ))}
                  ) will review posts and cast their votes. Once the campaign ends, winners will be
                  selected based on the judges&#39; votes.
                </div>
              </React.Fragment>
            )}
          </div>

          <span>
            {intl.formatMessage({
              id: 'the_amount_of_the_rewards',
              defaultMessage: 'The amount of the reward is determined in',
            })}{' '}
            {proposition?.payoutToken}{' '}
            {intl.formatMessage(
              isMentions
                ? {
                    id: 'at_the_time_of_submission',
                    defaultMessage:
                      'at the time of submission. The reward will be paid in the form of a combination of upvotes',
                  }
                : {
                    id: 'at_the_time_of_reservation',
                    defaultMessage:
                      'at the time of reservation. The reward will be paid in the form of a combination of upvotes',
                  },
            )}{' '}
            ({proposition?.payoutToken}{' '}
            {intl.formatMessage({
              id: 'power_and_direct_payments',
              defaultMessage: 'Power) and direct payments (liquid',
            })}{' '}
            {proposition?.payoutToken}
            ).{' '}
            {intl.formatMessage({
              id: 'only_upvotes',
              defaultMessage: 'Only upvotes from registered accounts',
            })}{' '}
            (<Link to={`/@${proposition?.guideName}`}>{`@${proposition?.guideName}`}</Link>
            {!isEmpty(proposition?.matchBots) &&
              proposition?.matchBots?.map(bot => (
                <React.Fragment key={bot}>
                  ,
                  <Link className="ml1" to={`/@${bot}`}>
                    {`@${bot}`}
                  </Link>
                </React.Fragment>
              ))}
            ){' '}
            {intl.formatMessage({
              id: 'count_towards',
              defaultMessage:
                'count towards the payment of rewards. The value of all other upvotes is not subtracted from the specified amount of the reward.',
            })}
          </span>
          {(!isEmpty(agreementObjects) || proposition?.usersLegalNotice) && (
            <React.Fragment>
              <div className="DetailsModal__text fw6 mv3">
                {intl.formatMessage({ id: 'rewards_details_legal', defaultMessage: 'Legal' })}:
              </div>
              <span>
                {intl.formatMessage({
                  id: 'rewards_details_making_reservation',
                  defaultMessage:
                    'By making the reservation, you confirm that you have read and agree to the',
                })}{' '}
                {!isEmpty(agreementObjects) && (
                  <React.Fragment>
                    {agreementObjects?.map((obj, i, arr) => (
                      <React.Fragment key={obj?.author_permlink}>
                        <Link to={obj?.defaultShowLink}>{getObjectName(obj)}</Link>
                        {arr.length > 1 && arr.length - 1 !== i ? ', ' : ''}
                      </React.Fragment>
                    ))}
                    {proposition?.usersLegalNotice ? ' including ' : '.'}
                  </React.Fragment>
                )}
                {proposition?.usersLegalNotice && (
                  <span>
                    following: <b>{proposition?.usersLegalNotice}</b>.
                  </span>
                )}
              </span>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </div>
  );
};

DetailsModalBody.propTypes = {
  agreementObjects: PropTypes.arrayOf().isRequired,
  requirements: PropTypes.shape({
    expertise: PropTypes.bool,
    followers: PropTypes.bool,
    posts: PropTypes.bool,
    frequency: PropTypes.bool,
    notBlacklisted: PropTypes.bool,
    notAssigned: PropTypes.bool,
  }).isRequired,
  proposition: PropTypes.shape({
    usersLegalNotice: PropTypes.string,
    guideName: PropTypes.string,
    type: PropTypes.string,
    activationPermlink: PropTypes.string,
    requiredObject: PropTypes.shape({
      defaultShowLink: PropTypes.string,
      url: PropTypes.string,
    }),
    user: PropTypes.shape({
      name: PropTypes.string,
    }),
    contestJudges: PropTypes.arrayOf(PropTypes.string),
    description: PropTypes.string,
    reserved: PropTypes.bool,
    qualifiedPayoutToken: PropTypes.bool,
    frequencyAssign: PropTypes.number,
    payoutToken: PropTypes.string,
    defaultShowLink: PropTypes.string,
    agreementObjects: PropTypes.arrayOf(PropTypes.string),
    matchBots: PropTypes.arrayOf(PropTypes.shape()),
    contestRewards: PropTypes.arrayOf(PropTypes.shape()),
    requirements: PropTypes.shape({
      receiptPhoto: PropTypes.bool,
      minPhotos: PropTypes.number,
    }),
    userRequirements: PropTypes.shape({
      minPhotos: PropTypes.number,
      minPosts: PropTypes.number,
      minFollowers: PropTypes.number,
      minExpertise: PropTypes.number,
    }),
    object: PropTypes.shape({
      parent: PropTypes.shape({
        defaultShowLink: PropTypes.string,
      }),
      defaultShowLink: PropTypes.string,
      id: PropTypes.string,
      url: PropTypes.string,
    }),
  }).isRequired,
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
  withoutSecondary: PropTypes.bool,
};

export default injectIntl(DetailsModalBody);
