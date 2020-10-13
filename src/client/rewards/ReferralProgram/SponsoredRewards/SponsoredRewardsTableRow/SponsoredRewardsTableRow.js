import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../../rewardsHelper';
import { SponsoredRewardsTableContent } from '../../ReferralTextHelper';
import {
  getBeneficiaresInfo,
  getPrymaryObjectLink,
  getPrymaryObjectName,
  getReservationPermlink,
  getReviewObjectLink,
  getReviewObjectName,
  getSponsoredUserWeight,
} from '../../ReferralHelper';

const SponsoredRewardsTableRow = ({ intl, sponsor }) => {
  const sponsorInfo = sponsor && sponsor.details && sponsor.details.main_object;
  const dateReview = formatDate(intl, sponsor.createdAt);
  const userWeight = getSponsoredUserWeight(sponsor);

  const prymaryObjectName = getPrymaryObjectName(sponsor);
  const reviewObjectName = getReviewObjectName(sponsor);

  const prymaryObjectLink = getPrymaryObjectLink(sponsor);
  const reviewObjectLink = getReviewObjectLink(sponsor);
  const reservationPermlink = getReservationPermlink(sponsor);

  const data = {
    username: sponsor.userName,
    sponsorName: sponsor.sponsor,
    prymaryObjectName,
    prymaryObjectLink,
    reviewObjectName,
    reviewObjectLink,
    reservationPermlink,
  };
  const {
    sponsoredActionReviewRequested,
    sponsoredActionReview,
    sponsoredActionBeneficiaries,
    sponsoredActionBeneficiariesName,
    sponsoredDetailsReservation,
  } = SponsoredRewardsTableContent(data);

  return (
    <tr className="SponsoredRewardsTableRow">
      <td className="SponsoredRewardsTableRow__date-row">{dateReview}</td>
      <td className="SponsoredRewardsTableRow__action-row">
        {sponsoredActionReviewRequested}
        {sponsorInfo && (
          <React.Fragment>
            <div>{sponsoredActionReview}</div>
            <div>
              {sponsoredActionBeneficiaries}
              {getBeneficiaresInfo(sponsor)}
              {sponsoredActionBeneficiariesName}
              {userWeight}
            </div>
          </React.Fragment>
        )}
      </td>
      <td>{sponsoredDetailsReservation}</td>
    </tr>
  );
};

SponsoredRewardsTableRow.propTypes = {
  intl: PropTypes.shape().isRequired,
  sponsor: PropTypes.shape(),
};

SponsoredRewardsTableRow.defaultProps = {
  sponsor: {},
};

export default SponsoredRewardsTableRow;
