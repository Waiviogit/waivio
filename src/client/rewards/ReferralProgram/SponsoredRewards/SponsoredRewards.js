import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { get } from 'lodash';
import { SponsoredRewardsMainContent } from '../ReferralTextHelper';
import SponsoredRewardsHeader from '../constants';
import { getStatusSponsoredRewards } from '../ReferralActions';
import { getAuthenticatedUserName, getStatusSponsoredHistory } from '../../../reducers';
import SponsoredRewardsTableRow from './SponsoredRewardsTableRow/SponsoredRewardsTableRow';

import './SponsoredRewards.less';

const SponsoredRewardsView = (intl, statusSponsoredHistory, sponsoredRewardsTitle) => (
  <div className="SponsoredRewards">
    <h2 className="SponsoredRewards__title">{sponsoredRewardsTitle}</h2>
    <div className="SponsoredRewards__table">
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            {SponsoredRewardsHeader.map(tdElement => (
              <th key={tdElement.id} className={tdElement.className}>
                {intl.formatMessage({
                  id: tdElement.id,
                  defaultMessage: tdElement.message,
                })}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {statusSponsoredHistory.map(sponsor => (
            <SponsoredRewardsTableRow key={get(sponsor, '_id', '')} intl={intl} sponsor={sponsor} />
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SponsoredRewards = props => {
  const { match, intl, getStatusSponsoredInfo, authSponsorName, statusSponsoredHistory } = props;
  const username = match.params.userName;

  useEffect(() => {
    getStatusSponsoredInfo(authSponsorName, username);
  }, []);

  const data = { username };
  const { sponsoredRewardsTitle } = SponsoredRewardsMainContent(data);
  return SponsoredRewardsView(intl, statusSponsoredHistory, sponsoredRewardsTitle);
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
