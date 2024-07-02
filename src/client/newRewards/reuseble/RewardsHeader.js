import { Link } from 'react-router-dom';
import React from 'react';
import PropTypes from 'prop-types';
import { round } from 'lodash';
import { injectIntl } from 'react-intl';
import { getObjectName } from '../../../common/helpers/wObjectHelper';

const RewardsHeader = ({ proposition, intl }) => (
  <div>
    <p className="Proposition-new__title">
      {proposition?.user ? (
        <React.Fragment>
          Mention {proposition?.user.name || getObjectName(proposition.object)}{' '}
          {intl.formatMessage({ id: 'and_earn_crypto', defaultMessage: 'and earn crypto' })}
        </React.Fragment>
      ) : (
        <React.Fragment>
          {intl.formatMessage({ id: 'share_verb', defaultMessage: 'Share' })}{' '}
          {proposition?.requirements?.minPhotos}{' '}
          {intl.formatMessage({ id: 'photos_of_the', defaultMessage: 'photos of the' })}{' '}
          {proposition?.object?.object_type}{' '}
          {intl.formatMessage({ id: 'and_earn_crypto', defaultMessage: 'and earn crypto' })}
        </React.Fragment>
      )}
    </p>
    <div className="Proposition-new__sponsorInfo">
      <div className="Proposition-new__infoItem Proposition-new__infoItem--right">
        <Link to={`/@${proposition?.guideName}`}>
          {intl.formatMessage({ id: 'sponsor', defaultMessage: 'Sponsor' })}
        </Link>
        <Link to={`/@${proposition?.guideName}`}>@{proposition?.guideName}</Link>
      </div>
      <div className="Proposition-new__infoItem">
        <span>
          {intl.formatMessage({ id: 'total_paid_liquid', defaultMessage: 'Total paid (liquid)' })}:
        </span>
        <span>
          {round(proposition?.totalPayed || 0)} {proposition?.payoutToken} (100%)
        </span>
      </div>
    </div>
  </div>
);

RewardsHeader.propTypes = {
  proposition: PropTypes.shape({
    guideName: PropTypes.string,
    totalPayed: PropTypes.string,
    payoutToken: PropTypes.string,
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
