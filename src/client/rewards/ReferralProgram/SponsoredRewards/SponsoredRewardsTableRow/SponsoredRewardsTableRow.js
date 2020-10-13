import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { convertDigits, formatDate } from '../../../rewardsHelper';
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
import { getReport } from '../../../../../waivioApi/ApiClient';
import { setDataForSingleReport } from '../../../rewardsActions';
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
      <td>
        {sponsoredDetailsReservation}
        <Report
          isModalReportOpen={isModalReportOpen}
          toggleModal={closeModalReport}
          sponsor={sponsor}
        />
      </td>
      <td>{currentAmount}</td>
      <td>{currentBalance}</td>
    </tr>
  );
};

const SponsoredRewardsTableRow = ({ intl, sponsor }) => {
  const [isModalReportOpen, setModalReportOpen] = useState(false);
  const dispatch = useDispatch();
  const sponsorInfo = sponsor && sponsor.details && sponsor.details.main_object;
  const dateReview = formatDate(intl, sponsor.createdAt);
  const userWeight = getSponsoredUserWeight(sponsor);

  const prymaryObjectName = getPrymaryObjectName(sponsor);
  const reviewObjectName = getReviewObjectName(sponsor);

  const prymaryObjectLink = getPrymaryObjectLink(sponsor);
  const reviewObjectLink = getReviewObjectLink(sponsor);
  const reservationPermlink = getReservationPermlink(sponsor);

  const currentAmount = sponsor.amount ? convertDigits(sponsor.amount, true) : 0;
  const currentBalance = convertDigits(sponsor.balance, true)
    ? convertDigits(sponsor.balance, true)
    : 0;

  const toggleModalReport = () => {
    const requestParams = {
      guideName: sponsor.sponsor,
      userName: sponsor.userName,
      reservationPermlink: sponsor.details.reservation_permlink,
    };
    getReport(requestParams)
      .then(data => {
        dispatch(setDataForSingleReport(data));
      })
      .then(() => setModalReportOpen(!isModalReportOpen))
      .catch(e => console.log(e));
  };

  const closeModalReport = () => {
    if (isModalReportOpen) setModalReportOpen(!isModalReportOpen);
  };

  const data = {
    username: sponsor.userName,
    sponsorName: sponsor.sponsor,
    prymaryObjectName,
    prymaryObjectLink,
    reviewObjectName,
    reviewObjectLink,
    reservationPermlink,
    toggleModalReport,
  };

  return SponsoredRewardsTableRowView(
    data,
    sponsorInfo,
    dateReview,
    userWeight,
    sponsor,
    isModalReportOpen,
    closeModalReport,
    currentAmount,
    currentBalance,
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
