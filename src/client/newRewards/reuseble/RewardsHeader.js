import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { round } from 'lodash';
import { injectIntl } from 'react-intl';
import { getObjectName } from '../../../common/helpers/wObjectHelper';
import { campaignTypes } from '../../rewards/rewardsHelper';

const RewardsHeader = ({ proposition, intl }) => {
  const getTitle = () => {
    switch (proposition?.type) {
      case campaignTypes.MENTIONS:
        return (
          <React.Fragment>
            Mention {proposition?.user?.name || getObjectName(proposition.object)}{' '}
            {intl.formatMessage({ id: 'and_earn_crypto', defaultMessage: 'and earn crypto' })}
          </React.Fragment>
        );
      case campaignTypes.GIVEAWAYS:
      case campaignTypes.GIVEAWAYS_OBJECT:
        const winners = proposition.budget / proposition.reward;

        return (
          <React.Fragment>
            Giveaway time! Your chance to win ${proposition.reward}
            {winners ? `with ${winners} winners` : ''}!
          </React.Fragment>
        );

      case campaignTypes.CONTESTS_OBJECT:
        return (
          <React.Fragment>
            Contest time! Your chance to win $
            {round(proposition?.contestRewards?.[0]?.rewardInUSD, 2)}!
          </React.Fragment>
        );

      default:
        return (
          <React.Fragment>
            {intl.formatMessage({ id: 'share_verb', defaultMessage: 'Share' })}{' '}
            {proposition?.requirements?.minPhotos}{' '}
            {intl.formatMessage({ id: 'photos_of_the', defaultMessage: 'photos of the' })}{' '}
            {proposition?.object?.object_type}{' '}
            {intl.formatMessage({ id: 'and_earn_crypto', defaultMessage: 'and earn crypto' })}
          </React.Fragment>
        );
    }
  };

  return (
    <div>
      <p className="Proposition-new__title">{getTitle()}</p>
      <div className="Proposition-new__sponsorInfo">
        <div className="Proposition-new__infoItem Proposition-new__infoItem--right">
          <Link to={`/@${proposition?.guideName}`}>
            {intl.formatMessage({ id: 'sponsor', defaultMessage: 'Sponsor' })}
          </Link>
          <Link to={`/@${proposition?.guideName}`}>@{proposition?.guideName}</Link>
        </div>
        <div className="Proposition-new__infoItem">
          <span>
            {intl.formatMessage({ id: 'total_paid_liquid', defaultMessage: 'Total paid (liquid)' })}
            :
          </span>
          <span>
            {round(proposition?.totalPayed || 0)} {proposition?.payoutToken} (100%)
          </span>
        </div>
      </div>
    </div>
  );
};

RewardsHeader.propTypes = {
  proposition: PropTypes.shape({
    guideName: PropTypes.string,
    reward: PropTypes.number,
    budget: PropTypes.number,
    type: PropTypes.string,
    totalPayed: PropTypes.number,
    payoutToken: PropTypes.string,
    contestRewards: PropTypes.arrayOf(
      PropTypes.shape({
        rewardInUSD: PropTypes.string,
      }),
    ),
    requirements: PropTypes.shape({
      minPhotos: PropTypes.number,
    }),
    user: PropTypes.shape({
      name: PropTypes.number,
    }),
    object: PropTypes.shape({
      object_type: PropTypes.string,
    }),
  }).isRequired,
  intl: PropTypes.shape().isRequired,
};

export default injectIntl(RewardsHeader);
