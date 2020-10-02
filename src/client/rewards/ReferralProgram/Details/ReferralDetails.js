import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { referralDetailContent } from '../ReferralTextHelper';
import { getCurrentFeesValue, getCurrentOfferPercent } from '../ReferralHelper';

import './ReferralDetails.less';
import { getUserReferralDetails } from '../../rewardsActions';
import {
  getCampaignServerPercent,
  getIndexAbsolutePercent,
  getIndexServerPercent,
  getIsAuthenticated,
  getIsStartLoadingReferralDetails,
  getReferralDuration,
  getReferralServerPercent,
  getSuspendedTimer,
} from '../../../reducers';

const additionData = {
  offersReward: 5,
  offersPercent: 5,
  feesValue: null,
};

const ReferralDetail = props => {
  const {
    isAuthenticated,
    getReferralDetails,
    campaignServerPercent,
    indexAbsolutePercent,
    indexServerPercent,
    referralDuration,
    referralServerPercent,
    suspendedTimer,
  } = props;
  useEffect(() => {
    getReferralDetails();
  }, []);

  useEffect(() => {
    additionData.feesValue = getCurrentFeesValue(additionData.offersReward);
  }, [additionData.feesValue]);

  const data = {
    firstPercent: getCurrentOfferPercent(campaignServerPercent),
    secondPercent: getCurrentOfferPercent(indexAbsolutePercent),
    campaignPercent: campaignServerPercent,
    indexPercent: indexServerPercent,
    referralsPercent: referralServerPercent,
    referralDuration,
    waivioOffers: referralServerPercent,
    additionData,
    suspendedTimer,
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
    <React.Fragment>
      {isAuthenticated && (
        <div className="ReferralDetail">
          <h2 className="ReferralDetail__title">{detailTitle}</h2>
          <div className="ReferralDetail__description">{detailDescription}</div>
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
          <div className="ReferralDetail__referral-period">{detailsReferralPeriod}</div>
          <div className="ReferralDetail__referral-sessions">{detailsReferralSessions}</div>
          <div className="ReferralDetail__referral-partners">{detailsReferralPartners}</div>
        </div>
      )}
    </React.Fragment>
  );
};

ReferralDetail.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
  getReferralDetails: PropTypes.func.isRequired,
  campaignServerPercent: PropTypes.number,
  indexAbsolutePercent: PropTypes.number,
  indexServerPercent: PropTypes.number,
  referralDuration: PropTypes.number,
  referralServerPercent: PropTypes.number,
  suspendedTimer: PropTypes.number,
};

ReferralDetail.defaultProps = {
  isStartLoadingReferralDetails: false,
  campaignServerPercent: null,
  indexAbsolutePercent: null,
  indexServerPercent: null,
  referralDuration: null,
  referralServerPercent: null,
  suspendedTimer: null,
};

const mapStateToProps = state => ({
  isAuthenticated: getIsAuthenticated(state),
  campaignServerPercent: getCampaignServerPercent(state),
  indexAbsolutePercent: getIndexAbsolutePercent(state),
  indexServerPercent: getIndexServerPercent(state),
  referralDuration: getReferralDuration(state),
  referralServerPercent: getReferralServerPercent(state),
  suspendedTimer: getSuspendedTimer(state),
  isStartLoadingReferralDetails: getIsStartLoadingReferralDetails(state),
});

export default injectIntl(
  connect(mapStateToProps, {
    getReferralDetails: getUserReferralDetails,
  })(ReferralDetail),
);
