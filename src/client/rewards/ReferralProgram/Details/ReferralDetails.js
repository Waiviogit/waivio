import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { referralDetailContent } from '../ReferralTextHelper';

import './ReferralDetails.less';
import { getUserReferralDetails } from '../../rewardsActions';

const ReferralDetail = props => {
  useEffect(() => {
    console.log('details: ', props);
  }, []);

  const data = {
    firstPercent: '50%',
    secondPercent: '80%',
    campaignPercent: '0%',
    campaignSum: '$0',
    indexPercent: '0%',
    indexSum: '$0',
    referralsPercent: '0%',
    referralsSum: '$0',
    referalDuration: 90,
  };
  const {
    detailTitle,
    detailDescription,
    detailsCommissionsTitle,
    detailsCommissionsDescription,
    detailsCommissionsExample,
    detailsCommissionsSponsor,
    detailsCommissionsProcessing,
    detailsCommissionsWaivioCampaign,
    detailsCommissionsWaivioIndex,
    detailsCommissionsReferrals,
    detailsCommissionsPayments,
    detailsReferralPeriod,
    detailsReferralSessions,
    detailsReferralPartners,
  } = referralDetailContent(data);

  return (
    <div className="ReferralDetail">
      <h2 className="ReferralDetail__title">{detailTitle}</h2>
      <div className="ReferralDetail__description">{detailDescription}</div>
      <div className="ReferralDetail__commissions-title">{detailsCommissionsTitle}</div>
      <div className="ReferralDetail__commissions-description">{detailsCommissionsDescription}</div>
      <div className="ReferralDetail__commissions-example">{detailsCommissionsExample}</div>
      <div className="ReferralDetail__commissions-sponsor">{detailsCommissionsSponsor}</div>
      <div className="ReferralDetail__commissions-processing">{detailsCommissionsProcessing}</div>
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
      <div className="ReferralDetail__referral-period">{detailsReferralPeriod}</div>
      <div className="ReferralDetail__referral-sessions">{detailsReferralSessions}</div>
      <div className="ReferralDetail__referral-partners">{detailsReferralPartners}</div>
    </div>
  );
};

ReferralDetail.propTypes = {
  intl: PropTypes.shape({
    formatMessage: PropTypes.func,
  }).isRequired,
};

ReferralDetail.defaultProps = {};

const mapStateToProps = state => ({
  getReferralDetails: getUserReferralDetails(state),
});

export default injectIntl(connect(mapStateToProps, null)(ReferralDetail));
