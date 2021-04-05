import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { sponsoredRewardsMainContent } from '../ReferralTextHelper';
import { getStatusSponsoredRewards } from '../ReferralActions';
import { getAuthenticatedUserName, getStatusSponsoredHistory } from '../../../reducers';
import SponsoredRewardsView from './SponsoredRewardsView';

import './SponsoredRewards.less';

const SponsoredRewards = props => {
  const { match, intl, getStatusSponsoredInfo, authSponsorName, statusSponsoredHistory } = props;
  const username = match.params.userName;

  useEffect(() => {
    getStatusSponsoredInfo(authSponsorName, username);
  }, []);

  const data = { username };
  const { sponsoredRewardsTitle } = sponsoredRewardsMainContent(data);

  return (
    <SponsoredRewardsView
      intl={intl}
      statusSponsoredHistory={statusSponsoredHistory}
      sponsoredRewardsTitle={sponsoredRewardsTitle}
    />
  );
};

SponsoredRewards.propTypes = {
  match: PropTypes.shape(),
  intl: PropTypes.shape().isRequired,
  getStatusSponsoredInfo: PropTypes.func,
  authSponsorName: PropTypes.string.isRequired,
  statusSponsoredHistory: PropTypes.shape(),
};

SponsoredRewards.defaultProps = {
  match: {},
  getStatusSponsoredInfo: () => {},
  statusSponsoredHistory: [],
};

const mapStateToProps = state => ({
  authSponsorName: getAuthenticatedUserName(state),
  statusSponsoredHistory: getStatusSponsoredHistory(state),
});

export default connect(mapStateToProps, {
  getStatusSponsoredInfo: getStatusSponsoredRewards,
})(withRouter(injectIntl(SponsoredRewards)));
