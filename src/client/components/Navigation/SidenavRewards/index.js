import { connect } from 'react-redux';

import SidenavRewards from './SidenavRewards';
import {
  getAuthenticatedUserName,
  getIsAuthenticated,
  isGuestUser,
} from '../../../../store/authStore/authSelectors';
import { getAutoCompleteSearchResults } from '../../../../store/searchStore/searchSelectors';
import {
  getCountTookPartCampaigns,
  getCreatedCampaignsCount,
  getExpiredPayment,
  getHasReceivables,
} from '../../../../store/rewardsStore/rewardsSelectors';
import { getIsWaivio } from '../../../../store/appStore/appSelectors';

const mapStateToProps = state => ({
  isGuest: isGuestUser(state),
  isWaivio: getIsWaivio(state),
  isExpired: getExpiredPayment(state),
  hasReceivables: getHasReceivables(state),
  authenticated: getIsAuthenticated(state),
  authUserName: getAuthenticatedUserName(state),
  createdCampaignsCount: getCreatedCampaignsCount(state),
  countTookPartCampaigns: getCountTookPartCampaigns(state),
  autoCompleteSearchResults: getAutoCompleteSearchResults(state),
});

export default connect(mapStateToProps)(SidenavRewards);
