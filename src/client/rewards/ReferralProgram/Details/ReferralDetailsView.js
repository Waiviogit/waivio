import React from 'react';
import PropTypes from 'prop-types';
import { referralDetailContent } from '../ReferralTextHelper';

const ReferralDetailsView = ({ isAuthenticated, data }) => {
  const {
    detailTitle,
    detailDescription,
    detailsAdditionTextOffers,
    detailsAdditionTextUsers,
    detailsAdditionTextSessions,
    detailsCommissionsTitle,
    detailsCommissionsDescription,
    detailsCommissionsExample,
    detailsCommissionsSponsor,
    detailsCommissionsProcessing,
    detailsCommissionsWaivioCampaign,
    detailsCommissionsWaivioIndex,
    detailsCommissionsReferrals,
    detailsCommissionsPayments,
    detailsReferralPartners,
  } = referralDetailContent(data);

  return (
    <React.Fragment>
      {isAuthenticated && (
        <div className="ReferralDetail">
          <h2 className="ReferralDetail__title">{detailTitle}</h2>
          <div className="ReferralDetail__description">{detailDescription}</div>

          <div className="ReferralDetail__addition-offers-text">{detailsAdditionTextOffers}</div>
          <div className="ReferralDetail__addition-users-text">{detailsAdditionTextUsers}</div>
          <div className="ReferralDetail__addition-session-text">{detailsAdditionTextSessions}</div>
          <div className="ReferralDetail__referral-partners">{detailsReferralPartners}</div>
          <div className="ReferralDetail__commissions-title">{detailsCommissionsTitle}</div>
          <div className="ReferralDetail__commissions-description">
            {detailsCommissionsDescription}
          </div>
          <div className="ReferralDetail__commissions-example">{detailsCommissionsExample}</div>
          <div className="ReferralDetail__commissions-sponsor">{detailsCommissionsSponsor}</div>
          <div className="ReferralDetail__commissions-processing">
            {detailsCommissionsProcessing}
          </div>
          <div className="ReferralDetail__commissions-distribution">
            <div className="commissions-distribution__waivio-campaigns">
              {detailsCommissionsWaivioCampaign}
            </div>
            <div className="commissions-distribution__waivio-index">
              {detailsCommissionsWaivioIndex}
            </div>
            <div className="commissions-distribution__waivio-referrals">
              {detailsCommissionsReferrals}
            </div>
          </div>
          <div className="ReferralDetail__commissions-payments">{detailsCommissionsPayments}</div>
        </div>
      )}
    </React.Fragment>
  );
};

ReferralDetailsView.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  data: PropTypes.shape(),
};

ReferralDetailsView.defaultProps = {
  data: {},
};

export default ReferralDetailsView;
