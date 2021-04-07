import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { convertDigits, formatDate } from '../../../rewardsHelper';
import {
  getPrymaryObjectLink,
  getPrymaryObjectName,
  getReservationPermlink,
  getReviewObjectLink,
  getReviewObjectName,
  getSponsoredUserWeight,
} from '../../ReferralHelper';
import { getReport } from '../../../../../waivioApi/ApiClient';
import { setDataForSingleReport } from '../../../rewardsActions';
import SponsoredRewardsTableRowView from './SponsoredRewardsTableRowView';

import './SponsoredRewardsTableRow.less';

const SponsoredRewardsTableRow = ({ intl, sponsor }) => {
  const [isModalReportOpen, setModalReportOpen] = useState(false);
  const dispatch = useDispatch();
  const sponsorInfo = get(sponsor, ['details', 'main_object'], {});
  const dateReview = formatDate(intl, sponsor.createdAt);
  const userWeight = getSponsoredUserWeight(sponsor);

  const prymaryObjectName = getPrymaryObjectName(sponsor);
  const reviewObjectName = getReviewObjectName(sponsor);

  const prymaryObjectLink = getPrymaryObjectLink(sponsor);
  const reviewObjectLink = getReviewObjectLink(sponsor);
  const reservationPermlink = getReservationPermlink(sponsor);

  const currentAmount = convertDigits(sponsor.amount, true);
  const currentBalance = convertDigits(sponsor.balance, true);

  const toggleModalReport = () => {
    const requestParams = {
      guideName: sponsor.sponsor,
      userName: sponsor.userName,
      reservationPermlink: get(sponsor, ['details', 'reservation_permlink'], ''),
    };

    getReport(requestParams)
      .then(data => {
        dispatch(setDataForSingleReport(data));
      })
      .then(() => setModalReportOpen(!isModalReportOpen))
      .catch(e => e);
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
