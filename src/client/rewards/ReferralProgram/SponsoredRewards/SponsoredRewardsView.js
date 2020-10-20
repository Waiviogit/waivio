import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import SponsoredRewardsHeader from '../constants';
import SponsoredRewardsTableRow from './SponsoredRewardsTableRow/SponsoredRewardsTableRow';

const SponsoredRewardsView = ({ intl, statusSponsoredHistory, sponsoredRewardsTitle }) => (
  <div className="SponsoredRewards">
    <h2 className="SponsoredRewards__title">{sponsoredRewardsTitle}</h2>
    <div className="SponsoredRewards__table">
      <table>
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
            <th className="SponsoredRewards__amount">
              {intl.formatMessage({
                id: 'sponsored_rewards_table_amount',
                defaultMessage: 'Amount',
              })}
              <div>HIVE</div>
            </th>
            <th className="SponsoredRewards__balance">
              {intl.formatMessage({
                id: 'sponsored_rewards_table_balance',
                defaultMessage: 'Balance',
              })}
              <div>HIVE</div>
            </th>
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

SponsoredRewardsView.propTypes = {
  intl: PropTypes.shape().isRequired,
  statusSponsoredHistory: PropTypes.shape(),
  sponsoredRewardsTitle: PropTypes.element,
};

SponsoredRewardsView.defaultProps = {
  statusSponsoredHistory: [],
  sponsoredRewardsTitle: <FormattedMessage />,
};

export default SponsoredRewardsView;
