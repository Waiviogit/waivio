import React, { useEffect } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentFeesValue, getCurrentOfferPercent } from '../ReferralHelper';
import { getUserReferralDetails } from '../../../store/referralStore/ReferralActions';
import ReferralDetailsView from './ReferralDetailsView';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
} from '../../../store/authStore/authSelectors';
import {
  getCampaignServerPercent,
  getIndexAbsolutePercent,
  getIndexServerPercent,
  getIsStartLoadingReferralDetails,
  getReferralDuration,
  getReferralServerPercent,
  getSuspendedTimer,
} from '../../../store/referralStore/referralSelectors';

import './ReferralDetails.less';

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
    username,
  } = props;

  useEffect(() => {
    getReferralDetails();
  }, []);

  useEffect(() => {
    additionData.feesValue = getCurrentFeesValue(additionData.offersReward);
  }, [additionData.feesValue]);

  const data = {
    username,
    firstPercent: getCurrentOfferPercent(campaignServerPercent),
    secondPercent: getCurrentOfferPercent(indexAbsolutePercent),
    campaignPercent: campaignServerPercent,
    indexPercent: indexServerPercent,
    referralsPercent: referralServerPercent,
    referralDuration,
    additionData,
    suspendedTimer,
  };

  return <ReferralDetailsView isAuthenticated={isAuthenticated} data={data} />;
};

ReferralDetail.propTypes = {
  username: PropTypes.string,
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
  username: '',
  isStartLoadingReferralDetails: false,
  campaignServerPercent: null,
  indexAbsolutePercent: null,
  indexServerPercent: null,
  referralDuration: null,
  referralServerPercent: null,
  suspendedTimer: null,
};

const mapStateToProps = state => ({
  username: getAuthenticatedUserName(state),
  isAuthenticated: getIsAuthenticated(state),
  campaignServerPercent: getCampaignServerPercent(state),
  indexAbsolutePercent: getIndexAbsolutePercent(state),
  indexServerPercent: getIndexServerPercent(state),
  referralDuration: getReferralDuration(state),
  referralServerPercent: getReferralServerPercent(state),
  suspendedTimer: getSuspendedTimer(state),
  isStartLoadingReferralDetails: getIsStartLoadingReferralDetails(state),
});

export default connect(mapStateToProps, {
  getReferralDetails: getUserReferralDetails,
})(injectIntl(ReferralDetail));
