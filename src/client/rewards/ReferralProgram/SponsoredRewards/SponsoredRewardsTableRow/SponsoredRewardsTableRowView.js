import React from 'react';
import { sponsoredRewardsTableContent } from '../../ReferralTextHelper';
import { getBeneficiaresInfo } from '../../ReferralHelper';
import Report from '../../../Report/Report';

const SponsoredRewardsTableRowView = (
  data,
  sponsorInfo,
  dateReview,
  userWeight,
  sponsor,
  isModalReportOpen,
  closeModalReport,
  currentAmount,
  currentBalance,
) => {
  const {
    sponsoredActionReviewRequested,
    sponsoredActionReview,
    sponsoredActionBeneficiaries,
    sponsoredActionBeneficiariesName,
    sponsoredDetailsReservation,
  } = sponsoredRewardsTableContent(data);

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
      <td className="SponsoredRewardsTableRow__details-row">
        {sponsoredDetailsReservation}
        <Report
          isModalReportOpen={isModalReportOpen}
          toggleModal={closeModalReport}
          sponsor={sponsor}
        />
      </td>
      <td className="SponsoredRewardsTableRow__amount-row">{currentAmount}</td>
      <td className="SponsoredRewardsTableRow__balance-row">{currentBalance}</td>
    </tr>
  );
};

export default SponsoredRewardsTableRowView;
